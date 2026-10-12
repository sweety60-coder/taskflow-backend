const db = require("../config/db");

// =======================================
// SUBMIT FEEDBACK
// =======================================

exports.submitFeedback = async (req, res) => {
    try {
        const userId = req.user.id;

        const { rating, type, message } = req.body;

        // -------------------------------
        // Validation
        // -------------------------------

        const numericRating = Number(rating);

        if (
            !Number.isInteger(numericRating) ||
            numericRating < 1 ||
            numericRating > 5
        ) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5."
            });
        }

        if (!type || typeof type !== "string") {
            return res.status(400).json({
                success: false,
                message: "Feedback type is required."
            });
        }

        const trimmedType = type.trim();
        const trimmedMessage =
            typeof message === "string"
                ? message.trim()
                : "";

        if (trimmedMessage.length < 5) {
            return res.status(400).json({
                success: false,
                message: "Feedback must contain at least 5 characters."
            });
        }

        if (trimmedMessage.length > 2000) {
            return res.status(400).json({
                success: false,
                message: "Feedback cannot exceed 2000 characters."
            });
        }

        // -------------------------------
        // Save feedback
        // -------------------------------

        await db.query(
            `
            INSERT INTO feedback
            (
                user_id,
                rating,
                type,
                message
            )
            VALUES (?, ?, ?, ?)
            `,
            [
                userId,
                numericRating,
                trimmedType,
                trimmedMessage
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Feedback submitted successfully."
        });

    } catch (error) {
        console.error(
            "Submit Feedback Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to submit feedback."
        });
    }
};
