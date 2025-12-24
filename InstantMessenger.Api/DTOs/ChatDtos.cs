using InstantMessenger.Api.Models.Enums;

namespace InstantMessenger.Api.DTOs;

public class CreateChatRequest
{
    public string Name { get; set; } = string.Empty;
    public bool IsGroup { get; set; }
    public List<Guid> MemberIds { get; set; } = new();
}

public class AddChatMemberRequest
{
    public Guid UserId { get; set; }
    public ChatMemberRole Role { get; set; } = ChatMemberRole.Member;
}

public class ChatDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool IsGroup { get; set; }
    public List<ChatMemberDto> Members { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}

public class ChatMemberDto
{
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public ChatMemberRole Role { get; set; }
}
