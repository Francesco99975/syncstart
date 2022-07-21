import { Request, Response, NextFunction } from "express";
import { HttpException } from "../interfaces/error";
import SyncData from "../models/syncData";
import { Location } from "../interfaces/type";
import axios from "axios";

export const setLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const syncId = req.syncId;

    if (!syncId) {
      throw new HttpException(
        404,
        "Could not add link to non existing syncstart data"
      );
    }

    const syncData = (await SyncData.find({ syncStartId: syncId }))[0];

    const location: Location = req.body;

    syncData.location = location;

    await syncData.save();

    const weather = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?units=${"metric"}&lat=${
        syncData.location.lat
      }&lon=${syncData.location.lon}&appid=${process.env.OPEN_WEATHER_KEY}`
    );

    return res.status(200).json({ weather: weather.data });
  } catch (error) {
    next(error);
  }
};
