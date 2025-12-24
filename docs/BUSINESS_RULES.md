# Business Rules

- **Unique identity** – Emails and usernames are unique; duplicate registration is rejected.
- **Roles** – Only `Admin` and `User` roles exist; new accounts default to `User`.
- **Presence** – Device activity drives presence; updating a device status updates the user/profile presence.
- **Friendships** – Requests cannot target self; pending requests are unique per sender/receiver; only receivers can accept/reject.
- **Chat membership** – Messages can only be sent by chat members; chat members carry a role (Owner/Admin/Member) for room-level permissions.
- **Private chats** – Must contain exactly two members; group chats allow any number.
- **Notifications** – Created for new messages and friend request events; users can mark notifications read/unread.
- **Sessions** – Refresh tokens expire after configured days; invalid/expired refresh tokens are rejected.
- **Attachments** – Stored as metadata (URL + content info); ownership recorded for auditing.
- **Reactions** – A user can react once per message; reacting again updates the previous reaction.
