import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import fetch from "node-fetch";
import { HttpException } from "../interfaces/error";
import SyncData from "../models/syncData";

const capitalize = (str: string) => {
  return str[0].toUpperCase() + str.substring(1);
};

const parseTitle = (body: string) => {
  let match = body.match(/<title>([^<]*)<\/title>/); // regular expression to parse contents of the <title> tag
  if (!match || typeof match[1] !== "string")
    throw new Error("Unable to parse the title tag");
  return match[1];
};

const removeTrailingSlash = (str: string) => {
  if (str[str.length - 1] === "/") {
    return str.split("").slice(0, -1).join("");
  }

  return str;
};

export const addQuickLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const link: string = removeTrailingSlash(req.body.link.trim());
    const syncId = req.syncId;

    if (!syncId) {
      throw new HttpException(
        404,
        "Could not add link to non existing syncstart data"
      );
    }

    const syncData = (await SyncData.find({ syncStartId: syncId }))[0];

    const fetchResponse = await fetch(link);
    const body = await fetchResponse.text();
    const title = parseTitle(body);

    const newQuickLink = {
      id: uuidv4(),
      name: capitalize(title),
      url: link,
      icon: link + "/favicon.ico",
      arbitraryPositioning: syncData.quickLinks.length,
    };

    syncData.quickLinks.push(newQuickLink);

    await syncData.save();

    return res.status(200).json(newQuickLink);
  } catch (error) {
    next(error);
  }
};

export const removeQuickLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id: string = req.params.id;
    const syncId = req.syncId;

    if (!syncId) {
      throw new HttpException(
        404,
        "Could not remove link to non existing syncstart data"
      );
    }

    if (!id) {
      throw new HttpException(404, "Could find link to delete");
    }

    const syncData = (await SyncData.find({ syncStartId: syncId }))[0];

    const index = syncData.quickLinks.findIndex((x) => x.id === id);
    if (index < 0)
      throw new HttpException(404, "Could not find link to remove");
    const deletedQuickLink = syncData.quickLinks.splice(index, 1)[0];

    await syncData.save();

    return res.status(201).json(deletedQuickLink);
  } catch (error) {
    next(error);
  }
};
