using InstantMessenger.Api.DTOs;

namespace InstantMessenger.Api.Services.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<AuthResponse> RefreshAsync(Guid userId, RefreshRequest request);
}
