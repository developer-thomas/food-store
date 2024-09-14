import { request, Router } from "express";
const router = Router();
import asyncHandler from "express-async-handler";
import auth from "../middlewares/auth.mid";
import { HTTP_BAD_REQUEST } from "../utils/http-status";
import { OrderModel } from "../models/order.model";
import { OrderStatus } from "../utils/order-status";

router.use(auth);

router.post(
  "/create",
  asyncHandler(async (req: any, res: any) => {
    const requestOrder = req.body;

    if (requestOrder.item.length <= 0) {
      res.status(HTTP_BAD_REQUEST).send("Cart is Empty!");
      return;
    }

    await OrderModel.deleteOne({
      // acho q n vai dar erro, precisa pegar do body
      user: req.user.id,
      status: OrderStatus.NEW,
    });

    const newOrder = new OrderModel({ ...requestOrder, user: req.user.id });
    await newOrder.save();
    res.send(newOrder);
  })
);

export default router;
