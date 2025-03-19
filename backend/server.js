import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoutes.js";
import 'dotenv/config';
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import { generateLeadData, fetchAndUpdateAllUserLeadScores } from "./controllers/LeadController.js";
// import paymentRoutes from "./routes/paymentRoutes.js";
// App configuration
const app = express();
const port = 3000; // Port is directly in the code

// Middleware
app.use(express.json());
app.use(cors());

// DB Connection
connectDB(); // MongoDB URL is handled in the db.js file, not in the .env file

// API Endpoints
app.use("/api/user", userRouter);
app.use("/api/food", foodRouter);
app.use("/images", express.static('uploads'));
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
// app.use(paymentRoutes);
app.get("/", (req, res) => {
    res.send("API WORKING");
});


app.post("/api/generate-lead", async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        await generateLeadData(userId);

        res.status(200).json({ success: true, message: "Lead data generated successfully" });
    } catch (error) {
        console.error("Error in lead generation:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

app.get("/api/leads", async (req, res) => {
    try {
        const leads = await fetchAndUpdateAllUserLeadScores();
        console.log("Fetched Leads:", leads); // Log database result
        res.status(200).json({ success: true, leads });
    } catch (error) {
        console.error("Error fetching lead scores:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
