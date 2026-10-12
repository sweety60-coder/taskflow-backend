// =======================================
// Task Controller
// TaskFlow Pro X
// Secure User-Owned Tasks
// =======================================

const db = require("../config/db");


// =======================================
// GET TASKS
// Search + Status + Priority Filter
// =======================================

exports.getTasks = async (req, res) => {
    try {

        // Never trust user_id from the client.
        // Always use the authenticated JWT user.
        const userId = req.user.id;

        let {
            search = "",
            status = "",
            priority = ""
        } = req.query;

        // Validate query parameters
        if (
            typeof search !== "string" ||
            typeof status !== "string" ||
            typeof priority !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid task filters"
            });
        }

        search = search.trim();
        status = status.trim();
        priority = priority.trim();

        if (search.length > 100) {
            return res.status(400).json({
                success: false,
                message: "Search text is too long"
            });
        }

        if (status.length > 50 || priority.length > 50) {
            return res.status(400).json({
                success: false,
                message: "Invalid filter value"
            });
        }

        let sql = `
            SELECT *
            FROM tasks
            WHERE user_id = ?
        `;

        let params = [userId];

        // ===============================
        // SEARCH
        // ===============================

        if (search) {
            sql += `
                AND title LIKE ?
            `;

            params.push(`%${search}%`);
        }

        // ===============================
        // STATUS FILTER
        // ===============================

        if (status) {
            sql += `
                AND status = ?
            `;

            params.push(status);
        }

        // ===============================
        // PRIORITY FILTER
        // ===============================

        if (priority) {
            sql += `
                AND priority = ?
            `;

            params.push(priority);
        }

        sql += `
            ORDER BY created_at DESC
        `;

        const [rows] = await db.query(
            sql,
            params
        );

        return res.json({
            success: true,
            tasks: rows
        });

    } catch (error) {

        console.error("Get Tasks Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch tasks"
        });
    }
};


// =======================================
// CREATE TASK
// =======================================

exports.createTask = async (req, res) => {
    try {

        // Never accept user_id from req.body.
        // The authenticated user's ID comes from JWT.
        const userId = req.user.id;

        const {
            title,
            description,
            status,
            priority,
            due_date
        } = req.body;

        // ===============================
        // TYPE VALIDATION
        // ===============================

        if (typeof title !== "string") {
            return res.status(400).json({
                success: false,
                message: "Task title is required"
            });
        }

        if (
            description !== undefined &&
            description !== null &&
            typeof description !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid task description"
            });
        }

        if (
            status !== undefined &&
            status !== null &&
            typeof status !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid task status"
            });
        }

        if (
            priority !== undefined &&
            priority !== null &&
            typeof priority !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid task priority"
            });
        }

        // ===============================
        // CLEAN VALUES
        // ===============================

        const cleanTitle = title.trim();
        const cleanDescription =
            typeof description === "string"
                ? description.trim()
                : null;

        const cleanStatus =
            typeof status === "string" && status.trim()
                ? status.trim()
                : "Pending";

        const cleanPriority =
            typeof priority === "string" && priority.trim()
                ? priority.trim()
                : "Medium";

        // ===============================
        // LENGTH VALIDATION
        // ===============================

        if (!cleanTitle) {
            return res.status(400).json({
                success: false,
                message: "Task title is required"
            });
        }

        if (cleanTitle.length > 255) {
            return res.status(400).json({
                success: false,
                message: "Task title is too long"
            });
        }

        if (
            cleanDescription !== null &&
            cleanDescription.length > 10000
        ) {
            return res.status(400).json({
                success: false,
                message: "Task description is too long"
            });
        }

        if (cleanStatus.length > 50) {
            return res.status(400).json({
                success: false,
                message: "Task status is too long"
            });
        }

        if (cleanPriority.length > 50) {
            return res.status(400).json({
                success: false,
                message: "Task priority is too long"
            });
        }

        const [result] = await db.query(
            `
            INSERT INTO tasks
            (
                user_id,
                title,
                description,
                status,
                priority,
                due_date
            )
            VALUES (?,?,?,?,?,?)
            `,
            [
                userId,
                cleanTitle,
                cleanDescription,
                cleanStatus,
                cleanPriority,
                due_date || null
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            id: result.insertId
        });

    } catch (error) {

        console.error("Create Task Error:", error);

        return res.status(500).json({
            success: false,
            message: "Create task failed"
        });
    }
};


