import { Response, NextFunction } from "express";
import { Todo } from "../models/todo.js";
import { AuthRequest } from "../middleware/auth.middleware.js";

// Create new todo
// POST /api/todos
export const createTodo = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const todo = await Todo.create({
      title,
      userId: req.user.id,
      completed: false,
    });

    res.status(201).json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
};

//  Get all todos for logged in user
// GET /api/todos
export const getTodos = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const todos = await Todo.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, count: todos.length, data: todos });
  } catch (error) {
    next(error);
  }
};

// Update todo
// PUT /api/todos/:id
export const updateTodo = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const todo = await Todo.findOne({ _id: id, userId: req.user.id });
    if (!todo) {
      return res.status(404).json({ success: false, message: "Todo not found" });
    }

    const updated = await Todo.findByIdAndUpdate(id, req.body, { new: true });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// Delete todo
// DELETE /api/todos/:id
export const deleteTodo = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const todo = await Todo.findOne({ _id: id, userId: req.user.id });
    if (!todo) {
      return res.status(404).json({ success: false, message: "Todo not found" });
    }

    await Todo.findByIdAndDelete(id);

    res.json({ success: true, message: "Todo deleted" });
  } catch (error) {
    next(error);
  }
};

// Toggle todo completion
// PATCH /api/todos/:id/toggle
export const toggleTodo = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const todo = await Todo.findOne({ _id: id, userId: req.user.id });
    if (!todo) {
      return res.status(404).json({ success: false, message: "Todo not found" });
    }

    todo.completed = !todo.completed;
    await todo.save();

    res.json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
};
