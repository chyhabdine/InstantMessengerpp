using InstantMessenger.Api.Models.Enums;

namespace InstantMessenger.Api.DTOs;

public class UserProfileDto
{
    public Guid UserId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
    public string StatusMessage { get; set; } = string.Empty;
    public PresenceStatus Presence { get; set; }
    public string Role { get; set; } = string.Empty;
}

public class UpdateProfileRequest
{
    public string DisplayName { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
    public string StatusMessage { get; set; } = string.Empty;
    public PresenceStatus Presence { get; set; } = PresenceStatus.Online;
}

public class ContactDto
{
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public PresenceStatus Presence { get; set; }
}
