const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "..", "data.json");

const defaultData = {
    users: [],
    conversations: [],
    messages: []
};

function loadData() {
    if (!fs.existsSync(DATA_PATH)) {
        fs.writeFileSync(DATA_PATH, JSON.stringify(defaultData, null, 2), "utf8");
        return { ...defaultData };
    }
    const raw = fs.readFileSync(DATA_PATH, "utf8");
    try {
        const parsed = JSON.parse(raw);
        return {
            users: Array.isArray(parsed.users) ? parsed.users : [],
            conversations: Array.isArray(parsed.conversations) ? parsed.conversations : [],
            messages: Array.isArray(parsed.messages) ? parsed.messages : []
        };
    } catch {
        fs.writeFileSync(DATA_PATH, JSON.stringify(defaultData, null, 2), "utf8");
        return { ...defaultData };
    }
}

function saveData(data) {
    const payload = {
        users: Array.isArray(data.users) ? data.users : [],
        conversations: Array.isArray(data.conversations) ? data.conversations : [],
        messages: Array.isArray(data.messages) ? data.messages : []
    };
    fs.writeFileSync(DATA_PATH, JSON.stringify(payload, null, 2), "utf8");
}

module.exports = {
    loadData,
    saveData
};
