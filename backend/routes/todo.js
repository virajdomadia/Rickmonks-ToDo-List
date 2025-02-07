const express = require("express");
const Todo = require("../models/Todo");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// ✅ Create a new todo
router.post("/", authMiddleware, async (req, res) => {
  console.log("Received request body:", req.body); // Debug log

  const { task } = req.body;
  if (!task || typeof task !== "string") {
    return res
      .status(400)
      .json({ error: "Task is required and must be a string" });
  }

  try {
    const newTodo = new Todo({
      task,
      userId: req.user.id, // ✅ Correct field name
    });

    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    console.error("Error saving todo:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// ✅ Get todos with filtering, search, and pagination
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { search = "", completed, page = 1, limit = 5 } = req.query;
    const query = { userId: req.user.id }; // ✅ Correct field name

    if (search) query.task = new RegExp(search, "i");
    if (completed !== undefined) query.completed = completed === "true";

    const totalTodos = await Todo.countDocuments(query);
    const todos = await Todo.find(query)
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({ todos, totalPages: Math.ceil(totalTodos / limit) });
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ message: "Error fetching todos" });
  }
});

// ✅ Update a todo
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { task, completed } = req.body;

    if (task !== undefined && typeof task !== "string") {
      return res.status(400).json({ error: "Task must be a string" });
    }

    if (completed !== undefined && typeof completed !== "boolean") {
      return res.status(400).json({ error: "Completed must be a boolean" });
    }

    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, // ✅ Use 'userId'
      { $set: req.body },
      { new: true }
    );

    if (!updatedTodo) return res.status(404).json({ error: "Todo not found" });

    res.json(updatedTodo);
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ message: "Error updating todo" });
  }
});

// ✅ Delete a todo
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedTodo = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id, // ✅ Use 'userId'
    });

    if (!deletedTodo) return res.status(404).json({ error: "Todo not found" });

    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ message: "Error deleting todo" });
  }
});

module.exports = router;
