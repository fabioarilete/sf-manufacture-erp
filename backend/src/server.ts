import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/producRoutes";
import rawMaterialRoutes from "./routes/rawMaterialRoutes";
import productCompositionRoutes from "./routes/productCompositionRoutes";
import operationRoutes from "./routes/operationRoutes";
import productOperationRoutes from "./routes/productOperationRoutes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productRoutes);
app.use("/api/raw-materials", rawMaterialRoutes);
app.use("/api/product-compositions", productCompositionRoutes);
app.use("/api/operations", operationRoutes);
app.use("/api/product-operations", productOperationRoutes);

app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    message: "SF-Manufacture-ERP Backend",
    timestamp: new Date().toISOString(),
  });
});

export default app;
