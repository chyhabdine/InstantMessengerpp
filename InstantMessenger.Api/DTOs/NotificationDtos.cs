using InstantMessenger.Api.Models.Enums;

namespace InstantMessenger.Api.DTOs;

public class NotificationDto
{
    public Guid Id { get; set; }
    public NotificationType Type { get; set; }
    public string Content { get; set; } = string.Empty;
    public Guid? RelatedChatId { get; set; }
    public Guid? RelatedMessageId { get; set; }
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class MarkNotificationRequest
{
    public bool IsRead { get; set; }
}
