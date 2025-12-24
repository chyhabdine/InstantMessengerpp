namespace InstantMessenger.Api.Models.Enums;

public enum PresenceStatus
{
    Offline = 0,
    Online = 1,
    Busy = 2,
    Away = 3
}

public enum FriendRequestStatus
{
    Pending = 0,
    Accepted = 1,
    Rejected = 2,
    Blocked = 3
}

public enum NotificationType
{
    Message = 0,
    FriendRequest = 1,
    ChatInvite = 2,
    System = 3
}

public enum ChatMemberRole
{
    Owner = 0,
    Admin = 1,
    Member = 2
}

public enum ReactionType
{
    Like = 0,
    Love = 1,
    Laugh = 2,
    Wow = 3,
    Sad = 4,
    Angry = 5
}
