import { Router } from "express";
import {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
  toggleTodo
} from "../controllers/todo.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", auth, createTodo);  
router.get("/", auth, getTodos);
router.put("/:id", auth, updateTodo);
router.delete("/:id", auth, deleteTodo);
router.patch("/:id/toggle", auth, toggleTodo);

export default router;
