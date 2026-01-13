const { initDatabase, models } = require("../config/database");

async function ensureRoles() {
    const roles = ["Admin", "User"];
    for (const name of roles) {
        await models.Role.findOrCreate({ where: { name } });
    }
}

async function main() {
    await initDatabase();
    await ensureRoles();
    console.log("Database schema is ready.");
}

main().catch(err => {
    console.error("Database migration failed:", err.message);
    process.exit(1);
});
