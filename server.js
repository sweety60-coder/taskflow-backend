
// =======================================
// TaskFlow Pro X
// Backend Server
// =======================================

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

require("dotenv").config();

const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const profileRoutes = require("./routes/profileRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

const app = express();

// =======================================
// TRUST RAILWAY PROXY
// =======================================

app.set("trust proxy", 1);

// =======================================
// SECURITY
// =======================================

app.use(helmet());

// =======================================
// CORS
// =======================================

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests without an Origin header.
            if (!origin) {
                return callback(null, true);
            }

            const allowedOrigins = [
                "https://taskflow-pro-x-11703.web.app",
                "http://localhost:3000",
                "http://localhost:5000",
            ];

            // Allow any localhost port during development.
            const isLocalhost =
                /^http:\/\/localhost:\d+$/.test(origin);

            if (
                allowedOrigins.includes(origin) ||
                isLocalhost
            ) {
                return callback(null, true);
            }

            return callback(
                new Error("Not allowed by CORS")
            );
        },
    })
);

// =======================================
// JSON BODY PARSER
// =======================================

app.use(
    express.json({
        limit: "100kb",
    })
);

// =======================================
// HEALTH CHECK
// =======================================

app.get("/api/health", (req, res) => {
    res.json({
        status: "Server is running",
    });
});

// =======================================
// API ROUTES
// =======================================

app.use("/api/auth", authRoutes);

app.use("/api/tasks", taskRoutes);

app.use("/api/subscription", subscriptionRoutes);

app.use("/api/profile", profileRoutes);

app.use("/api/feedback", feedbackRoutes);

// =======================================
// PORT
// =======================================

const PORT = process.env.PORT || 3000;

// =======================================
// START SERVER
// =======================================

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    db.getConnection()
        .then(async (connection) => {
            console.log("MySQL Connected Successfully");

            try {
                // =======================================
                // TEMPORARY DATABASE SETUP
                // =======================================
                // These tables are currently missing from
                // the Railway production database.
                //
                // IF NOT EXISTS makes this safe to run
                // multiple times.
                // =======================================

                // ---------------------------------------
                // FEEDBACK TABLE
                // ---------------------------------------

                await connection.query(`
                    CREATE TABLE IF NOT EXISTS feedback (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        user_id INT NOT NULL,
                        rating INT NOT NULL,
                        type VARCHAR(100) NOT NULL,
                        message TEXT NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                        INDEX idx_feedback_user_id (user_id),

                        CONSTRAINT fk_feedback_user
                            FOREIGN KEY (user_id)
                            REFERENCES users(id)
                            ON DELETE CASCADE
                    )
                `);

                console.log(
                    "Feedback table verified."
                );

                // ---------------------------------------
                // PROFILE EMAIL OTP TABLE
                // ---------------------------------------

                await connection.query(`
                    CREATE TABLE IF NOT EXISTS profile_email_otps (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        user_id INT NOT NULL,
                        new_email VARCHAR(100) NOT NULL,
                        otp_hash VARCHAR(255) NOT NULL,
                        expires_at DATETIME NOT NULL,
                        attempts INT NOT NULL DEFAULT 0,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                        INDEX idx_profile_email_otps_user_id (user_id),

                        CONSTRAINT fk_profile_email_otps_user
                            FOREIGN KEY (user_id)
                            REFERENCES users(id)
                            ON DELETE CASCADE
                    )
                `);

                console.log(
                    "Profile email OTP table verified."
                );

                console.log(
                    "Database setup completed successfully."
                );

            } catch (error) {
                console.error(
                    "Database table setup failed:",
                    error.message
                );
            } finally {
                connection.release();
            }

            console.log("Database connected");
        })
        .catch((error) => {
            console.error(
                "Database connection failed:",
                error.message
            );
        });
});
