// models/Task.js
const mongoose = require("mongoose"); // Changed from import to require

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: {
    type: String,
    enum: ["todo", "inprogress", "done"],
    default: "todo",
  },
}, { timestamps: true }); // Added timestamps for created/updated dates (optional but good practice)

module.exports = mongoose.model("Task", TaskSchema); // Changed from export default to module.exports