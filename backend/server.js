require("dotenv").config();
const http = require("http");
const { URL } = require("url");
const crypto = require("crypto");
const { initDatabase, models } = require("./config/database");
const registerAuthRoutes = require("./routes/auth.routes");
const registerUserRoutes = require("./routes/users.routes");
const registerMessageRoutes = require("./routes/messages.routes");
const registerAdminRoutes = require("./routes/admin.routes");
const UserRepository = require("./repositories/user.repository");
const ConversationRepository = require("./repositories/conversation.repository");
const MessageRepository = require("./repositories/message.repository");
const SessionRepository = require("./repositories/session.repository");
const DeviceRepository = require("./repositories/device.repository");
const AuthService = require("./services/auth.service");
const UserService = require("./services/user.service");
const ChatService = require("./services/chat.service");
const MessageService = require("./services/message.service");
const AdminService = require("./services/admin.service");

const PORT = 5230;

const apiEndpoints = [
    "POST /api/auth/register",
    "POST /api/auth/login",
    "GET /api/users/me",
    "PUT /api/users/me/profile",
    "GET /api/users?search=...",
    "GET /api/chats",
    "POST /api/chats",
    "POST /api/chats/:id/members",
    "GET /api/chats/:id/messages",
    "POST /api/chats/:id/messages",
    "CRUD /api/admin/{entity}"
];

function json(res, status, dataResponse) {
    const body = dataResponse === null || dataResponse === undefined ? "" : JSON.stringify(dataResponse);
    res.writeHead(status, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
    });
    res.end(body);
}

function badRequest(res, message) {
    json(res, 400, { message });
}

function unauthorized(res, message) {
    json(res, 401, { message });
}

function notFound(res, message) {
    json(res, 404, { message });
}

function conflict(res, message) {
    json(res, 409, { message });
}

function noContent(res) {
    res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
    });
    res.end();
}

function readBody(req) {
    return new Promise((resolve, reject) => {
        let raw = "";
        req.on("data", chunk => {
            raw += chunk;
        });
        req.on("end", () => {
            if (!raw) return resolve({});
            try {
                resolve(JSON.parse(raw));
            } catch (err) {
                reject(err);
            }
        });
        req.on("error", reject);
    });
}

function newId() {
    return crypto.randomUUID();
}

function sanitizeProfile(user) {
    return {
        userId: user.id,
        email: user.email,
        userName: user.userName,
        displayName: user.displayName,
        statusMessage: user.statusMessage || "",
        presence: user.presence || "Online",
        role: user.role || "User",
        avatarUrl: user.avatarUrl || ""
    };
}

function createRouter() {
    const routes = [];

    function add(method, pattern, handler) {
        const segments = pattern.split("/").filter(Boolean);
        const keys = [];
        const regexParts = segments.map(segment => {
            if (segment.startsWith(":")) {
                keys.push(segment.slice(1));
                return "([^/]+)";
            }
            return segment.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&");
        });
        const regex = new RegExp(`^/${regexParts.join("/")}$`);
        routes.push({ method, regex, keys, handler });
    }

    function match(method, pathname) {
        return routes.find(route => {
            if (route.method !== method) return false;
            const match = pathname.match(route.regex);
            return !!match;
        });
    }

    function extractParams(route, pathname) {
        const match = pathname.match(route.regex);
        if (!match) return {};
        const params = {};
        route.keys.forEach((key, index) => {
            params[key] = match[index + 1];
        });
        return params;
    }

    return { add, match, extractParams };
}

async function startServer() {
    await initDatabase();

    const repositories = {
        users: new UserRepository(models),
        conversations: new ConversationRepository(models),
        messages: new MessageRepository(models),
        sessions: new SessionRepository(models),
        devices: new DeviceRepository(models)
    };

    const services = {
        auth: new AuthService({
            userRepository: repositories.users,
            sessionRepository: repositories.sessions,
            deviceRepository: repositories.devices
        }),
        users: new UserService({ userRepository: repositories.users }),
        chats: new ChatService({
            conversationRepository: repositories.conversations,
            userRepository: repositories.users
        }),
        messages: new MessageService({
            messageRepository: repositories.messages,
            conversationRepository: repositories.conversations,
            userRepository: repositories.users
        }),
        admin: new AdminService(models)
    };

    const router = createRouter();
    const ctx = {
        json,
        badRequest,
        unauthorized,
        notFound,
        conflict,
        noContent,
        readBody,
        newId,
        sanitizeProfile,
        services,
        getAuthUser: async (req, res) => {
            const authHeader = req.headers.authorization || "";
            if (!authHeader.startsWith("Bearer ")) {
                unauthorized(res, "Missing or invalid access token.");
                return null;
            }
            const token = authHeader.slice("Bearer ".length).trim();
            const user = await services.auth.getUserByToken(token);
            if (!user) {
                unauthorized(res, "Invalid or expired access token.");
                return null;
            }
            return user;
        }
    };

    registerAuthRoutes(router, ctx);
    registerUserRoutes(router, ctx);
    registerMessageRoutes(router, ctx);
    registerAdminRoutes(router, ctx);

    const server = http.createServer(async (req, res) => {
        if (req.method === "OPTIONS") {
            return noContent(res);
        }

        const url = new URL(req.url, `http://${req.headers.host}`);
        const pathname = url.pathname;

        if (req.method === "GET" && (pathname === "/" || pathname === "/api")) {
            return json(res, 200, {
                message: "Backend is running - available endpoints.",
                endpoints: apiEndpoints
            });
        }

        const route = router.match(req.method, pathname);
        if (!route) {
            return notFound(res, "Endpoint not found.");
        }

        try {
            req.query = Object.fromEntries(url.searchParams.entries());
            req.params = router.extractParams(route, pathname);
            req.body = await readBody(req);
            return await route.handler(req, res);
        } catch (err) {
            return badRequest(res, "Invalid JSON payload.");
        }
    });

    server.listen(PORT, () => {
        console.log(`InstantMessenger backend running at http://localhost:${PORT}`);
    });
}

startServer().catch(err => {
    console.error("Backend failed to start:", err.message);
    process.exit(1);
});
