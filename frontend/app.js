const API_BASE = "http://localhost:5230/api";

let authMode = "login"; // or "register"
let authToken = localStorage.getItem("im_token") || "";
let currentChatId = null;
let currentUserId = null;

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
    messageAttachmentUrl: document.getElementById("messageAttachmentUrl"),
    messageAttachmentName: document.getElementById("messageAttachmentName"),
    messageAttachmentType: document.getElementById("messageAttachmentType"),
    messageAttachmentSize: document.getElementById("messageAttachmentSize"),
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
    btnRefreshAdmin: document.getElementById("btnRefreshAdmin"),
    friendRequestForm: document.getElementById("friendRequestForm"),
    friendReceiverId: document.getElementById("friendReceiverId"),
    friendRequestList: document.getElementById("friendRequestList"),
    friendRequestHint: document.getElementById("friendRequestHint"),
    btnRefreshFriends: document.getElementById("btnRefreshFriends"),
    notificationForm: document.getElementById("notificationForm"),
    notificationUserId: document.getElementById("notificationUserId"),
    notificationType: document.getElementById("notificationType"),
    notificationPayload: document.getElementById("notificationPayload"),
    notificationList: document.getElementById("notificationList"),
    notificationHint: document.getElementById("notificationHint"),
    btnRefreshNotifications: document.getElementById("btnRefreshNotifications"),
    attachmentForm: document.getElementById("attachmentForm"),
    attachmentMessageId: document.getElementById("attachmentMessageId"),
    attachmentId: document.getElementById("attachmentId"),
    attachmentUrl: document.getElementById("attachmentUrl"),
    attachmentName: document.getElementById("attachmentName"),
    attachmentType: document.getElementById("attachmentType"),
    attachmentSize: document.getElementById("attachmentSize"),
    attachmentCreate: document.getElementById("attachmentCreate"),
    attachmentUpdate: document.getElementById("attachmentUpdate"),
    attachmentDelete: document.getElementById("attachmentDelete"),
    attachmentList: document.getElementById("attachmentList"),
    attachmentHint: document.getElementById("attachmentHint"),
    btnRefreshAttachments: document.getElementById("btnRefreshAttachments"),
    reactionForm: document.getElementById("reactionForm"),
    reactionMessageId: document.getElementById("reactionMessageId"),
    reactionId: document.getElementById("reactionId"),
    reactionEmoji: document.getElementById("reactionEmoji"),
    reactionCreate: document.getElementById("reactionCreate"),
    reactionUpdate: document.getElementById("reactionUpdate"),
    reactionDelete: document.getElementById("reactionDelete"),
    reactionList: document.getElementById("reactionList"),
    reactionHint: document.getElementById("reactionHint"),
    btnRefreshReactions: document.getElementById("btnRefreshReactions")
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
        const attachmentsHtml = (msg.attachments || []).map(att => {
            const name = att.fileName || "attachment";
            return `<div class="muted">${name} (${att.size || 0} bytes)</div>`;
        }).join("");
        item.innerHTML = `
            <div class="message-author">${msg.senderName}</div>
            <div class="message-content">${msg.content}</div>
            ${attachmentsHtml ? `<div class="stack">${attachmentsHtml}</div>` : ""}
            <div class="message-time">${new Date(msg.sentAt).toLocaleString()}</div>
        `;
        const actionRow = document.createElement("div");
        actionRow.className = "inline-actions";
        const reactBtn = document.createElement("button");
        reactBtn.className = "ghost";
        reactBtn.textContent = "React";
        reactBtn.onclick = () => {
            els.reactionMessageId.value = msg.id;
            els.reactionEmoji.focus();
            loadReactions();
        };
        actionRow.appendChild(reactBtn);
        item.appendChild(actionRow);
        els.messageList.appendChild(item);
    });
    els.messageList.scrollTop = els.messageList.scrollHeight;
}

