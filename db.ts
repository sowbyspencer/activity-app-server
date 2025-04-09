const { Pool } = require("pg");

const isHostedDB = !process.env.DB_ENV || process.env.DB_ENV === "hosted"; // Default to hosted DB

let pool;

if (isHostedDB && process.env.DATABASE_URL) {
    // ✅ Hosted (Production) config
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });
} else {
    // ✅ Local development config
    pool = new Pool({
        user: process.env.DB_USER || "postgres",
        host: process.env.DB_HOST || "localhost",
        database: process.env.DB_NAME || "postgres",
        password: process.env.DB_PASSWORD || "postgres",
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    });
}

module.exports = pool;
