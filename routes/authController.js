// =======================================
// TaskFlow Pro X
// Authentication Controller
// =======================================

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const db = require("../config/db");

const { Resend } = require("resend");

const resend = new Resend(
    process.env.RESEND_API_KEY
);

// ======================
// HELPERS
// ======================

const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const createOtp = () => {
    return crypto
        .randomInt(100000, 1000000)
        .toString();
};

const hashOtp = (otp) => {
    return crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex");
};

const createToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );
};

const getUserResponse = (user) => {
    return {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        plan: user.plan,
        subscription_status:
            user.subscription_status,
        subscription_start:
            user.subscription_start,
        subscription_end:
            user.subscription_end
    };
};

// ======================
// SIGNUP
// ======================

exports.signup = async (req, res) => {
    try {
        let {
            name,
            email,
            password
        } = req.body;

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid signup details"
            });
        }

        name = name.trim();
        email = email.trim().toLowerCase();

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (name.length > 255) {
            return res.status(400).json({
                success: false,
                message: "Name is too long"
            });
        }

        if (email.length > 255) {
            return res.status(400).json({
                success: false,
                message: "Email is too long"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 8 characters"
            });
        }

        if (password.length > 128) {
            return res.status(400).json({
                success: false,
                message: "Password is too long"
            });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message:
                    "Please enter a valid email address"
            });
        }

        const [users] = await db.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (users.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const [result] = await db.query(
            `INSERT INTO users
                (full_name, email, password)
             VALUES (?, ?, ?)`,
            [
                name,
                email,
                hashedPassword
            ]
        );

        console.log(
            "User Created:",
            result.insertId
        );

        return res.status(201).json({
            success: true,
            message: "Signup successful",
            userId: result.insertId,
            plan: "FREE",
            subscription_status: "ACTIVE"
        });

    } catch (error) {
        console.error(
            "Signup Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Signup failed. Please try again later."
        });
    }
};

// ======================
// LOGIN
// ======================

exports.login = async (req, res) => {
    try {
        let {
            email,
            password
        } = req.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid login details"
            });
        }

        email = email.trim().toLowerCase();

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Email and Password are required"
            });
        }

        if (
            email.length > 255 ||
            password.length > 128
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid email or password"
            });
        }

        const [users] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password"
            });
        }

        const user = users[0];

        const isMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password"
            });
        }

        const token = createToken(user);

        console.log(
            "Login Successful"
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            userId: user.id,
            full_name: user.full_name,
            email: user.email,
            plan: user.plan,
            subscription_status:
                user.subscription_status,
            subscription_start:
                user.subscription_start,
            subscription_end:
                user.subscription_end
        });

    } catch (error) {
        console.error(
            "Login Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Login failed. Please try again later."
        });
    }
};

// ======================
// GET PROFILE
// ======================

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const [users] = await db.query(
            `SELECT
                id,
                full_name,
                email,
                plan,
                subscription_status,
                subscription_start,
                subscription_end
             FROM users
             WHERE id = ?`,
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user: getUserResponse(
                users[0]
            )
        });

    } catch (error) {
        console.error(
            "Get Profile Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to load profile"
        });
    }
};

// ======================
// UPDATE PROFILE
// ======================

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        let {
            name
        } = req.body;

        if (typeof name !== "string") {
            return res.status(400).json({
                success: false,
                message: "Name is required"
            });
        }

        name = name.trim();

        if (!name) {
            return res.status(400).json({
                success: false,
                message:
                    "Name cannot be empty"
            });
        }

        if (name.length > 100) {
            return res.status(400).json({
                success: false,
                message: "Name is too long"
            });
        }

        await db.query(
            "UPDATE users SET full_name = ? WHERE id = ?",
            [
                name,
                userId
            ]
        );

        const [users] = await db.query(
            `SELECT
                id,
                full_name,
                email,
                plan,
                subscription_status,
                subscription_start,
                subscription_end
             FROM users
             WHERE id = ?`,
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Profile updated successfully",
            user: getUserResponse(
                users[0]
            )
        });

    } catch (error) {
        console.error(
            "Update Profile Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to update profile"
        });
    }
};

// ======================
// REQUEST EMAIL OTP
// ======================

