# InstantMessengerpp (OOP Lab Final)

Instant messaging web application (client-server) with a Node.js backend + PostgreSQL and a lightweight web frontend.

## Business Goal
- Real-time messaging: accounts, profiles, private and group conversations, messages, reactions, notifications, and contacts.
- Clean architecture with controllers, services, repositories, and a PostgreSQL-backed ORM (Sequelize).

## Team Roles
- **ABDOULAYE Chyhab-Dine** ??? Backend Developer, Database Engineer, DevOps.
- **OBOSSOU Leman** ??? Frontend Developer, UX/UI Designer, Backend Developer.
- **AFOLABI Loveth** ??? Project Manager, System/Business Analyst, Documentation & Roadmap.

## Functional Scope
- Authentication/registration, device sessions, Admin/User roles.
- Profiles: display name, avatar, status, presence.
- Conversations: private or group, members, member roles.
- Messages: send, history, replies, reactions, attachments (metadata).
- Friends/contacts: requests, accept/reject, listing.
- Notifications: message and friend request events (read/unread).
- Devices/Sessions: per-device login tracking.

## Database
- PostgreSQL with 10+ tables (User, Role, UserProfile, Session, Device, Conversation, ChatMember, Message, Attachment, Reaction, FriendRequest, Notification).
- Constraints: unique email/username, composite chat-member, foreign keys with safe delete behavior.

## Quick Start (Local)
1) **Prerequisites**: Node.js LTS, PostgreSQL (port 5432).
2) **Configure the connection**: set `DATABASE_URL` for the backend.
3) **Create schema**:
   ```
   npm --prefix backend install
   npm --prefix backend run migrate:db
   ```
4) **Migrate data from `data.json` (optional)**:
   ```
   npm --prefix backend run migrate:data
   ```
5) **Run the API**:
   ```
   npm --prefix backend start
   ```
   API: `http://localhost:5230`
6) **Run the frontend** (folder `frontend/`):
   - Open `frontend/index.html` in the browser **or**
   - `npx serve frontend -l 4173` then go to `http://localhost:4173`

## Frontend Usage
- Register/Login (buttons at the top), then the app loads your profile and conversations.
- Create a conversation (private or group), select a chat, send messages.
- Edit profile (display, avatar URL, status, presence) in the Profile panel.
- Use Friend Requests to send/accept/reject requests.
- Use Notifications to review and mark notifications as read.
- Use Attachments and Reactions panels to manage message attachments and reactions.
- Use the Admin Console panel to manage all entities (CRUD).
- Requests use the REST API (`Authorization: Bearer <token>`).

## Code Structure
- `backend/config` : database configuration.
- `backend/models` : Sequelize models.
- `backend/repositories` : data access.
- `backend/services` : business logic.
- `backend/controllers` : API endpoints.
- `backend/routes` : route registration.
- `backend/services/admin.service.js` : generic CRUD for all entities.
- `frontend/` : static web client (HTML/CSS/JS) connected to the API.
- `docs/` : business rules, use cases, roadmap, team roles, schema.

## Documentation
- Business rules: `docs/BUSINESS_RULES.md`
- Use cases: `docs/USE_CASES.md`
- Roadmap: `docs/ROADMAP.md`
- Team roles: `docs/TEAM_ROLES.md`
- Database schema: `docs/DB_SCHEMA.md`
- Entities list: `docs/ENTITIES.md`
- Improvement plan: `docs/IMPROVEMENT_PLAN.md`
- Compatible API examples: `docs/COMPATIBLE_EXAMPLES.md`

