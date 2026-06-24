const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// GET MY TASKS
router.get("/my", auth, async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user.id
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// CREATE TASK
router.post("/", auth, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description required"
      });
    }

    const task = await Task.create({
      title,
      description,
      user: req.user.id
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// UPDATE TASK
router.put("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    task.title = req.body.title || task.title;
    task.description =
      req.body.description || task.description;

    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// DELETE TASK
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    await task.deleteOne();

    res.json({
      message: "Task deleted"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// COMPLETE TASK
router.put("/:id/complete", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    task.completed = true;

    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;