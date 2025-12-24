using InstantMessenger.Api.DTOs;

namespace InstantMessenger.Api.Services.Interfaces;

public interface IFriendshipService
{
    Task<FriendRequestDto> SendRequestAsync(Guid fromUserId, CreateFriendRequest request);
    Task<FriendRequestDto?> RespondAsync(Guid requestId, Guid userId, RespondFriendRequest request);
    Task<IEnumerable<FriendRequestDto>> GetIncomingAsync(Guid userId);
    Task<IEnumerable<FriendRequestDto>> GetOutgoingAsync(Guid userId);
    Task<IEnumerable<ContactDto>> GetFriendsAsync(Guid userId);
}
