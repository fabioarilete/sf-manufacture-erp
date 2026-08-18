import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/producRoutes";
import rawMaterialRoutes from "./routes/rawMaterialRoutes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productRoutes);
app.use("/api/raw-materials", rawMaterialRoutes);

app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    message: "SF-Manufacture-ERP Backend",
    timestamp: new Date().toISOString(),
  });
});

export default app;
