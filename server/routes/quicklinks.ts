import { Router } from "express";
import { addQuickLink, removeQuickLink } from "../controllers/quicklinks";
import checkId from "../helpers/checkId";

const router = Router();

router.post("/", checkId, addQuickLink);
router.delete("/:id", checkId, removeQuickLink);

export default router;
