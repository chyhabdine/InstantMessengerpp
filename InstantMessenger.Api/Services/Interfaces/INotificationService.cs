using InstantMessenger.Api.DTOs;
using InstantMessenger.Api.Models;

namespace InstantMessenger.Api.Services.Interfaces;

public interface INotificationService
{
    Task<Notification> CreateAsync(Notification notification);
    Task<IEnumerable<NotificationDto>> GetForUserAsync(Guid userId);
    Task MarkAsync(Guid notificationId, bool isRead, Guid userId);
}