// =======================================
// UPDATE TASK
// =======================================

exports.updateTask = async (req, res) => {
    try {

        const taskId = req.params.id;

        // User ID comes from verified JWT.
        const userId = req.user.id;

        const {
            title,
            description,
            status,
            priority,
            due_date
        } = req.body;

        // ===============================
        // TYPE VALIDATION
        // ===============================

        if (typeof title !== "string") {
            return res.status(400).json({
                success: false,
                message: "Task title is required"
            });
        }

        if (
            description !== undefined &&
            description !== null &&
            typeof description !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid task description"
            });
        }

        if (
            status !== undefined &&
            status !== null &&
            typeof status !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid task status"
            });
        }

        if (
            priority !== undefined &&
            priority !== null &&
            typeof priority !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid task priority"
            });
        }

        // ===============================
        // CLEAN VALUES
        // ===============================

        const cleanTitle = title.trim();

        const cleanDescription =
            typeof description === "string"
                ? description.trim()
                : null;

        const cleanStatus =
            typeof status === "string" && status.trim()
                ? status.trim()
                : "Pending";

        const cleanPriority =
            typeof priority === "string" && priority.trim()
                ? priority.trim()
                : "Medium";

        // ===============================
        // LENGTH VALIDATION
        // ===============================

        if (!cleanTitle) {
            return res.status(400).json({
                success: false,
                message: "Task title is required"
            });
        }

        if (cleanTitle.length > 255) {
            return res.status(400).json({
                success: false,
                message: "Task title is too long"
            });
        }

        if (
            cleanDescription !== null &&
            cleanDescription.length > 10000
        ) {
            return res.status(400).json({
                success: false,
                message: "Task description is too long"
            });
        }

        if (cleanStatus.length > 50) {
            return res.status(400).json({
                success: false,
                message: "Task status is too long"
            });
        }

        if (cleanPriority.length > 50) {
            return res.status(400).json({
                success: false,
                message: "Task priority is too long"
            });
        }

        // ===============================
        // DATE FORMATTING
        // ===============================

        let formattedDate = due_date;

        if (due_date) {
            formattedDate = due_date.split("T")[0];
        }

        // ===============================
        // UPDATE ONLY USER'S OWN TASK
        // ===============================

        const [result] = await db.query(
            `
            UPDATE tasks
            SET
                title = ?,
                description = ?,
                status = ?,
                priority = ?,
                due_date = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            AND user_id = ?
            `,
            [
                cleanTitle,
                cleanDescription,
                cleanStatus,
                cleanPriority,
                formattedDate || null,
                taskId,
                userId
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        return res.json({
            success: true,
            message: "Task updated successfully"
        });

    } catch (error) {

        console.error("Update Task Error:", error);

        return res.status(500).json({
            success: false,
            message: "Update task failed"
        });
    }
};


// =======================================
// DELETE TASK
// =======================================

exports.deleteTask = async (req, res) => {
    try {

        const taskId = req.params.id;

        // User ID comes from verified JWT.
        const userId = req.user.id;

        // ===============================
        // DELETE ONLY USER'S OWN TASK
        // ===============================

        const [result] = await db.query(
            `
            DELETE FROM tasks
            WHERE id = ?
            AND user_id = ?
            `,
            [
                taskId,
                userId
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        return res.json({
            success: true,
            message: "Task deleted successfully"
        });

    } catch (error) {

        console.error("Delete Task Error:", error);

        return res.status(500).json({
            success: false,
            message: "Delete task failed"
        });
    }
};
