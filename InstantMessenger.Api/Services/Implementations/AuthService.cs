using InstantMessenger.Api.Auth;
using InstantMessenger.Api.Data;
using InstantMessenger.Api.DTOs;
using InstantMessenger.Api.Models;
using InstantMessenger.Api.Models.Enums;
using InstantMessenger.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace InstantMessenger.Api.Services.Implementations;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly ITokenService _tokenService;
    private readonly JwtSettings _jwtSettings;

    public AuthService(AppDbContext context, ITokenService tokenService, IOptions<JwtSettings> jwtSettings)
    {
        _context = context;
        _tokenService = tokenService;
        _jwtSettings = jwtSettings.Value;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
        {
            throw new InvalidOperationException("Email already registered.");
        }

        if (await _context.Users.AnyAsync(u => u.UserName == request.UserName))
        {
            throw new InvalidOperationException("Username already taken.");
        }

        var user = new User
        {
            Email = request.Email,
            UserName = request.UserName,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            RoleId = 2,
            Presence = PresenceStatus.Online,
            Profile = new UserProfile
            {
                DisplayName = string.IsNullOrWhiteSpace(request.DisplayName) ? request.UserName : request.DisplayName,
                AvatarUrl = string.Empty,
                StatusMessage = "Available",
                Presence = PresenceStatus.Online
            }
        };

        var device = new Device
        {
            Name = request.DeviceName,
            IsOnline = true,
            LastSeenAt = DateTime.UtcNow,
            User = user
        };

        var refreshToken = _tokenService.GenerateRefreshToken();
        var session = new Session
        {
            User = user,
            Device = device,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpirationDays)
        };

        _context.Users.Add(user);
        _context.Devices.Add(device);
        _context.Sessions.Add(session);
        await _context.SaveChangesAsync();

        var accessToken = _tokenService.GenerateAccessToken(user, new[] { "User" });

        return new AuthResponse
        {
            UserId = user.Id,
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            Role = "User",
            DisplayName = user.Profile.DisplayName
        };
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await _context.Users
            .Include(u => u.Profile)
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user is null)
        {
            throw new InvalidOperationException("Invalid credentials.");
        }

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            throw new InvalidOperationException("Invalid credentials.");
        }

        var device = await _context.Devices.FirstOrDefaultAsync(d => d.UserId == user.Id && d.Name == request.DeviceName);
        if (device is null)
        {
            device = new Device
            {
                UserId = user.Id,
                Name = request.DeviceName,
                IsOnline = true,
                LastSeenAt = DateTime.UtcNow
            };
            _context.Devices.Add(device);
        }
        else
        {
            device.IsOnline = true;
            device.LastSeenAt = DateTime.UtcNow;
            _context.Devices.Update(device);
        }

        user.Presence = PresenceStatus.Online;
        _context.Users.Update(user);

        var refreshToken = _tokenService.GenerateRefreshToken();
        var session = new Session
        {
            UserId = user.Id,
            Device = device,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpirationDays)
        };

        _context.Sessions.Add(session);
        await _context.SaveChangesAsync();

        var accessToken = _tokenService.GenerateAccessToken(user, new[] { user.Role.Name });

        return new AuthResponse
        {
            UserId = user.Id,
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            Role = user.Role.Name,
            DisplayName = user.Profile.DisplayName
        };
    }

    public async Task<AuthResponse> RefreshAsync(Guid userId, RefreshRequest request)
    {
        var session = await _context.Sessions
            .Include(s => s.User)
            .ThenInclude(u => u.Role)
            .Include(s => s.User)
            .ThenInclude(u => u.Profile)
            .Include(s => s.Device)
            .FirstOrDefaultAsync(s => s.UserId == userId && s.RefreshToken == request.RefreshToken);

        if (session is null || session.ExpiresAt < DateTime.UtcNow)
        {
            throw new InvalidOperationException("Invalid refresh token.");
        }

        var device = session.Device;
        if (device is not null)
        {
            device.IsOnline = true;
            device.LastSeenAt = DateTime.UtcNow;
            _context.Devices.Update(device);
        }

        var newRefreshToken = _tokenService.GenerateRefreshToken();
        session.RefreshToken = newRefreshToken;
        session.ExpiresAt = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpirationDays);
        _context.Sessions.Update(session);

        var accessToken = _tokenService.GenerateAccessToken(session.User, new[] { session.User.Role.Name });
        await _context.SaveChangesAsync();

        return new AuthResponse
        {
            UserId = session.UserId,
            AccessToken = accessToken,
            RefreshToken = newRefreshToken,
            Role = session.User.Role.Name,
            DisplayName = session.User.Profile.DisplayName
        };
    }
}
