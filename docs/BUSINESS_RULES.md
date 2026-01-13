# Business Rules

- **Unique identity** ??? email and username are unique; duplicates are rejected.
- **Roles** ??? Admin and User roles exist; a new user is User by default.
- **Presence** ??? device activity updates the user/profile presence.
- **Friendship** ??? users cannot invite themselves; a pending request is unique per pair; only the receiver can accept or reject.
- **Chat membership** ??? only members can send messages; members have a role (Owner/Admin/Member) for permissions.
- **Private chats** ??? exactly two members; groups can have multiple members.
- **Notifications** ??? created for new messages and friend requests; read/unread state is tracked.
- **Sessions** ??? refresh tokens expire after the configured duration; expired/invalid tokens are rejected.
- **Attachments** ??? stored as metadata (URL + content info); ownership is tracked.
- **Reactions** ??? one reaction per user per message; reacting again updates the previous one.

