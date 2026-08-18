import { Router } from "express";
import OperationController from "../controllers/OperationController";

const router = Router();

router.post("/", OperationController.create);
router.get("/", OperationController.findAll);
router.get("/active", OperationController.findActive);
router.get("/:id", OperationController.findById);
router.put("/:id", OperationController.update);
router.delete("/:id", OperationController.delete);

export default router;
