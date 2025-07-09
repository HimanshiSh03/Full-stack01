// routes/taskRoutes.js
const express = require("express");
const Task = require("../models/Task"); // This import will now correctly get the Task model

const router = express.Router();

// POST /api/tasks - Add a new task
router.post("/", async (req, res) => {
  try {
    const task = new Task(req.body); // Create a new Task instance from request body
    await task.save(); // Save the task to the database
    res.status(201).json(task); // Respond with the created task and 201 status
  } catch (error) {
    console.error("Error adding task:", error); // Log the error on the server side
    // Send a 400 for client-side validation errors or a 500 for server issues
    res.status(500).json({ message: "Failed to add task", error: error.message });
  }
});

// GET /api/tasks - Get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find(); // Find all tasks
    res.json(tasks); // Respond with the array of tasks
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Failed to fetch tasks", error: error.message });
  }
});

// PATCH /api/tasks/:id - Update a task
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Find and update the task, return the new document
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