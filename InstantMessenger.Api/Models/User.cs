using InstantMessenger.Api.Models.Enums;

namespace InstantMessenger.Api.Models;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Email { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public int RoleId { get; set; }
    public Role Role { get; set; } = null!;
    public UserProfile Profile { get; set; } = null!;
    public ICollection<Session> Sessions { get; set; } = new List<Session>();
    public ICollection<Device> Devices { get; set; } = new List<Device>();
    public ICollection<ChatMember> ChatMembers { get; set; } = new List<ChatMember>();
    public ICollection<Message> Messages { get; set; } = new List<Message>();
    public ICollection<FriendRequest> SentFriendRequests { get; set; } = new List<FriendRequest>();
    public ICollection<FriendRequest> ReceivedFriendRequests { get; set; } = new List<FriendRequest>();
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    public ICollection<Reaction> Reactions { get; set; } = new List<Reaction>();
    public ICollection<Attachment> Attachments { get; set; } = new List<Attachment>();
    public ICollection<Chat> CreatedChats { get; set; } = new List<Chat>();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public PresenceStatus Presence { get; set; } = PresenceStatus.Offline;
}
