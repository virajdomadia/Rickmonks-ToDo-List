const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");

router.post("/", async (req, res) => {
  try {
    const { taskName } = req.body;
    if (!taskName) {
      return res.status(400).json({ message: "Task name is required" });
    }

    const newTodo = new Todo({ taskName });
    await newTodo.save();

    res.status(201).json(newTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create todo" });
  }
});

router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: "Server error while fetching todos" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { taskName, completed } = req.body;
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { taskName, completed },
      { new: true, runValidators: true }
    );

    if (!updatedTodo) return res.status(404).json({ error: "Todo not found" });
    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: "Server error while updating todo" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) return res.status(404).json({ error: "Todo not found" });

    res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error while deleting todo" });
  }
});

module.exports = router;
