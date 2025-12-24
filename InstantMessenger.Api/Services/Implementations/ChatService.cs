using InstantMessenger.Api.Data;
using InstantMessenger.Api.DTOs;
using InstantMessenger.Api.Models;
using InstantMessenger.Api.Models.Enums;
using InstantMessenger.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace InstantMessenger.Api.Services.Implementations;

public class ChatService : IChatService
{
    private readonly AppDbContext _context;

    public ChatService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ChatDto> CreateChatAsync(Guid creatorId, CreateChatRequest request)
    {
        var creator = await _context.Users.FirstOrDefaultAsync(u => u.Id == creatorId)
                      ?? throw new InvalidOperationException("Creator not found.");

        var memberIds = request.MemberIds.Distinct().ToList();
        if (!memberIds.Contains(creatorId))
        {
            memberIds.Add(creatorId);
        }

        if (!request.IsGroup && memberIds.Count != 2)
        {
            throw new InvalidOperationException("Private chats must have exactly two participants.");
        }

        var users = await _context.Users.Where(u => memberIds.Contains(u.Id)).ToListAsync();
        if (users.Count != memberIds.Count)
        {
            throw new InvalidOperationException("One or more users were not found.");
        }

        var chat = new Chat
        {
            Name = string.IsNullOrWhiteSpace(request.Name) && !request.IsGroup
                ? string.Join(", ", users.Where(u => u.Id != creatorId).Select(u => u.UserName))
                : request.Name,
            IsGroup = request.IsGroup,
            CreatedByUserId = creatorId,
            CreatedAt = DateTime.UtcNow
        };

        foreach (var memberId in memberIds)
        {
            var role = memberId == creatorId ? ChatMemberRole.Owner : ChatMemberRole.Member;
            chat.Members.Add(new ChatMember
            {
                UserId = memberId,
                Role = role,
                JoinedAt = DateTime.UtcNow
            });
        }

        _context.Chats.Add(chat);
        await _context.SaveChangesAsync();

        return await Map(chat.Id);
    }

    public async Task<IEnumerable<ChatDto>> GetChatsForUserAsync(Guid userId)
    {
        var chats = await _context.ChatMembers
            .Where(cm => cm.UserId == userId)
            .Include(cm => cm.Chat)
            .ThenInclude(c => c.Members)
            .ThenInclude(m => m.User)
            .ThenInclude(u => u.Profile)
            .ToListAsync();

        var chatIds = chats.Select(c => c.ChatId).Distinct().ToList();
        var result = new List<ChatDto>();

        foreach (var chatId in chatIds)
        {
            result.Add(await Map(chatId));
        }

        return result;
    }

    public async Task AddMemberAsync(Guid chatId, AddChatMemberRequest request)
    {
        var chat = await _context.Chats.Include(c => c.Members).FirstOrDefaultAsync(c => c.Id == chatId);
        if (chat is null)
        {
            throw new InvalidOperationException("Chat not found.");
        }

        if (chat.Members.Any(m => m.UserId == request.UserId))
        {
            return;
        }

        chat.Members.Add(new ChatMember
        {
            ChatId = chatId,
            UserId = request.UserId,
            Role = request.Role,
            JoinedAt = DateTime.UtcNow
        });

        _context.Chats.Update(chat);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> UserInChatAsync(Guid chatId, Guid userId)
    {
        return await _context.ChatMembers.AnyAsync(cm => cm.ChatId == chatId && cm.UserId == userId);
    }

    public async Task<Chat?> GetChatAsync(Guid chatId)
    {
        return await _context.Chats
            .Include(c => c.Members)
            .ThenInclude(m => m.User)
            .ThenInclude(u => u.Profile)
            .FirstOrDefaultAsync(c => c.Id == chatId);
    }

    private async Task<ChatDto> Map(Guid chatId)
    {
        var chat = await GetChatAsync(chatId) ?? throw new InvalidOperationException("Chat not found.");

        return new ChatDto
        {
            Id = chat.Id,
            Name = chat.Name,
            IsGroup = chat.IsGroup,
            CreatedAt = chat.CreatedAt,
            Members = chat.Members.Select(m => new ChatMemberDto
            {
                UserId = m.UserId,
                UserName = m.User.UserName,
                Role = m.Role
            }).ToList()
        };
    }
}
