import { Router } from "express";
import checkId from "../middlewares/checkId";

const router = Router();

router.post("/", checkId);
router.put("/", checkId);
router.delete("/:id", checkId);
router.delete("/:directoryId/:id", checkId);

export default router;
