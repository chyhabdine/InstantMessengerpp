using InstantMessenger.Api.Data;
using InstantMessenger.Api.DTOs;
using InstantMessenger.Api.Models;
using InstantMessenger.Api.Models.Enums;
using InstantMessenger.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace InstantMessenger.Api.Services.Implementations;

public class MessageService : IMessageService
{
    private readonly AppDbContext _context;
    private readonly IChatService _chatService;
    private readonly INotificationService _notificationService;

    public MessageService(AppDbContext context, IChatService chatService, INotificationService notificationService)
    {
        _context = context;
        _chatService = chatService;
        _notificationService = notificationService;
    }

    public async Task<MessageDto> SendMessageAsync(Guid senderId, SendMessageRequest request)
    {
        if (!await _chatService.UserInChatAsync(request.ChatId, senderId))
        {
            throw new InvalidOperationException("You are not a member of this chat.");
        }

        var chat = await _context.Chats
            .Include(c => c.Members)
            .FirstOrDefaultAsync(c => c.Id == request.ChatId)
            ?? throw new InvalidOperationException("Chat not found.");

        var message = new Message
        {
            ChatId = request.ChatId,
            SenderId = senderId,
            Content = request.Content,
            SentAt = DateTime.UtcNow,
            ReplyToMessageId = request.ReplyToMessageId
        };

        foreach (var att in request.Attachments)
        {
            message.Attachments.Add(new Attachment
            {
                FileName = att.FileName,
                FileUrl = att.FileUrl,
                ContentType = att.ContentType,
                SizeBytes = att.SizeBytes,
                OwnerId = senderId
            });
        }

        _context.Messages.Add(message);

        var recipients = chat.Members.Where(m => m.UserId != senderId).Select(m => m.UserId).ToList();
        foreach (var recipient in recipients)
        {
            await _notificationService.CreateAsync(new Notification
            {
                UserId = recipient,
                Type = NotificationType.Message,
                Content = "New message received",
                RelatedChatId = chat.Id,
                RelatedMessageId = message.Id
            });
        }

        await _context.SaveChangesAsync();
        return await Map(message.Id);
    }

    public async Task<IEnumerable<MessageDto>> GetMessagesAsync(Guid chatId, Guid userId)
    {
        if (!await _chatService.UserInChatAsync(chatId, userId))
        {
            throw new InvalidOperationException("You are not a member of this chat.");
        }

        var messages = await _context.Messages
            .Include(m => m.Sender)
            .ThenInclude(u => u.Profile)
            .Include(m => m.Attachments)
            .Include(m => m.Reactions)
            .Where(m => m.ChatId == chatId)
            .OrderBy(m => m.SentAt)
            .ToListAsync();

        return messages.Select(m => new MessageDto
        {
            Id = m.Id,
            ChatId = m.ChatId,
            SenderId = m.SenderId,
            SenderName = m.Sender.Profile.DisplayName,
            Content = m.Content,
            SentAt = m.SentAt,
            Attachments = m.Attachments.Select(a => new AttachmentDto
            {
                FileName = a.FileName,
                FileUrl = a.FileUrl,
                ContentType = a.ContentType,
                SizeBytes = a.SizeBytes
            }).ToList(),
            Reactions = m.Reactions.Select(r => new ReactionDto
            {
                MessageId = r.MessageId,
                UserId = r.UserId,
                Type = r.Type
            }).ToList()
        });
    }

    public async Task<ReactionDto> ReactAsync(Guid userId, Guid messageId, ReactionType type)
    {
        var message = await _context.Messages
            .Include(m => m.Chat)
            .ThenInclude(c => c.Members)
            .FirstOrDefaultAsync(m => m.Id == messageId)
            ?? throw new InvalidOperationException("Message not found.");

        if (!message.Chat.Members.Any(m => m.UserId == userId))
        {
            throw new InvalidOperationException("You are not a member of this chat.");
        }

        var existing = await _context.Reactions.FirstOrDefaultAsync(r => r.MessageId == messageId && r.UserId == userId);
        if (existing is null)
        {
            existing = new Reaction
            {
                MessageId = messageId,
                UserId = userId,
                Type = type
            };
            _context.Reactions.Add(existing);
        }
        else
        {
            existing.Type = type;
            existing.CreatedAt = DateTime.UtcNow;
            _context.Reactions.Update(existing);
        }

        await _context.SaveChangesAsync();

        return new ReactionDto
        {
            MessageId = messageId,
            UserId = userId,
            Type = type
        };
    }

    private async Task<MessageDto> Map(Guid messageId)
    {
        var message = await _context.Messages
            .Include(m => m.Sender).ThenInclude(u => u.Profile)
            .Include(m => m.Attachments)
            .Include(m => m.Reactions)
            .FirstOrDefaultAsync(m => m.Id == messageId)
            ?? throw new InvalidOperationException("Message not found.");

        return new MessageDto
        {
            Id = message.Id,
            ChatId = message.ChatId,
            SenderId = message.SenderId,
            SenderName = message.Sender.Profile.DisplayName,
            Content = message.Content,
            SentAt = message.SentAt,
            Attachments = message.Attachments.Select(a => new AttachmentDto
            {
                FileName = a.FileName,
                FileUrl = a.FileUrl,
                ContentType = a.ContentType,
                SizeBytes = a.SizeBytes
            }),
            Reactions = message.Reactions.Select(r => new ReactionDto
            {
                MessageId = r.MessageId,
                UserId = r.UserId,
                Type = r.Type
            })
        };
    }
}
