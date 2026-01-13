# Improvement Plan (Non-Destructive)

1) **Document alignment**
   - Update all documentation to reflect Node.js + PostgreSQL + Sequelize.
   - Keep frontend untouched and preserve current endpoint behavior.

2) **Database migration**
   - Introduce PostgreSQL and Sequelize models.
   - Keep `backend/data.json` as a migration source only.
   - Provide scripts: `npm run migrate:db` and `npm run migrate:data`.

3) **Model expansion**
   - Add 10+ entities with relations (User, Role, Profile, Session, Device, Conversation, ChatMember, Message, Attachment, Reaction, FriendRequest, Notification).
   - Keep existing endpoint payloads unchanged.

4) **Architecture hardening**
   - Add repositories and services for data access and business logic.
   - Keep controllers and routes stable to preserve frontend compatibility.

5) **Validation**
   - Start backend after DB migration.
   - Verify frontend flows: register/login, profile update, create chat, add member, send message.

