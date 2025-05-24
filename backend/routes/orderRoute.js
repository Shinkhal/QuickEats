import express from "express"
import { placeOrder, verifyOrder ,verifiedOrder, getAllOrders, getUserOrders, updateStatus, listOrder,usersOrders } from "../controllers/orderController.js"
import authMiddleware from "../middleware/auth.js";
import adminMiddleware from "../middleware/adminAuth.js";

const orderRouter = express.Router();
orderRouter.post("/place",authMiddleware,placeOrder);
orderRouter.post("/verify",verifyOrder)
orderRouter.post("/verified",verifiedOrder)
orderRouter.post("/status",updateStatus)
orderRouter.post("/userorders",usersOrders)
orderRouter.get("/list",adminMiddleware, listOrder);
orderRouter.get('/allorders', adminMiddleware, getAllOrders);
orderRouter.get('/user/:userId', adminMiddleware, getUserOrders);
export default orderRouter;