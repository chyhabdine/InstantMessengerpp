# Compatible API Examples

These examples match the current frontend expectations.

## Register
Request:
```
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "Password123",
  "userName": "user",
  "displayName": "User",
  "deviceName": "Web client"
}
```
Response:
```
{ "accessToken": "<token>" }
```

## Login
Request:
```
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "Password123",
  "deviceName": "Web client"
}
```
Response:
```
{ "accessToken": "<token>" }
```

## List Chats
Request:
```
GET /api/chats
Authorization: Bearer <token>
```
Response:
```
[
  {
    "id": "chat-id",
    "name": "My chat",
    "isGroup": false,
    "members": [
      { "userId": "user-id", "userName": "user", "displayName": "User", "role": "Owner" }
    ]
  }
]
```

## Admin CRUD (Generic)
Request:
```
GET /api/admin/roles
Authorization: Bearer <token>
```
Response:
```
[
  { "id": "role-id", "name": "User" }
]
```

## Friend Requests
Request:
```
POST /api/friends/requests
Authorization: Bearer <token>
{
  "receiverId": "user-id"
}
```
Response:
```
{ "id": "request-id", "requesterId": "me", "receiverId": "user-id", "status": "Pending" }
```

## Message Attachments
Request:
```
POST /api/messages/{id}/attachments
Authorization: Bearer <token>
{
  "url": "https://example.com/file.pdf",
  "fileName": "file.pdf",
  "mimeType": "application/pdf",
  "size": 1200
}
```
Response:
```
{ "id": "attachment-id", "messageId": "message-id", "url": "https://example.com/file.pdf" }
```

## Reactions
Request:
```
POST /api/messages/{id}/reactions
Authorization: Bearer <token>
{
  "emoji": ":+1:"
}
```
Response:
```
{ "id": "reaction-id", "messageId": "message-id", "userId": "me", "emoji": ":+1:" }
```

## Notifications
Request:
```
GET /api/notifications
Authorization: Bearer <token>
```
Response:
```
[
  { "id": "notification-id", "type": "Message", "payload": "{\"messageId\":\"...\"}", "isRead": false }
]
```
