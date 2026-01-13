const API_BASE = "http://localhost:5230/api";

let authMode = "login"; // or "register"
let authToken = localStorage.getItem("im_token") || "";
let currentChatId = null;

const els = {
    btnShowLogin: document.getElementById("btnShowLogin"),
    btnShowRegister: document.getElementById("btnShowRegister"),
    btnLogout: document.getElementById("btnLogout"),
    authTitle: document.getElementById("authTitle"),
    authForm: document.getElementById("authForm"),
    authEmail: document.getElementById("authEmail"),
    authPassword: document.getElementById("authPassword"),
    authUserName: document.getElementById("authUserName"),
    authDisplayName: document.getElementById("authDisplayName"),
    authDevice: document.getElementById("authDevice"),
    authHint: document.getElementById("authHint"),
    authSubmit: document.getElementById("authSubmit"),
    profileEmail: document.getElementById("profileEmail"),
    profileUserName: document.getElementById("profileUserName"),
    profileDisplay: document.getElementById("profileDisplay"),
    profileStatus: document.getElementById("profileStatus"),
    profilePresence: document.getElementById("profilePresence"),
    profileRole: document.getElementById("profileRole"),
    profileForm: document.getElementById("profileForm"),
    profileDisplayInput: document.getElementById("profileDisplayInput"),
    profileAvatarInput: document.getElementById("profileAvatarInput"),
    profileStatusInput: document.getElementById("profileStatusInput"),
    profilePresenceInput: document.getElementById("profilePresenceInput"),
    profileHint: document.getElementById("profileHint"),
    chatList: document.getElementById("chatList"),
    chatForm: document.getElementById("chatForm"),
    chatName: document.getElementById("chatName"),
    chatIsGroup: document.getElementById("chatIsGroup"),
    chatHint: document.getElementById("chatHint"),
    btnRefreshChats: document.getElementById("btnRefreshChats"),
    chatMemberIds: document.getElementById("chatMemberIds"),
    messagesTitle: document.getElementById("messagesTitle"),
    messageList: document.getElementById("messageList"),
    messageForm: document.getElementById("messageForm"),
    messageContent: document.getElementById("messageContent"),
    messageHint: document.getElementById("messageHint"),
    btnRefreshMessages: document.getElementById("btnRefreshMessages"),
    userSearchForm: document.getElementById("userSearchForm"),
    userSearchInput: document.getElementById("userSearchInput"),
    userSearchResults: document.getElementById("userSearchResults"),
    userSearchHint: document.getElementById("userSearchHint"),
    adminEntity: document.getElementById("adminEntity"),
    adminRecordId: document.getElementById("adminRecordId"),
    adminPayload: document.getElementById("adminPayload"),
    adminCreate: document.getElementById("adminCreate"),
    adminUpdate: document.getElementById("adminUpdate"),
    adminDelete: document.getElementById("adminDelete"),
    adminList: document.getElementById("adminList"),
    adminHint: document.getElementById("adminHint"),
    btnRefreshAdmin: document.getElementById("btnRefreshAdmin")
};

function setAuthMode(mode) {
    authMode = mode;
    const registerFields = document.querySelectorAll(".register-only");
    registerFields.forEach(el => {
        el.style.display = mode === "register" ? "flex" : "none";
    });
    els.authTitle.textContent = mode === "login" ? "Login" : "Register";
    els.authSubmit.textContent = mode === "login" ? "Login" : "Register";
    els.authHint.textContent = mode === "login"
        ? "No account yet? Click Register."
        : "Already registered? Click Login.";
}

function setToken(token) {
    authToken = token;
    if (token) {
        localStorage.setItem("im_token", token);
    } else {
        localStorage.removeItem("im_token");
    }
}

async function apiFetch(path, options = {}) {
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };
    if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
    }
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers
    });
    if (!res.ok) {
        let msg = `Error ${res.status}`;
        try {
            const data = await res.json();
            msg = data?.message || data || msg;
        } catch {
            // ignore
        }
        throw new Error(msg);
    }
    if (res.status === 204) return null;
    return res.json();
}

