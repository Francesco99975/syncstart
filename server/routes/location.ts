import { Router } from "express";
import checkId from "../middlewares/checkId";
import { setLocation } from "../controllers/location";

const router = Router();

router.post("/", checkId, setLocation);

export default router;
