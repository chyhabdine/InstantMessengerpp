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
