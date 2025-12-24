using InstantMessenger.Api.Data;
using InstantMessenger.Api.DTOs;
using InstantMessenger.Api.Models;
using InstantMessenger.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace InstantMessenger.Api.Services.Implementations;

public class NotificationService : INotificationService
{
    private readonly AppDbContext _context;

    public NotificationService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Notification> CreateAsync(Notification notification)
    {
        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync();
        return notification;
    }

    public async Task<IEnumerable<NotificationDto>> GetForUserAsync(Guid userId)
    {
        var notifications = await _context.Notifications
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .AsNoTracking()
            .ToListAsync();

        return notifications.Select(n => new NotificationDto
        {
            Id = n.Id,
            Type = n.Type,
            Content = n.Content,
            RelatedChatId = n.RelatedChatId,
            RelatedMessageId = n.RelatedMessageId,
            IsRead = n.IsRead,
            CreatedAt = n.CreatedAt
        });
    }

    public async Task MarkAsync(Guid notificationId, bool isRead, Guid userId)
    {
        var notification = await _context.Notifications.FirstOrDefaultAsync(n => n.Id == notificationId && n.UserId == userId);
        if (notification is null)
        {
            throw new InvalidOperationException("Notification not found.");
        }

        notification.IsRead = isRead;
        notification.ReadAt = isRead ? DateTime.UtcNow : null;
        _context.Notifications.Update(notification);
        await _context.SaveChangesAsync();
    }
}
