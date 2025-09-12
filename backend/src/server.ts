import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import sourceRoutes from "./routes/sourceRoutes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/datapricing";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });


app.use("/api/sources", sourceRoutes);
app.get("/", (_req, res) => res.send("Backend running"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

