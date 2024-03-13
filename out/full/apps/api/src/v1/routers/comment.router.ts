import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth-middleware';
import CommentController from '../controllers/comment.controller';

const commentRouter = Router();

commentRouter.get('/', CommentController.getNewest);
commentRouter.post('/', authMiddleware, CommentController.add);
commentRouter.put('/:comment_id', authMiddleware, CommentController.modify);
commentRouter.delete('/:comment_id', authMiddleware, CommentController.delete);
export default commentRouter;