exports.requestEmailOtp = async (req, res) => {
    try {
        const userId = req.user.id;

        let {
            newEmail
        } = req.body;

        console.log(
            "OTP request received. Raw email:",
            newEmail
        );

        if (typeof newEmail !== "string") {
            return res.status(400).json({
                success: false,
                message:
                    "New email is required"
            });
        }

        newEmail =
            newEmail.trim().toLowerCase();

        if (!newEmail) {
            return res.status(400).json({
                success: false,
                message:
                    "New email is required"
            });
        }

        if (newEmail.length > 100) {
            return res.status(400).json({
                success: false,
                message:
                    "Email is too long"
            });
        }

        if (!isValidEmail(newEmail)) {
            return res.status(400).json({
                success: false,
                message:
                    "Please enter a valid email address"
            });
        }

        // ---------------------------------------
        // Get current user
        // ---------------------------------------

        const [currentUsers] =
            await db.query(
                `SELECT id, email
                 FROM users
                 WHERE id = ?`,
                [userId]
            );

        if (currentUsers.length === 0) {
            return res.status(404).json({
                success: false,
                message:
                    "User not found"
            });
        }

        if (
            currentUsers[0].email ===
            newEmail
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "This is already your current email"
            });
        }

        // ---------------------------------------
        // Check duplicate email
        // ---------------------------------------

        const [existingUsers] =
            await db.query(
                `SELECT id
                 FROM users
                 WHERE email = ?
                   AND id <> ?`,
                [
                    newEmail,
                    userId
                ]
            );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                success: false,
                message:
                    "This email is already registered"
            });
        }

        // ---------------------------------------
        // Delete previous OTP
        // ---------------------------------------

        await db.query(
            `DELETE FROM profile_email_otps
             WHERE user_id = ?`,
            [userId]
        );

        // ---------------------------------------
        // Create OTP
        // ---------------------------------------

        const otp = createOtp();

        const otpHash =
            hashOtp(otp);

        // ---------------------------------------
        // Save OTP
        // ---------------------------------------

        await db.query(
            `INSERT INTO profile_email_otps
                (
                    user_id,
                    new_email,
                    otp_hash,
                    expires_at
                )
             VALUES
                (
                    ?,
                    ?,
                    ?,
                    DATE_ADD(
                        NOW(),
                        INTERVAL 10 MINUTE
                    )
                )`,
            [
                userId,
                newEmail,
                otpHash
            ]
        );

        // ---------------------------------------
        // Resend sender
        // ---------------------------------------

        const fromEmail =
            process.env.RESEND_FROM_EMAIL ||
            "onboarding@resend.dev";

        console.log(
            "Resend FROM email configured:",
            fromEmail
        );

        console.log(
            "Sending TaskFlow OTP email to:",
            newEmail
        );

        // ---------------------------------------
        // Send OTP email
        // ---------------------------------------

        const {
            data,
            error
        } = await resend.emails.send({
            from: fromEmail,

            to: [
                newEmail
            ],

            subject:
                "TaskFlow Pro X - Email Verification Code",

            html: `
                <div style="
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: auto;
                    padding: 20px;
                ">

                    <h2>
                        TaskFlow Pro X
                    </h2>

                    <p>
                        You requested to change the
                        email address associated with
                        your TaskFlow Pro X account.
                    </p>

                    <p>
                        Your verification code is:
                    </p>

                    <div style="
                        font-size: 32px;
                        font-weight: bold;
                        letter-spacing: 8px;
                        margin: 24px 0;
                    ">
                        ${otp}
                    </div>

                    <p>
                        This code will expire in
                        <strong>10 minutes</strong>.
                    </p>

                    <p>
                        If you did not request this
                        change, you can safely ignore
                        this email.
                    </p>

                    <p>
                        — TaskFlow Pro X
                    </p>

                </div>
            `
        });

        // ---------------------------------------
        // Handle Resend error
        // ---------------------------------------

        if (error) {
            console.error(
                "Resend Email Error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Unable to send verification code"
            });
        }

        // ---------------------------------------
        // Email accepted by Resend
        // ---------------------------------------

        console.log(
            "TaskFlow OTP email accepted by Resend:",
            data
        );

        return res.status(200).json({
            success: true,
            message:
                "Verification code sent to your new email address"
        });

    } catch (error) {
        console.error(
            "Request Email OTP Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to send verification code"
        });
    }
};

// ======================
// VERIFY EMAIL OTP
// ======================

