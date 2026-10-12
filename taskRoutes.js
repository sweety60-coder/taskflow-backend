const express = require("express");

const router = express.Router();

const taskController = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");

// Protect all task routes with JWT authentication
router.use(authMiddleware);

// GET TASKS
router.get(
    "/",
    taskController.getTasks
);

// CREATE TASK
router.post(
    "/",
    taskController.createTask
);

// UPDATE TASK
router.put(
    "/:id",
    taskController.updateTask
);

// DELETE TASK
router.delete(
    "/:id",
    taskController.deleteTask
);

module.exports = router;