namespace InstantMessenger.Api.Models;

public class Device
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool IsOnline { get; set; }
    public DateTime LastSeenAt { get; set; } = DateTime.UtcNow;
    public User User { get; set; } = null!;
    public ICollection<Session> Sessions { get; set; } = new List<Session>();
}
