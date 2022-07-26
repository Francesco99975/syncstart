import { Router } from "express";
import { getWeatherData } from "../controllers/weather";
import checkId from "../middlewares/checkId";

const router = Router();

router.post("/", checkId, getWeatherData);

export default router;
