import express from "express"

import { addFood, listFood, removeFood } from "../controllers/foodController.js"
import adminMiddleware from "../middleware/adminAuth.js";
import authMiddleware from "../middleware/auth.js";
import multer from "multer"

const foodRouter = express.Router();
//Image Storage Engine

const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage})
foodRouter.post("/add",adminMiddleware, upload.single("image"),addFood)
foodRouter.get("/list", listFood)
foodRouter.post("/remove",adminMiddleware,removeFood);




export default foodRouter;