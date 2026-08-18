import { Router } from "express";
import RawMaterialController from "../controllers/RawMaterialController";

const router = Router();

router.post("/", RawMaterialController.create);
router.get("/", RawMaterialController.findAll);
router.get(":id", RawMaterialController.findById);
router.put("/:id", RawMaterialController.update);
router.delete("/:id", RawMaterialController.delete);

export default router;
