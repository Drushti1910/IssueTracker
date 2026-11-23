import { Router } from 'express';
import { issueController } from '../controllers/issueController.js';

export const issueRoutes = Router();

issueRoutes.get('/', issueController.getAll);
issueRoutes.get('/:id', issueController.getById);
issueRoutes.post('/', issueController.create);
issueRoutes.patch('/:id', issueController.update);
issueRoutes.put('/:id', issueController.update);
