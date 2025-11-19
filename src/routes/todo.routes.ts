import { Router } from "express";
import {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo
} from "../controllers/todo.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", auth, createTodo);  
router.get("/", auth, getTodos);
router.put("/:id", auth, updateTodo);
router.delete("/:id", auth, deleteTodo);

export default router;
