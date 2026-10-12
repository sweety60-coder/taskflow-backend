
const db = require("../config/db");

exports.getSubscription = async (req, res) => {
    try {
        const userId = req.user.id;

        const [users] = await db.query(
            `SELECT
                id,
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

        const user = users[0];

        return res.status(200).json({
            success: true,
            subscription: {
                plan: user.plan,
                subscription_status: user.subscription_status,
                subscription_start: user.subscription_start,
                subscription_end: user.subscription_end
            }
        });

    } catch (error) {
        console.error("Get Subscription Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch subscription"
        });
    }
};