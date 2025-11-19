import { Request, Response } from "express";
import { Todo } from "../models/todo.js";
import { AuthRequest } from "../middleware/auth.middleware.js";

export const createTodo = async (req: AuthRequest, res: Response) => {
  try {
    const { title } = req.body;

    const todo = await Todo.create({
      title,
      userId: req.user.id
    });

    res.status(201).json(todo);
  } catch (error) {
    console.error("Create todo error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTodos = async (req: AuthRequest, res: Response) => {
  try {
    const todos = await Todo.find({ userId: req.user.id });
    res.json(todos);
  } catch (error) {
    console.error("Get todos error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTodo = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await Todo.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    console.error("Update todo error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTodo = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await Todo.findOneAndDelete({ _id: id, userId: req.user.id });

    res.json({ message: "Todo deleted" });
  } catch (error) {
    console.error("Delete todo error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