function renderChats(chats) {
    els.chatList.innerHTML = "";
    if (!chats || chats.length === 0) {
        els.chatList.innerHTML = "<div class='hint'>No conversations.</div>";
        return;
    }
    chats.forEach(chat => {
        const item = document.createElement("div");
        item.className = "chat-item" + (chat.id === currentChatId ? " active" : "");
        item.innerHTML = `
            <div class="chat-meta">
                <span>${chat.name}</span>
                <span>${chat.isGroup ? "Group" : "Private"}</span>
            </div>
            <div class="hint">${chat.members.length} member(s)</div>
        `;
        item.onclick = () => {
            currentChatId = chat.id;
            renderChats(chats);
            loadMessages(chat.id);
        };
        els.chatList.appendChild(item);
    });
}

function renderMessages(messages) {
    els.messageList.innerHTML = "";
    if (!messages || messages.length === 0) {
        els.messageList.innerHTML = "<div class='hint'>No messages.</div>";
        return;
    }
    messages.forEach(msg => {
        const item = document.createElement("div");
        item.className = "message-item";
        item.innerHTML = `
            <div class="message-author">${msg.senderName}</div>
            <div class="message-content">${msg.content}</div>
            <div class="message-time">${new Date(msg.sentAt).toLocaleString()}</div>
        `;
        els.messageList.appendChild(item);
    });
    els.messageList.scrollTop = els.messageList.scrollHeight;
}

async function loadProfile() {
    try {
        const profile = await apiFetch("/users/me");
        els.profileEmail.textContent = profile.email;
        els.profileUserName.textContent = profile.userName;
        els.profileDisplay.textContent = profile.displayName;
        els.profileStatus.textContent = profile.statusMessage || "-";
        els.profilePresence.textContent = profile.presence;
        els.profileRole.textContent = profile.role;
        els.profileDisplayInput.value = profile.displayName || "";
        els.profileAvatarInput.value = profile.avatarUrl || "";
        els.profileStatusInput.value = profile.statusMessage || "";
        els.profilePresenceInput.value = profile.presence || "Online";
    } catch (err) {
        console.error(err);
    }
}

async function loadChats() {
    try {
        const chats = await apiFetch("/chats");
        renderChats(chats);
        if (!currentChatId && chats.length > 0) {
            currentChatId = chats[0].id;
            loadMessages(currentChatId);
        }
    } catch (err) {
        els.chatHint.textContent = err.message;
    }
}

async function loadMessages(chatId) {
    if (!chatId) {
        els.messageList.innerHTML = "<div class='hint'>Select a conversation.</div>";
        return;
    }
    els.messagesTitle.textContent = "Messages - " + chatId;
    try {
        const messages = await apiFetch(`/chats/${chatId}/messages`);
        renderMessages(messages);
    } catch (err) {
        els.messageHint.textContent = err.message;
    }
}

async function searchUsers(term) {
    els.userSearchResults.innerHTML = "<div class='hint'>Searching...</div>";
    try {
        const users = await apiFetch(`/users?search=${encodeURIComponent(term || "")}`);
        renderUserSearch(users);
    } catch (err) {
        els.userSearchResults.innerHTML = "";
        els.userSearchHint.textContent = err.message;
    }
}

function renderUserSearch(users) {
    els.userSearchResults.innerHTML = "";
    if (!users || users.length === 0) {
        els.userSearchResults.innerHTML = "<div class='hint'>No results.</div>";
        return;
    }
    users.forEach(u => {
        const item = document.createElement("div");
        item.className = "user-item";
        item.innerHTML = `
            <div class="user-meta">
                <strong>${u.displayName || u.userName}</strong>
                <div class="muted">${u.email}</div>
                <div class="muted">Id: ${u.userId}</div>
            </div>
        `;
        const btn = document.createElement("button");
        btn.className = "ghost";
        btn.textContent = "Add to chat";
        btn.onclick = () => addUserToCurrentChat(u.userId);
        item.appendChild(btn);
        els.userSearchResults.appendChild(item);
    });
}

