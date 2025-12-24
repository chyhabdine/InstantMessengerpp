using InstantMessenger.Api.Data;
using InstantMessenger.Api.DTOs;
using InstantMessenger.Api.Models.Enums;
using InstantMessenger.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace InstantMessenger.Api.Services.Implementations;

public class UserService : IUserService
{
    private readonly AppDbContext _context;

    public UserService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<UserProfileDto?> GetProfileAsync(Guid userId)
    {
        var user = await _context.Users
            .Include(u => u.Profile)
            .Include(u => u.Role)
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == userId);

        return user is null ? null : Map(user);
    }

    public async Task<UserProfileDto?> GetProfileByIdAsync(Guid userId)
    {
        return await GetProfileAsync(userId);
    }

    public async Task UpdateProfileAsync(Guid userId, UpdateProfileRequest request)
    {
        var user = await _context.Users.Include(u => u.Profile).FirstOrDefaultAsync(u => u.Id == userId);
        if (user is null)
        {
            throw new InvalidOperationException("User not found.");
        }

        user.Profile.DisplayName = request.DisplayName;
        user.Profile.AvatarUrl = request.AvatarUrl;
        user.Profile.StatusMessage = request.StatusMessage;
        user.Profile.Presence = request.Presence;
        user.Profile.UpdatedAt = DateTime.UtcNow;
        user.Presence = request.Presence;

        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<ContactDto>> GetContactsAsync(Guid userId)
    {
        var accepted = await _context.FriendRequests
            .Where(fr => fr.Status == FriendRequestStatus.Accepted && (fr.FromUserId == userId || fr.ToUserId == userId))
            .Include(fr => fr.FromUser).ThenInclude(u => u.Profile)
            .Include(fr => fr.ToUser).ThenInclude(u => u.Profile)
            .ToListAsync();

        var contacts = new List<ContactDto>();
        foreach (var fr in accepted)
        {
            var contactUser = fr.FromUserId == userId ? fr.ToUser : fr.FromUser;
            contacts.Add(new ContactDto
            {
                UserId = contactUser.Id,
                UserName = contactUser.UserName,
                DisplayName = contactUser.Profile.DisplayName,
                Presence = contactUser.Profile.Presence
            });
        }

        return contacts;
    }

    public async Task<IEnumerable<UserProfileDto>> GetDirectoryAsync(string? search = null)
    {
        var query = _context.Users
            .Include(u => u.Profile)
            .Include(u => u.Role)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(u => u.UserName.ToLower().Contains(search.ToLower()) || u.Email.ToLower().Contains(search.ToLower()));
        }

        var users = await query.AsNoTracking().ToListAsync();
        return users.Select(Map);
    }

    private static UserProfileDto Map(InstantMessenger.Api.Models.User user)
    {
        return new UserProfileDto
        {
            UserId = user.Id,
            Email = user.Email,
            UserName = user.UserName,
            DisplayName = user.Profile.DisplayName,
            AvatarUrl = user.Profile.AvatarUrl,
            StatusMessage = user.Profile.StatusMessage,
            Presence = user.Profile.Presence,
            Role = user.Role.Name
        };
    }
}
