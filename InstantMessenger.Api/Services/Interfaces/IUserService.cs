using InstantMessenger.Api.DTOs;

namespace InstantMessenger.Api.Services.Interfaces;

public interface IUserService
{
    Task<UserProfileDto?> GetProfileAsync(Guid userId);
    Task<UserProfileDto?> GetProfileByIdAsync(Guid userId);
    Task UpdateProfileAsync(Guid userId, UpdateProfileRequest request);
    Task<IEnumerable<ContactDto>> GetContactsAsync(Guid userId);
    Task<IEnumerable<UserProfileDto>> GetDirectoryAsync(string? search = null);
}
