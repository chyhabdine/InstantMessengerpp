using InstantMessenger.Api.Models.Enums;

namespace InstantMessenger.Api.Models;

public class UserProfile
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
    public string StatusMessage { get; set; } = string.Empty;
    public PresenceStatus Presence { get; set; } = PresenceStatus.Offline;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public User User { get; set; } = null!;
}
