import { Router } from "express";
import { addQuickLink, removeQuickLink } from "../controllers/quicklinks";
import checkId from "../middlewares/checkId";
import validateUrl from "../middlewares/validateUrl";

const router = Router();

router.post("/", checkId, validateUrl, addQuickLink);
router.delete("/:id", checkId, removeQuickLink);

export default router;
