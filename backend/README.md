# Backend (Node.js, no dependencies)

This backend is a minimal HTTP API that matches the frontend calls in `frontend/app.js`.
It stores data in `backend/data.json` for persistence.

## Run
```
node backend/server.js
```

The API listens on `http://localhost:5230` and serves JSON responses.
The root endpoint (`/` or `/api`) returns a simple JSON status message and endpoint list.

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
