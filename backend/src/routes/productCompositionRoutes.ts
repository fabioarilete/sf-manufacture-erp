import { Router } from "express";
import ProductCompositionController from "../controllers/ProductCompositionController";

const router = Router();

router.post("/", ProductCompositionController.create);
router.get("/", ProductCompositionController.findAll);
router.get(":id", ProductCompositionController.findByProduct);
router.delete("/:id", ProductCompositionController.delete);

export default router;
