using InstantMessenger.Api.Models.Enums;

namespace InstantMessenger.Api.Models;

public class Notification
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public NotificationType Type { get; set; } = NotificationType.System;
    public string Content { get; set; } = string.Empty;
    public Guid? RelatedChatId { get; set; }
    public Guid? RelatedMessageId { get; set; }
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ReadAt { get; set; }
    public User User { get; set; } = null!;
}