async function loadProfile() {
    try {
        const profile = await apiFetch("/users/me");
        currentUserId = profile.userId;
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
        if (els.notificationUserId) {
            els.notificationUserId.value = profile.userId;
        }
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

function parseJsonPayload(raw, fallback = {}) {
    if (!raw) return fallback;
    try {
        return JSON.parse(raw);
    } catch {
        throw new Error("Invalid JSON payload.");
    }
}

function renderFriendRequests(requests) {
    els.friendRequestList.innerHTML = "";
    if (!requests || requests.length === 0) {
        els.friendRequestList.innerHTML = "<div class='hint'>No requests.</div>";
        return;
    }
    requests.forEach(req => {
        const item = document.createElement("div");
        item.className = "request-item";
        item.innerHTML = `
            <div><strong>Status:</strong> ${req.status}</div>
            <div class="muted">Requester: ${req.requesterId}</div>
            <div class="muted">Receiver: ${req.receiverId}</div>
        `;
        const actions = document.createElement("div");
        actions.className = "inline-actions";
        if (req.receiverId === currentUserId && req.status === "Pending") {
            const acceptBtn = document.createElement("button");
            acceptBtn.textContent = "Accept";
            acceptBtn.onclick = () => updateFriendRequest(req.id, "Accepted");
            const rejectBtn = document.createElement("button");
            rejectBtn.className = "ghost";
            rejectBtn.textContent = "Reject";
            rejectBtn.onclick = () => updateFriendRequest(req.id, "Rejected");
            actions.appendChild(acceptBtn);
            actions.appendChild(rejectBtn);
        }
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "ghost danger";
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => deleteFriendRequest(req.id);
        actions.appendChild(deleteBtn);
        item.appendChild(actions);
        els.friendRequestList.appendChild(item);
    });
}

async function loadFriendRequests() {
    els.friendRequestHint.textContent = "";
    try {
        const requests = await apiFetch("/friends/requests");
        renderFriendRequests(requests);
    } catch (err) {
        els.friendRequestHint.textContent = err.message;
    }
}

async function createFriendRequest() {
    els.friendRequestHint.textContent = "Sending...";
    try {
        const receiverId = els.friendReceiverId.value.trim();
        await apiFetch("/friends/requests", {
            method: "POST",
            body: JSON.stringify({ receiverId })
        });
        els.friendReceiverId.value = "";
        els.friendRequestHint.textContent = "Request sent.";
        await loadFriendRequests();
    } catch (err) {
        els.friendRequestHint.textContent = err.message;
    }
}

async function updateFriendRequest(requestId, status) {
    try {
        await apiFetch(`/friends/requests/${requestId}`, {
            method: "PUT",
            body: JSON.stringify({ status })
        });
        await loadFriendRequests();
        await loadNotifications();
    } catch (err) {
        els.friendRequestHint.textContent = err.message;
    }
}

async function deleteFriendRequest(requestId) {
    try {
        await apiFetch(`/friends/requests/${requestId}`, { method: "DELETE" });
        await loadFriendRequests();
    } catch (err) {
        els.friendRequestHint.textContent = err.message;
    }
}

function renderNotifications(notifications) {
    els.notificationList.innerHTML = "";
    if (!notifications || notifications.length === 0) {
        els.notificationList.innerHTML = "<div class='hint'>No notifications.</div>";
        return;
    }
    notifications.forEach(note => {
        const item = document.createElement("div");
        item.className = "notification-item";
        item.innerHTML = `
            <div><strong>${note.type}</strong> - ${note.isRead ? "Read" : "Unread"}</div>
            <div class="muted">${note.payload}</div>
        `;
        const actions = document.createElement("div");
        actions.className = "inline-actions";
        const readBtn = document.createElement("button");
        readBtn.className = "ghost";
        readBtn.textContent = "Mark Read";
        readBtn.onclick = () => updateNotification(note.id, { isRead: true });
        const delBtn = document.createElement("button");
        delBtn.className = "ghost danger";
        delBtn.textContent = "Delete";
        delBtn.onclick = () => deleteNotification(note.id);
        actions.appendChild(readBtn);
        actions.appendChild(delBtn);
        item.appendChild(actions);
        els.notificationList.appendChild(item);
    });
}

async function loadNotifications() {
    els.notificationHint.textContent = "";
    try {
        const notifications = await apiFetch("/notifications");
        renderNotifications(notifications);
    } catch (err) {
        els.notificationHint.textContent = err.message;
    }
}

async function createNotification() {
    els.notificationHint.textContent = "Creating...";
    try {
        const payload = parseJsonPayload(els.notificationPayload.value.trim(), {});
        await apiFetch("/notifications", {
            method: "POST",
            body: JSON.stringify({
                userId: els.notificationUserId.value.trim(),
                type: els.notificationType.value.trim(),
                payload
            })
        });
        els.notificationHint.textContent = "Created.";
        await loadNotifications();
    } catch (err) {
        els.notificationHint.textContent = err.message;
    }
}

async function updateNotification(notificationId, data) {
    try {
        await apiFetch(`/notifications/${notificationId}`, {
            method: "PUT",
            body: JSON.stringify(data)
        });
        await loadNotifications();
    } catch (err) {
        els.notificationHint.textContent = err.message;
    }
}

async function deleteNotification(notificationId) {
    try {
        await apiFetch(`/notifications/${notificationId}`, { method: "DELETE" });
        await loadNotifications();
    } catch (err) {
        els.notificationHint.textContent = err.message;
    }
}

function renderAttachments(attachments) {
    els.attachmentList.innerHTML = "";
    if (!attachments || attachments.length === 0) {
        els.attachmentList.innerHTML = "<div class='hint'>No attachments.</div>";
        return;
    }
    attachments.forEach(att => {
        const item = document.createElement("div");
        item.className = "attachment-item";
        item.innerHTML = `
            <div><strong>${att.fileName || "attachment"}</strong></div>
            <div class="muted">${att.url}</div>
            <div class="muted">${att.mimeType} - ${att.size || 0} bytes</div>
            <div class="muted">Id: ${att.id}</div>
        `;
        const actions = document.createElement("div");
        actions.className = "inline-actions";
        const useBtn = document.createElement("button");
        useBtn.className = "ghost";
        useBtn.textContent = "Use";
        useBtn.onclick = () => {
            els.attachmentId.value = att.id;
            els.attachmentMessageId.value = att.messageId;
            els.attachmentUrl.value = att.url;
            els.attachmentName.value = att.fileName;
            els.attachmentType.value = att.mimeType;
            els.attachmentSize.value = att.size;
        };
        actions.appendChild(useBtn);
        item.appendChild(actions);
        els.attachmentList.appendChild(item);
    });
}

async function loadAttachments() {
    els.attachmentHint.textContent = "";
    const messageId = els.attachmentMessageId.value.trim();
    if (!messageId) {
        els.attachmentHint.textContent = "Message id is required.";
        return;
    }
    try {
        const attachments = await apiFetch(`/messages/${messageId}/attachments`);
        renderAttachments(attachments);
    } catch (err) {
        els.attachmentHint.textContent = err.message;
    }
}

async function createAttachment() {
    els.attachmentHint.textContent = "Creating...";
    const messageId = els.attachmentMessageId.value.trim();
    if (!messageId) {
        els.attachmentHint.textContent = "Message id is required.";
        return;
    }
    try {
        await apiFetch(`/messages/${messageId}/attachments`, {
            method: "POST",
            body: JSON.stringify({
                url: els.attachmentUrl.value.trim(),
                fileName: els.attachmentName.value.trim(),
                mimeType: els.attachmentType.value.trim(),
                size: Number(els.attachmentSize.value || 0)
            })
        });
        els.attachmentHint.textContent = "Created.";
        await loadAttachments();
    } catch (err) {
        els.attachmentHint.textContent = err.message;
    }
}

async function updateAttachment() {
    els.attachmentHint.textContent = "Updating...";
    const attachmentId = els.attachmentId.value.trim();
    if (!attachmentId) {
        els.attachmentHint.textContent = "Attachment id is required.";
        return;
    }
    try {
        await apiFetch(`/attachments/${attachmentId}`, {
            method: "PUT",
            body: JSON.stringify({
                url: els.attachmentUrl.value.trim(),
                fileName: els.attachmentName.value.trim(),
                mimeType: els.attachmentType.value.trim(),
                size: Number(els.attachmentSize.value || 0)
            })
        });
        els.attachmentHint.textContent = "Updated.";
        await loadAttachments();
    } catch (err) {
        els.attachmentHint.textContent = err.message;
    }
}

async function deleteAttachment() {
    els.attachmentHint.textContent = "Deleting...";
    const attachmentId = els.attachmentId.value.trim();
    if (!attachmentId) {
        els.attachmentHint.textContent = "Attachment id is required.";
        return;
    }
    try {
        await apiFetch(`/attachments/${attachmentId}`, { method: "DELETE" });
        els.attachmentHint.textContent = "Deleted.";
        await loadAttachments();
    } catch (err) {
        els.attachmentHint.textContent = err.message;
    }
}

function renderReactions(reactions) {
    els.reactionList.innerHTML = "";
    if (!reactions || reactions.length === 0) {
        els.reactionList.innerHTML = "<div class='hint'>No reactions.</div>";
        return;
    }
    reactions.forEach(reaction => {
        const item = document.createElement("div");
        item.className = "reaction-item";
        item.innerHTML = `
            <div><strong>${reaction.emoji}</strong></div>
            <div class="muted">User: ${reaction.userId}</div>
            <div class="muted">Id: ${reaction.id}</div>
        `;
        const actions = document.createElement("div");
        actions.className = "inline-actions";
        const useBtn = document.createElement("button");
        useBtn.className = "ghost";
        useBtn.textContent = "Use";
        useBtn.onclick = () => {
            els.reactionId.value = reaction.id;
            els.reactionMessageId.value = reaction.messageId;
            els.reactionEmoji.value = reaction.emoji;
        };
        actions.appendChild(useBtn);
        item.appendChild(actions);
        els.reactionList.appendChild(item);
    });
}

async function loadReactions() {
    els.reactionHint.textContent = "";
    const messageId = els.reactionMessageId.value.trim();
    if (!messageId) {
        els.reactionHint.textContent = "Message id is required.";
        return;
    }
    try {
        const reactions = await apiFetch(`/messages/${messageId}/reactions`);
        renderReactions(reactions);
    } catch (err) {
        els.reactionHint.textContent = err.message;
    }
}

async function createReaction() {
    els.reactionHint.textContent = "Creating...";
    const messageId = els.reactionMessageId.value.trim();
    if (!messageId) {
        els.reactionHint.textContent = "Message id is required.";
        return;
    }
    try {
        await apiFetch(`/messages/${messageId}/reactions`, {
            method: "POST",
            body: JSON.stringify({ emoji: els.reactionEmoji.value.trim() })
        });
        els.reactionHint.textContent = "Created.";
        await loadReactions();
    } catch (err) {
        els.reactionHint.textContent = err.message;
    }
}

async function updateReaction() {
    els.reactionHint.textContent = "Updating...";
    const reactionId = els.reactionId.value.trim();
    if (!reactionId) {
        els.reactionHint.textContent = "Reaction id is required.";
        return;
    }
    try {
        await apiFetch(`/reactions/${reactionId}`, {
            method: "PUT",
            body: JSON.stringify({ emoji: els.reactionEmoji.value.trim() })
        });
        els.reactionHint.textContent = "Updated.";
        await loadReactions();
    } catch (err) {
        els.reactionHint.textContent = err.message;
    }
}

async function deleteReaction() {
    els.reactionHint.textContent = "Deleting...";
    const reactionId = els.reactionId.value.trim();
    if (!reactionId) {
        els.reactionHint.textContent = "Reaction id is required.";
        return;
    }
    try {
        await apiFetch(`/reactions/${reactionId}`, { method: "DELETE" });
        els.reactionHint.textContent = "Deleted.";
        await loadReactions();
    } catch (err) {
        els.reactionHint.textContent = err.message;
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
    currentUserId = null;
    resetAuthForms();
    els.chatList.innerHTML = "";
    els.messageList.innerHTML = "";
    els.profileHint.textContent = "";
    els.messageHint.textContent = "";
    els.chatHint.textContent = "";
    els.adminList.innerHTML = "";
    els.adminHint.textContent = "";
    els.friendRequestList.innerHTML = "";
    els.friendRequestHint.textContent = "";
    els.notificationList.innerHTML = "";
    els.notificationHint.textContent = "";
    els.attachmentList.innerHTML = "";
    els.attachmentHint.textContent = "";
    els.reactionList.innerHTML = "";
    els.reactionHint.textContent = "";
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
        await loadFriendRequests();
        await loadNotifications();
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
        const attachments = [];
        const attachmentUrl = els.messageAttachmentUrl.value.trim();
        if (attachmentUrl) {
            attachments.push({
                url: attachmentUrl,
                fileName: els.messageAttachmentName.value.trim() || "attachment",
                mimeType: els.messageAttachmentType.value.trim() || "application/octet-stream",
                size: Number(els.messageAttachmentSize.value || 0)
            });
        }
        await apiFetch(`/chats/${currentChatId}/messages`, {
            method: "POST",
            body: JSON.stringify({
                content: els.messageContent.value.trim(),
                attachments
            })
        });
        els.messageContent.value = "";
        els.messageAttachmentUrl.value = "";
        els.messageAttachmentName.value = "";
        els.messageAttachmentType.value = "";
        els.messageAttachmentSize.value = "";
        await loadMessages(currentChatId);
        await loadNotifications();
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
els.btnRefreshFriends.onclick = () => loadFriendRequests();
els.friendRequestForm.onsubmit = (e) => {
    e.preventDefault();
    createFriendRequest();
};
els.btnRefreshNotifications.onclick = () => loadNotifications();
els.notificationForm.onsubmit = (e) => {
    e.preventDefault();
    createNotification();
};
els.btnRefreshAttachments.onclick = () => loadAttachments();
els.attachmentCreate.onclick = () => createAttachment();
els.attachmentUpdate.onclick = () => updateAttachment();
els.attachmentDelete.onclick = () => deleteAttachment();
els.btnRefreshReactions.onclick = () => loadReactions();
els.reactionCreate.onclick = () => createReaction();
els.reactionUpdate.onclick = () => updateReaction();
els.reactionDelete.onclick = () => deleteReaction();

// Init
setAuthMode(authMode);
if (authToken) {
    loadProfile();
    loadChats();
    loadAdminList();
    loadFriendRequests();
    loadNotifications();
}