exports.verifyEmailOtp = async (req, res) => {
    try {
        const userId = req.user.id;

        let {
            newEmail,
            otp,
            name
        } = req.body;

        if (
            typeof newEmail !== "string" ||
            typeof otp !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Email and verification code are required"
            });
        }

        newEmail =
            newEmail.trim().toLowerCase();

        otp = otp.trim();

        if (!isValidEmail(newEmail)) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid email address"
            });
        }

        if (!/^\d{6}$/.test(otp)) {
            return res.status(400).json({
                success: false,
                message:
                    "Verification code must be 6 digits"
            });
        }

        // ---------------------------------------
        // Get latest OTP
        // ---------------------------------------

        const [otpRows] =
            await db.query(
                `SELECT *
                 FROM profile_email_otps
                 WHERE user_id = ?
                   AND new_email = ?
                 ORDER BY id DESC
                 LIMIT 1`,
                [
                    userId,
                    newEmail
                ]
            );

        if (otpRows.length === 0) {
            return res.status(400).json({
                success: false,
                message:
                    "Verification code not found. Please request a new code."
            });
        }

        const otpRecord =
            otpRows[0];

        // ---------------------------------------
        // Check expiry
        // ---------------------------------------

        if (
            new Date(
                otpRecord.expires_at
            ).getTime() < Date.now()
        ) {
            await db.query(
                `DELETE FROM profile_email_otps
                 WHERE id = ?`,
                [otpRecord.id]
            );

            return res.status(400).json({
                success: false,
                message:
                    "Verification code has expired"
            });
        }

        // ---------------------------------------
        // Check attempts
        // ---------------------------------------

        if (
            otpRecord.attempts >= 5
        ) {
            return res.status(429).json({
                success: false,
                message:
                    "Too many incorrect attempts. Please request a new code."
            });
        }

        // ---------------------------------------
        // Verify OTP
        // ---------------------------------------

        const suppliedHash =
            hashOtp(otp);

        if (
            suppliedHash !==
            otpRecord.otp_hash
        ) {
            await db.query(
                `UPDATE profile_email_otps
                 SET attempts = attempts + 1
                 WHERE id = ?`,
                [otpRecord.id]
            );

            return res.status(400).json({
                success: false,
                message:
                    "Incorrect verification code"
            });
        }

        // ---------------------------------------
        // Check duplicate email again
        // ---------------------------------------

        const [existingUsers] =
            await db.query(
                `SELECT id
                 FROM users
                 WHERE email = ?
                   AND id <> ?`,
                [
                    newEmail,
                    userId
                ]
            );

        if (existingUsers.length > 0) {
            await db.query(
                `DELETE FROM profile_email_otps
                 WHERE id = ?`,
                [otpRecord.id]
            );

            return res.status(409).json({
                success: false,
                message:
                    "This email is already registered"
            });
        }

        // ---------------------------------------
        // Name
        // ---------------------------------------

        if (typeof name === "string") {
            name = name.trim();
        }

        if (!name) {
            const [currentUsers] =
                await db.query(
                    `SELECT full_name
                     FROM users
                     WHERE id = ?`,
                    [userId]
                );

            if (currentUsers.length === 0) {
                return res.status(404).json({
                    success: false,
                    message:
                        "User not found"
                });
            }

            name =
                currentUsers[0].full_name;
        }

        if (name.length > 100) {
            return res.status(400).json({
                success: false,
                message:
                    "Name is too long"
            });
        }

        // ---------------------------------------
        // Update user email
        // ---------------------------------------

        await db.query(
            `UPDATE users
             SET
                full_name = ?,
                email = ?
             WHERE id = ?`,
            [
                name,
                newEmail,
                userId
            ]
        );

        // ---------------------------------------
        // Delete OTP
        // ---------------------------------------

        await db.query(
            `DELETE FROM profile_email_otps
             WHERE user_id = ?`,
            [userId]
        );

        // ---------------------------------------
        // Get updated user
        // ---------------------------------------

        const [updatedUsers] =
            await db.query(
                `SELECT
                    id,
                    full_name,
                    email,
                    plan,
                    subscription_status,
                    subscription_start,
                    subscription_end
                 FROM users
                 WHERE id = ?`,
                [userId]
            );

        if (updatedUsers.length === 0) {
            return res.status(404).json({
                success: false,
                message:
                    "User not found"
            });
        }

        const updatedUser =
            updatedUsers[0];

        // ---------------------------------------
        // Create new token
        // ---------------------------------------

        const newToken =
            createToken(updatedUser);

        return res.status(200).json({
            success: true,
            message:
                "Profile and email updated successfully",
            token: newToken,
            user:
                getUserResponse(
                    updatedUser
                )
        });

    } catch (error) {
        console.error(
            "Verify Email OTP Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to verify email"
        });
    }
};
