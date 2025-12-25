# InstantMessengerpp (OOP Lab Final)

Application web de messagerie (client-serveur) avec backend ASP.NET Core + EF Core (PostgreSQL) et frontend web léger. Livrable complet pour la soutenance : API, client web, base de données, documentation et rôles d'équipe.

## Objectif métier
- Messagerie instantanée : comptes, profils, discussions privées et de groupe, messages, réactions, notifications logiques, amis/contacts.
- Architecture claire (Controllers/Services/Models/DbContext), authentification JWT, EF Core code-first, PostgreSQL.

## Équipe et rôles (obligatoire)
- **ABDOULAYE Chyhab-Dine** — Backend Developer, Database Engineer, DevOps.
- **OBOSSOU Leman** — Frontend Developer, UX/UI Designer, Backend Developer.
- **AFOLABI Loveth** — Project Manager, System/Business Analyst, Documentation & Roadmap.

## Périmètre fonctionnel
- Authentification/inscription, sessions/refresh token, rôles Admin/User.
- Profils : display name, avatar, statut, présence.
- Discussions : privées ou groupe, membres, rôles de membre.
- Messages : envoi, historique, réponses, réactions, pièces jointes (métadonnées).
- Amis/contacts : demandes, acceptation/rejet, listing.
- Notifications : événements messages et demandes d’ami (lecture/non-lu).
- Devices/Sessions : suivi des connexions par appareil.

## Base de données
- PostgreSQL, >=10 tables (User, Role, UserProfile, Session, Device, Chat, ChatMember, Message, Attachment, Reaction, FriendRequest, Notification).
- Contraintes : unicité email/username, clés composites (ChatMember), clés étrangères avec DeleteBehavior adapté.

## Démarrage rapide (local)
1) **Prérequis** : .NET 8 SDK (x64), PostgreSQL (port 5432), Node facultatif si vous servez le frontend avec `npx serve`.
2) **Configurer la chaîne de connexion** : `InstantMessenger.Api/appsettings.json` > `ConnectionStrings:DefaultConnection` (mettre le mot de passe `postgres` choisi).
3) **Migrations (une fois)** :
   ```
   dotnet ef database update --project InstantMessenger.Api --startup-project InstantMessenger.Api
   ```
   Compte admin seedé : `admin@instantmessenger.app` / `Admin@12345`.
4) **Lancer l’API** :
   ```
   dotnet run --project InstantMessenger.Api
   ```
   Swagger : `http://localhost:5230/swagger`
5) **Lancer le frontend web** (dossier `frontend/`) :
   - Ouvrir `frontend/index.html` dans le navigateur **ou**
   - `npx serve frontend -l 4173` puis aller sur `http://localhost:4173`
   - L’API doit être accessible en `http://localhost:5230`

## Utilisation (frontend)
- Register/Login (boutons en haut), puis l’app charge votre profil et vos discussions.
- Créer une discussion (privée ou groupe), sélectionner un chat, envoyer des messages.
- Modifier le profil (display, avatar URL, statut, présence) dans le panneau Profil.
- Les appels utilisent l’API REST (`Authorization: Bearer <token>`).

## Structure du code
- `InstantMessenger.Api/Models` : entités EF Core.
- `InstantMessenger.Api/Data` : `AppDbContext`, migrations, seeding.
- `InstantMessenger.Api/Services` : règles métier (auth, users, chats, messages, amis, notifications, devices).
- `InstantMessenger.Api/Controllers` : endpoints REST.
- `frontend/` : client web statique (HTML/CSS/JS) connecté à l’API.
- `docs/` : Business rules, Use cases, ERD (Mermaid), Roadmap, Team roles.

## Docs clés
- Business rules : `docs/BUSINESS_RULES.md`
- Use cases : `docs/USE_CASES.md`
- ERD/UML : `docs/UML.md`
- Roadmap finale : `docs/ROADMAP.md`
- Rôles d’équipe : `docs/TEAM_ROLES.md`

## Commandes utiles
- Build : `dotnet build`
- Migrations (nouvelle) : `dotnet ef migrations add <Name> --project InstantMessenger.Api --startup-project InstantMessenger.Api --output-dir Data/Migrations`
- Update DB : `dotnet ef database update --project InstantMessenger.Api --startup-project InstantMessenger.Api`

## Pour la soutenance
- Démo API via Swagger (login/register, chats, messages) + démo frontend web (liste de chats, fenêtre de chat, profil).
- Expliquer l’architecture (API REST, services, EF Core, JWT), la DB relationnelle (10+ entités réelles, FKs, contraintes), et le travail en équipe (rôles ci-dessus).
- Cas limites : unicité email/username, membres de chat obligatoires, auth JWT requise pour les endpoints protégés, présence/notifications logiques, refresh token expiré refusé.
