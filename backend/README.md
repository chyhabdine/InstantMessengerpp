# Backend (Node.js + PostgreSQL)

This backend is a minimal HTTP API that matches the frontend calls in `frontend/app.js`.
It stores data in PostgreSQL using Sequelize and uses `backend/data.json` only as a migration source.

## Run
```
npm install
npm run migrate:db
npm run migrate:data
npm start
```

The API listens on `http://localhost:5230` and serves JSON responses.
The root endpoint (`/` or `/api`) returns a simple JSON status message and endpoint list.

## Environment
```
DATABASE_URL=postgres://postgres:postgres@localhost:5432/instantmessenger
```

## PostgreSQL Setup (Local)
1) Install PostgreSQL and ensure the service is running.
2) Create the database:
   ```
   createdb -U postgres instantmessenger
   ```
3) Copy `backend/.env.example` to `backend/.env` and adjust credentials if needed.

## Endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/me`
- `PUT /api/users/me/profile`
- `GET /api/users?search=...`
- `GET /api/chats`
- `POST /api/chats`
- `POST /api/chats/{id}/members`
- `GET /api/chats/{id}/messages`
- `POST /api/chats/{id}/messages`
- `GET /api/messages/{id}/attachments`
- `POST /api/messages/{id}/attachments`
- `PUT /api/attachments/{id}`
- `DELETE /api/attachments/{id}`
- `GET /api/messages/{id}/reactions`
- `POST /api/messages/{id}/reactions`
- `PUT /api/reactions/{id}`
- `DELETE /api/reactions/{id}`
- `GET /api/friends/requests`
- `POST /api/friends/requests`
- `PUT /api/friends/requests/{id}`
- `DELETE /api/friends/requests/{id}`
- `GET /api/notifications`
- `POST /api/notifications`
- `PUT /api/notifications/{id}`
- `DELETE /api/notifications/{id}`

## Admin CRUD
Generic CRUD endpoints for all entities:
- `GET /api/admin/{entity}`
- `GET /api/admin/{entity}/{id}`
- `POST /api/admin/{entity}`
- `PUT /api/admin/{entity}/{id}`
- `DELETE /api/admin/{entity}/{id}`

Entities:
`users`, `roles`, `profiles`, `sessions`, `devices`, `conversations`, `chat_members`,
`messages`, `attachments`, `reactions`, `friend_requests`, `notifications`
