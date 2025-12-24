using InstantMessenger.Api.Models.Enums;

namespace InstantMessenger.Api.DTOs;

public class SendMessageRequest
{
    public Guid ChatId { get; set; }
    public string Content { get; set; } = string.Empty;
    public List<AttachmentDto> Attachments { get; set; } = new();
    public Guid? ReplyToMessageId { get; set; }
}

public class AttachmentDto
{
    public string FileName { get; set; } = string.Empty;
    public string FileUrl { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long SizeBytes { get; set; }
}

public class MessageDto
{
    public Guid Id { get; set; }
    public Guid ChatId { get; set; }
    public Guid SenderId { get; set; }
    public string SenderName { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime SentAt { get; set; }
    public IEnumerable<AttachmentDto> Attachments { get; set; } = Enumerable.Empty<AttachmentDto>();
    public IEnumerable<ReactionDto> Reactions { get; set; } = Enumerable.Empty<ReactionDto>();
}

public class ReactionDto
{
    public Guid MessageId { get; set; }
    public Guid UserId { get; set; }
    public ReactionType Type { get; set; }
}