async function addUserToCurrentChat(userId) {
    if (!currentChatId) {
        els.userSearchHint.textContent = "Select a chat before adding a member.";
        return;
    }
    els.userSearchHint.textContent = "Adding...";
    try {
        await apiFetch(`/chats/${currentChatId}/members`, {
            method: "POST",
            body: JSON.stringify({ userId, role: "Member" })
        });
        els.userSearchHint.textContent = "Member added.";
        await loadChats();
    } catch (err) {
        els.userSearchHint.textContent = err.message;
    }
}

function getAdminEntity() {
    return els.adminEntity.value;
}

function getAdminRecordId() {
    return els.adminRecordId.value.trim();
}

function parseAdminPayload() {
    const raw = els.adminPayload.value.trim();
    if (!raw) return {};
    try {
        return JSON.parse(raw);
    } catch (err) {
        throw new Error("Invalid JSON payload.");
    }
}

function renderAdminList(items) {
    els.adminList.innerHTML = "";
    if (!items || items.length === 0) {
        els.adminList.innerHTML = "<div class='hint'>No records.</div>";
        return;
    }
    items.forEach(item => {
        const wrapper = document.createElement("div");
        wrapper.className = "admin-item";
        const pre = document.createElement("pre");
        pre.textContent = JSON.stringify(item, null, 2);
        const btn = document.createElement("button");
        btn.className = "ghost";
        btn.textContent = "Use";
        btn.onclick = () => {
            els.adminRecordId.value = item.id || "";
            els.adminPayload.value = JSON.stringify(item, null, 2);
        };
        wrapper.appendChild(pre);
        wrapper.appendChild(btn);
        els.adminList.appendChild(wrapper);
    });
}

async function loadAdminList() {
    els.adminHint.textContent = "";
    try {
        const entity = getAdminEntity();
        const items = await apiFetch(`/admin/${entity}`);
        renderAdminList(items);
    } catch (err) {
        els.adminHint.textContent = err.message;
    }
}

async function createAdminItem() {
    els.adminHint.textContent = "";
    try {
        const entity = getAdminEntity();
        const payload = parseAdminPayload();
        await apiFetch(`/admin/${entity}`, {
            method: "POST",
            body: JSON.stringify(payload)
        });
        els.adminHint.textContent = "Created.";
        await loadAdminList();
    } catch (err) {
        els.adminHint.textContent = err.message;
    }
}

async function updateAdminItem() {
    els.adminHint.textContent = "";
    const recordId = getAdminRecordId();
    if (!recordId) {
        els.adminHint.textContent = "Record id is required.";
        return;
    }
    try {
        const entity = getAdminEntity();
        const payload = parseAdminPayload();
        await apiFetch(`/admin/${entity}/${recordId}`, {
            method: "PUT",
            body: JSON.stringify(payload)
        });
        els.adminHint.textContent = "Updated.";
        await loadAdminList();
    } catch (err) {
        els.adminHint.textContent = err.message;
    }
}

async function deleteAdminItem() {
    els.adminHint.textContent = "";
    const recordId = getAdminRecordId();
    if (!recordId) {
        els.adminHint.textContent = "Record id is required.";
        return;
    }
    try {
        const entity = getAdminEntity();
        await apiFetch(`/admin/${entity}/${recordId}`, {
            method: "DELETE"
        });
        els.adminHint.textContent = "Deleted.";
        await loadAdminList();
    } catch (err) {
        els.adminHint.textContent = err.message;
    }
}

function resetAuthForms() {
    els.authEmail.value = "";
    els.authPassword.value = "";
    els.authUserName.value = "";
    els.authDisplayName.value = "";
    els.authDevice.value = "";
}

