import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth-middleware';
import DeliveryOrderController from '../controllers/delivery-orders.controller';

const deliveryOrderRouter = Router();

deliveryOrderRouter.post('/', authMiddleware, DeliveryOrderController.add);
deliveryOrderRouter.get('/', DeliveryOrderController.getAll);
deliveryOrderRouter.get('/search', DeliveryOrderController.search);
deliveryOrderRouter.get('/filter', DeliveryOrderController.filter);
deliveryOrderRouter.get('/:slug', DeliveryOrderController.getOneBySlug);
deliveryOrderRouter.get(
  '/id/:order_id',
  authMiddleware,
  DeliveryOrderController.getOneById
);
deliveryOrderRouter.put(
  '/:order_id',
  authMiddleware,
  DeliveryOrderController.modify
);
deliveryOrderRouter.patch(
  '/:order_id',
  authMiddleware,
  DeliveryOrderController.updateStatus
);
deliveryOrderRouter.patch(
  '/:order_id/take',
  authMiddleware,
  DeliveryOrderController.takeOrder
);
export default deliveryOrderRouter;
