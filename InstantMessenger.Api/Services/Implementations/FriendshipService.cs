using InstantMessenger.Api.Data;
using InstantMessenger.Api.DTOs;
using InstantMessenger.Api.Models;
using InstantMessenger.Api.Models.Enums;
using InstantMessenger.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace InstantMessenger.Api.Services.Implementations;

public class FriendshipService : IFriendshipService
{
    private readonly AppDbContext _context;
    private readonly INotificationService _notificationService;

    public FriendshipService(AppDbContext context, INotificationService notificationService)
    {
        _context = context;
        _notificationService = notificationService;
    }

    public async Task<FriendRequestDto> SendRequestAsync(Guid fromUserId, CreateFriendRequest request)
    {
        if (fromUserId == request.ToUserId)
        {
            throw new InvalidOperationException("Cannot send a friend request to yourself.");
        }

        var exists = await _context.FriendRequests.AnyAsync(fr =>
            fr.FromUserId == fromUserId && fr.ToUserId == request.ToUserId && fr.Status == FriendRequestStatus.Pending);
        if (exists)
        {
            throw new InvalidOperationException("Friend request already sent.");
        }

        var targetExists = await _context.Users.AnyAsync(u => u.Id == request.ToUserId);
        if (!targetExists)
        {
            throw new InvalidOperationException("Target user not found.");
        }

        var friendRequest = new FriendRequest
        {
            FromUserId = fromUserId,
            ToUserId = request.ToUserId,
            Status = FriendRequestStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };

        _context.FriendRequests.Add(friendRequest);
        await _context.SaveChangesAsync();

        await _notificationService.CreateAsync(new Notification
        {
            UserId = request.ToUserId,
            Type = NotificationType.FriendRequest,
            Content = "New friend request received",
            RelatedChatId = null,
            RelatedMessageId = null
        });

        return new FriendRequestDto
        {
            Id = friendRequest.Id,
            FromUserId = fromUserId,
            ToUserId = request.ToUserId,
            Status = friendRequest.Status,
            CreatedAt = friendRequest.CreatedAt
        };
    }

    public async Task<FriendRequestDto?> RespondAsync(Guid requestId, Guid userId, RespondFriendRequest request)
    {
        var friendRequest = await _context.FriendRequests.FirstOrDefaultAsync(fr => fr.Id == requestId && fr.ToUserId == userId);
        if (friendRequest is null)
        {
            throw new InvalidOperationException("Friend request not found.");
        }

        if (friendRequest.Status != FriendRequestStatus.Pending)
        {
            throw new InvalidOperationException("Friend request already handled.");
        }

        friendRequest.Status = request.Status;
        friendRequest.RespondedAt = DateTime.UtcNow;
        _context.FriendRequests.Update(friendRequest);
        await _context.SaveChangesAsync();

        await _notificationService.CreateAsync(new Notification
        {
            UserId = friendRequest.FromUserId,
            Type = NotificationType.FriendRequest,
            Content = $"Friend request {request.Status}",
            RelatedChatId = null,
            RelatedMessageId = null
        });

        return new FriendRequestDto
        {
            Id = friendRequest.Id,
            FromUserId = friendRequest.FromUserId,
            ToUserId = friendRequest.ToUserId,
            Status = friendRequest.Status,
            CreatedAt = friendRequest.CreatedAt
        };
    }

    public async Task<IEnumerable<FriendRequestDto>> GetIncomingAsync(Guid userId)
    {
        var requests = await _context.FriendRequests
            .Where(fr => fr.ToUserId == userId)
            .OrderByDescending(fr => fr.CreatedAt)
            .ToListAsync();

        return requests.Select(fr => new FriendRequestDto
        {
            Id = fr.Id,
            FromUserId = fr.FromUserId,
            ToUserId = fr.ToUserId,
            Status = fr.Status,
            CreatedAt = fr.CreatedAt
        });
    }

    public async Task<IEnumerable<FriendRequestDto>> GetOutgoingAsync(Guid userId)
    {
        var requests = await _context.FriendRequests
            .Where(fr => fr.FromUserId == userId)
            .OrderByDescending(fr => fr.CreatedAt)
            .ToListAsync();

        return requests.Select(fr => new FriendRequestDto
        {
            Id = fr.Id,
            FromUserId = fr.FromUserId,
            ToUserId = fr.ToUserId,
            Status = fr.Status,
            CreatedAt = fr.CreatedAt
        });
    }

    public async Task<IEnumerable<ContactDto>> GetFriendsAsync(Guid userId)
    {
        var accepted = await _context.FriendRequests
            .Where(fr => fr.Status == FriendRequestStatus.Accepted && (fr.FromUserId == userId || fr.ToUserId == userId))
            .Include(fr => fr.FromUser).ThenInclude(u => u.Profile)
            .Include(fr => fr.ToUser).ThenInclude(u => u.Profile)
            .ToListAsync();

        var contacts = new List<ContactDto>();
        foreach (var fr in accepted)
        {
            var contact = fr.FromUserId == userId ? fr.ToUser : fr.FromUser;
            contacts.Add(new ContactDto
            {
                UserId = contact.Id,
                UserName = contact.UserName,
                DisplayName = contact.Profile.DisplayName,
                Presence = contact.Profile.Presence
            });
        }

        return contacts;
    }
}
