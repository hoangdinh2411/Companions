import { Router } from 'express';
import MessageController from '../controllers/message.controller';

const messageRouter = Router();

messageRouter.get('/:room_id', MessageController.getMessages);
export default messageRouter;
