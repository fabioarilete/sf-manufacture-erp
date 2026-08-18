import { Router } from "express";
import ProductOperationController from "../controllers/ProductOperationController";

const router = Router();

router.post("/", ProductOperationController.create);
router.get("/", ProductOperationController.findAll);
router.get("/product/:productId", ProductOperationController.findByProduct);
router.get(
  "/operation/:operationId",
  ProductOperationController.findByOperation,
);
router.put("/:id", ProductOperationController.update);
router.delete("/:id", ProductOperationController.delete);

export default router;
