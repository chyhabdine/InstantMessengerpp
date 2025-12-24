using InstantMessenger.Api.Models.Enums;

namespace InstantMessenger.Api.Models;

public class Reaction
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid MessageId { get; set; }
    public Guid UserId { get; set; }
    public ReactionType Type { get; set; } = ReactionType.Like;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Message Message { get; set; } = null!;
    public User User { get; set; } = null!;
}
