import { NextFunction, Request, Response } from "express";
import validator from "validator";
import { HttpException } from "../interfaces/error";

const validateUrl = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body.link.trim().startsWith("http://localhost:")) {
      if (
        !validator.isURL(req.body.link.trim(), {
          protocols: ["http", "https"],
        })
      )
        throw new HttpException(403, "URL not valid");
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

export default validateUrl;
