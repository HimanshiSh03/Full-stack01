// routes/taskRoutes.js
const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

// Define column names for validation
const COLUMN_NAMES = ["Todo", "In Progress", "Done"];

// POST /api/tasks - Add a new task
router.post("/", async (req, res) => {
  try {
    const { title, status, description, assignedUser, priority } = req.body;

    // Basic Validation: Title must not be empty
    if (!title || title.trim() === '') {
        return res.status(400).json({ message: "Task title cannot be empty." });
    }

    // Validation: Title must not match column names
    if (COLUMN_NAMES.includes(title.trim())) {
      return res.status(400).json({ message: "Task title cannot be a column name." });
    }

    // Validation: Title must be unique per board (assuming one board, check across all tasks)
    const existingTask = await Task.findOne({ title: title.trim() });
    if (existingTask) {
      return res.status(400).json({ message: "Task title must be unique." });
    }

    const task = new Task({ title, status, description, assignedUser, priority });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ message: "Failed to add task", error: error.message });
  }
});

// GET /api/tasks - Get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Failed to fetch tasks", error: error.message });
  }
});

// PATCH /api/tasks/:id - Update a task
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (title !== undefined && title.trim() === '') {
        return res.status(400).json({ message: "Task title cannot be empty." });
    }

    // Validation: Title must not match column names (if updating title)
    if (title && COLUMN_NAMES.includes(title.trim())) {
      return res.status(400).json({ message: "Task title cannot be a column name." });
    }

    // Validation: Title must be unique (if updating title)
    if (title) {
        const existingTask = await Task.findOne({ title: title.trim(), _id: { $ne: id } });
        if (existingTask) {
            return res.status(400).json({ message: "Task title must be unique." });
        }
    }

    const task = await Task.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Failed to update task", error: error.message });
  }
});

// DELETE /api/tasks/:id - Delete a task
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Failed to delete task", error: error.message });
  }
});

module.exports = router;