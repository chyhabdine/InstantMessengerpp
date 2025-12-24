namespace InstantMessenger.Api.Models;

public class Message
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ChatId { get; set; }
    public Guid SenderId { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime SentAt { get; set; } = DateTime.UtcNow;
    public DateTime? EditedAt { get; set; }
    public Guid? ReplyToMessageId { get; set; }
    public Message? ReplyToMessage { get; set; }
    public Chat Chat { get; set; } = null!;
    public User Sender { get; set; } = null!;
    public ICollection<Message> Replies { get; set; } = new List<Message>();
    public ICollection<Attachment> Attachments { get; set; } = new List<Attachment>();
    public ICollection<Reaction> Reactions { get; set; } = new List<Reaction>();
}
