using InstantMessenger.Api.Models.Enums;

namespace InstantMessenger.Api.Models;

public class ChatMember
{
    public Guid ChatId { get; set; }
    public Guid UserId { get; set; }
    public ChatMemberRole Role { get; set; } = ChatMemberRole.Member;
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
    public Chat Chat { get; set; } = null!;
    public User User { get; set; } = null!;
}
