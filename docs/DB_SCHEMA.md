# Database Schema

## Before Migration (file storage)
Data was stored in `backend/data.json`:
- `users[]`
- `conversations[]`
- `messages[]`

This file acted as the only persistence layer and had no relational constraints.

## After Migration (PostgreSQL + Sequelize)
Tables and relationships:

- `users` (id, userName, email, passwordHash, passwordSalt, displayName, statusMessage, presence, role, avatarUrl, roleId)
- `roles` (id, name)
- `user_profiles` (id, userId, displayName, statusMessage, presence, avatarUrl)
- `sessions` (id, userId, deviceId, tokenHash, createdAt, expiresAt)
- `devices` (id, userId, name, lastSeenAt)
- `conversations` (id, name, isGroup, lastMessageId)
- `chat_members` (id, conversationId, userId, role)
- `messages` (id, conversationId, senderId, receiverId, content, timestamp)
- `attachments` (id, messageId, url, fileName, mimeType, size)
- `reactions` (id, messageId, userId, emoji)
- `friend_requests` (id, requesterId, receiverId, status, createdAt)
- `notifications` (id, userId, type, payload, isRead, createdAt)

Key relations:
- `roles` 1:N `users`
- `users` 1:1 `user_profiles`
- `users` 1:N `sessions`, `devices`, `messages`
- `conversations` 1:N `chat_members`, `messages`
- `chat_members` links `users` and `conversations`
- `messages` 1:N `attachments`, `reactions`
- `friend_requests` links `users` (requester/receiver)
- `notifications` belong to `users`

