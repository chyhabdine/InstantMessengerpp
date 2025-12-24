using InstantMessenger.Api.DTOs;
using InstantMessenger.Api.Models;

namespace InstantMessenger.Api.Services.Interfaces;

public interface IChatService
{
    Task<ChatDto> CreateChatAsync(Guid creatorId, CreateChatRequest request);
    Task<IEnumerable<ChatDto>> GetChatsForUserAsync(Guid userId);
    Task AddMemberAsync(Guid chatId, AddChatMemberRequest request);
    Task<bool> UserInChatAsync(Guid chatId, Guid userId);
    Task<Chat?> GetChatAsync(Guid chatId);
}
