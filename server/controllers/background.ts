import { NextFunction, Request, Response } from "express";
import axios from "axios";
import { HttpException } from "../interfaces/error";

export const getBackground = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const backgroundData = await axios.get(
      "https://api.unsplash.com/photos/random",
      {
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (backgroundData.status >= 400) {
      throw new HttpException(
        backgroundData.status,
        "Could not retreive background"
      );
    }

    return res.status(200).json(backgroundData.data);
  } catch (error) {
    next(error);
  }
};
