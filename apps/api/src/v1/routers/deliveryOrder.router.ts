import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth-middleware';
import DeliveryOrderController from '../controllers/delivery-orders.controller';

const deliveryOrderRouter = Router();

deliveryOrderRouter.post('/', authMiddleware, DeliveryOrderController.add);
deliveryOrderRouter.get('/', DeliveryOrderController.getAll);
deliveryOrderRouter.get('/search', DeliveryOrderController.search);
deliveryOrderRouter.get('/filter', DeliveryOrderController.filter);
deliveryOrderRouter.get('/:slug', DeliveryOrderController.getOneBySlug);
export default deliveryOrderRouter;
