import { NextFunction, Request, Response } from "express";
import { HttpException } from "../interfaces/error";

const checkId = (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.headers["x-user-id"] as string;
    if (id === "none" || !id || id === "") {
      throw new HttpException(401, "Unauthorized");
    }
    req.syncId = id;

    return next();
  } catch (error) {
    return next(error);
  }
};

export default checkId;
