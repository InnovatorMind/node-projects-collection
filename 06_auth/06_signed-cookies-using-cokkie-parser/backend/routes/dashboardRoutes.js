import express from 'express';

import {
  getTodos,
  createTodo,
  toggleTodo,
  deleteTodo,
  getCurrentUser,
} from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/todos', getTodos);
router.post('/todos', createTodo);
router.patch('/todos/:id', toggleTodo);
router.delete('/todos/:id', deleteTodo);
router.get("/me", getCurrentUser);

export default router;