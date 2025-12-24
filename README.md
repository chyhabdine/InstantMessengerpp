# InstantMessengerpp

InstantMessengerpp is a full-stack ASP.NET Core Web API project for real-time-style messaging with users, profiles, chats, messages, attachments, reactions, friendships, notifications, and device/session tracking. Everything is built around PostgreSQL with Entity Framework Core code-first and JWT authentication.

## Tech Stack
- .NET 8, ASP.NET Core Web API
- Entity Framework Core with Npgsql (PostgreSQL)
- JWT authentication/authorization
- Layered domains: Models, Data, DTOs, Services, Controllers, Auth

## Prerequisites
- .NET 8 SDK available on your PATH (or use `C:\Users\Utilisateur\dotnet\dotnet.exe` installed locally)
- PostgreSQL reachable at the connection string you configure

## Configuration
1) Open `InstantMessenger.Api/appsettings.json` and set `ConnectionStrings:DefaultConnection` to your PostgreSQL instance. The default points to `Host=localhost;Port=5432;Database=InstantMessengerDb;Username=postgres;Password=postgres`.
2) Update `Jwt` settings if you want a different signing key/issuer/audience.
3) Optional: trust the development certificate if running HTTPS locally (`dotnet dev-certs https --trust`).

## Database Migrations
Run from the repository root:
```
dotnet ef database update --project InstantMessenger.Api --startup-project InstantMessenger.Api
```
This applies the `InitialCreate` migration and builds the schema with seeded roles and a default admin account (`admin@instantmessenger.app` / `Admin@12345`).

## Run the API
```
dotnet run --project InstantMessenger.Api
```
The API launches with Swagger UI (Development) and JWT bearer authentication. Update the Swagger Authorize dialog with `Bearer <access_token>` after login.

## Core Capabilities
- User registration/login with JWT, refresh tokens, and role support (Admin/User)
- Profile management (avatar URL, display name, status, presence)
- Device/session tracking and online/offline status
- Private and group chats with membership roles
- Message history, attachments metadata, replies, and reactions
- Friend requests/contacts with accept/reject flow
- Notifications for messages and friendship events, read/unread tracking

## Default Test Data
- Roles: Admin, User (seeded)
- Admin account: `admin@instantmessenger.app` / `Admin@12345`

## Useful Commands
- Build: `dotnet build`
- Run migrations: `dotnet ef migrations add <Name> --project InstantMessenger.Api --startup-project InstantMessenger.Api --output-dir Data/Migrations`
- Update database: `dotnet ef database update --project InstantMessenger.Api --startup-project InstantMessenger.Api`

## Folder Layout
- `InstantMessenger.Api/Models` – domain entities
- `InstantMessenger.Api/Data` – DbContext, migrations, seeding
- `InstantMessenger.Api/DTOs` – transport objects
- `InstantMessenger.Api/Services` – business logic + interfaces
- `InstantMessenger.Api/Controllers` – HTTP endpoints
- `InstantMessenger.Api/Auth` – JWT settings and token generation
- `docs/` – UML diagram, roadmap, team roles, business rules

## Next Steps for Deployment
- Provide production-grade JWT secret/key management
- Configure HTTPS with a trusted certificate
- Place PostgreSQL connection strings in user secrets or environment variables
- Add logging/monitoring and background notification channels as needed