function logout() {
    setToken("");
    currentChatId = null;
    resetAuthForms();
    els.chatList.innerHTML = "";
    els.messageList.innerHTML = "";
    els.profileHint.textContent = "";
    els.messageHint.textContent = "";
    els.chatHint.textContent = "";
}

// Event bindings
els.btnShowLogin.onclick = () => setAuthMode("login");
els.btnShowRegister.onclick = () => setAuthMode("register");
els.btnLogout.onclick = logout;

els.authForm.onsubmit = async (e) => {
    e.preventDefault();
    els.authHint.textContent = "In progress...";
    const body = {
        email: els.authEmail.value.trim(),
        password: els.authPassword.value.trim(),
        deviceName: els.authDevice.value.trim() || "Web client"
    };
    if (authMode === "register") {
        body.userName = els.authUserName.value.trim() || body.email.split("@")[0];
        body.displayName = els.authDisplayName.value.trim() || body.userName;
    }
    try {
        const endpoint = authMode === "login" ? "/auth/login" : "/auth/register";
        const res = await apiFetch(endpoint, {
            method: "POST",
            body: JSON.stringify(body)
        });
        setToken(res.accessToken);
        els.authHint.textContent = authMode === "login" ? "Connected." : "Account created, connected.";
        await loadProfile();
        await loadChats();
        await loadAdminList();
    } catch (err) {
        els.authHint.textContent = err.message;
    }
};

els.profileForm.onsubmit = async (e) => {
    e.preventDefault();
    els.profileHint.textContent = "Saving...";
    try {
        await apiFetch("/users/me/profile", {
            method: "PUT",
            body: JSON.stringify({
                displayName: els.profileDisplayInput.value.trim(),
                avatarUrl: els.profileAvatarInput.value.trim(),
                statusMessage: els.profileStatusInput.value.trim(),
                presence: els.profilePresenceInput.value
            })
        });
        els.profileHint.textContent = "Profile updated.";
        await loadProfile();
    } catch (err) {
        els.profileHint.textContent = err.message;
    }
};

els.chatForm.onsubmit = async (e) => {
    e.preventDefault();
    els.chatHint.textContent = "Creating...";
    try {
        const memberIds = (els.chatMemberIds.value || "")
            .split(",")
            .map(x => x.trim())
            .filter(x => x.length > 0);
        const chat = await apiFetch("/chats", {
            method: "POST",
            body: JSON.stringify({
                name: els.chatName.value.trim(),
                isGroup: els.chatIsGroup.checked,
                memberIds
            })
        });
        els.chatHint.textContent = "Conversation created.";
        els.chatName.value = "";
        els.chatMemberIds.value = "";
        currentChatId = chat.id;
        await loadChats();
        await loadMessages(chat.id);
    } catch (err) {
        els.chatHint.textContent = err.message;
    }
};

els.messageForm.onsubmit = async (e) => {
    e.preventDefault();
    els.messageHint.textContent = "";
    if (!currentChatId) {
        els.messageHint.textContent = "Select a conversation.";
        return;
    }
    try {
        await apiFetch(`/chats/${currentChatId}/messages`, {
            method: "POST",
            body: JSON.stringify({
                content: els.messageContent.value.trim(),
                attachments: []
            })
        });
        els.messageContent.value = "";
        await loadMessages(currentChatId);
    } catch (err) {
        els.messageHint.textContent = err.message;
    }
};

els.btnRefreshChats.onclick = () => loadChats();
els.btnRefreshMessages.onclick = () => {
    if (currentChatId) loadMessages(currentChatId);
};
els.userSearchForm.onsubmit = (e) => {
    e.preventDefault();
    els.userSearchHint.textContent = "";
    searchUsers(els.userSearchInput.value.trim());
};
els.btnRefreshAdmin.onclick = () => loadAdminList();
els.adminCreate.onclick = () => createAdminItem();
els.adminUpdate.onclick = () => updateAdminItem();
els.adminDelete.onclick = () => deleteAdminItem();

// Init
setAuthMode(authMode);
if (authToken) {
    loadProfile();
    loadChats();
    loadAdminList();
}


