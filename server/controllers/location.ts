import { Request, Response, NextFunction } from "express";
import { HttpException } from "../interfaces/error";
import SyncData from "../models/syncData";
import { Location } from "../interfaces/type";

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

    res.redirect("/weather");
  } catch (error) {
    next(error);
  }
};
