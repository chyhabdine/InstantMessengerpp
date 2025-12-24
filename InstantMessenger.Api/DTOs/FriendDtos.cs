using InstantMessenger.Api.Models.Enums;

namespace InstantMessenger.Api.DTOs;

public class FriendRequestDto
{
    public Guid Id { get; set; }
    public Guid FromUserId { get; set; }
    public Guid ToUserId { get; set; }
    public FriendRequestStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateFriendRequest
{
    public Guid ToUserId { get; set; }
}

public class RespondFriendRequest
{
    public FriendRequestStatus Status { get; set; }
}
