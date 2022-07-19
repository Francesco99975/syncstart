import { Router } from "express";
import { getBackground } from "../controllers/background";

const router = Router();

router.get("/", getBackground);

export default router;
