import { Request, Response, NextFunction } from "express";
import { HttpException } from "../interfaces/error";
import SyncData from "../models/syncData";
import axios from "axios";

export const getWeatherData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const syncId = req.syncId;
    const metric = req.body.metric;

    if (!syncId) {
      throw new HttpException(
        404,
        "Could not add link to non existing syncstart data"
      );
    }

    const syncData = (await SyncData.find({ syncStartId: syncId }))[0];

    if (syncData.location.lat === 0 && syncData.location.lon === 0) {
      return res.status(404).json({ message: "No Weather Data" });
    }

    const weather = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?units=${
        metric ? "metric" : "imperial"
      }&lat=${syncData.location.lat}&lon=${syncData.location.lon}&appid=${
        process.env.OPEN_WEATHER_KEY
      }`
    );

    return res.status(200).json({ weather: weather.data });
  } catch (error) {
    next(error);
  }
};
