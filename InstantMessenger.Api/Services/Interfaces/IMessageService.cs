using InstantMessenger.Api.DTOs;
using InstantMessenger.Api.Models.Enums;

namespace InstantMessenger.Api.Services.Interfaces;

public interface IMessageService
{
    Task<MessageDto> SendMessageAsync(Guid senderId, SendMessageRequest request);
    Task<IEnumerable<MessageDto>> GetMessagesAsync(Guid chatId, Guid userId);
    Task<ReactionDto> ReactAsync(Guid userId, Guid messageId, ReactionType type);
}
