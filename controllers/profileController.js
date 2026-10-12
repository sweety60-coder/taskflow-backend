// =======================================
// TaskFlow Pro X
// Profile Controller
// =======================================

const db = require("../config/db");

// =======================================
// GET PROFILE
// =======================================

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const [rows] = await db.query(
            `
            SELECT
                id,
                full_name,
                email,
                plan,
                subscription_status,
                subscription_start,
                subscription_end,
                created_at
            FROM users
            WHERE id = ?
            `,
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user: rows[0]
        });

    } catch (error) {
        console.error("Get Profile Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to load profile"
        });
    }
};

// =======================================
// UPDATE PROFILE
// Name only
//
// Email changes MUST go through OTP.
// =======================================

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        let { name } = req.body;

        // -------------------------------
        // Validate name
        // -------------------------------

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
                message: "Name cannot be empty"
            });
        }

        if (name.length > 100) {
            return res.status(400).json({
                success: false,
                message: "Name is too long"
            });
        }

        // -------------------------------
        // Update name ONLY
        // -------------------------------

        await db.query(
            `
            UPDATE users
            SET full_name = ?
            WHERE id = ?
            `,
            [
                name,
                userId
            ]
        );

        // -------------------------------
        // Get updated profile
        // -------------------------------

        const [rows] = await db.query(
            `
            SELECT
                id,
                full_name,
                email,
                plan,
                subscription_status,
                subscription_start,
                subscription_end,
                created_at
            FROM users
            WHERE id = ?
            `,
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // -------------------------------
        // Success
        // -------------------------------

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: rows[0]
        });

    } catch (error) {
        console.error("Update Profile Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to update profile"
        });
    }
};
