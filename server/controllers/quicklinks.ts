import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import validator from "validator";
import fetch from "node-fetch";
import { parse } from "node-html-parser";
import { HttpException } from "../interfaces/error";
import SyncData from "../models/syncData";

const capitalize = (str: string) => {
  const index = str.indexOf("@");
  return index < 0
    ? str[0].toUpperCase() + str.substring(1)
    : str[0].toUpperCase() +
        str.substring(1, index + 1) +
        str[index + 1].toUpperCase() +
        str.substring(index + 2);
};

const parseTitle = (body: string) => {
  let match = body.match(/<title>([^<]*)<\/title>/); // regular expression to parse contents of the <title> tag
  if (!match || typeof match[1] !== "string")
    throw new Error("Unable to parse the title tag");
  return match[1];
};

// const removeTrailingSlash = (str: string) => {
//   if (str[str.length - 1] === "/") {
//     return str.split("").slice(0, -1).join("");
//   }

//   return str;
// };

const getNameFromUrl = (url: string) => {
  let name = url.substring(url.indexOf("://") + 3, url.lastIndexOf("."));

  if (name.includes("www")) return name.substring(name.indexOf(".") + 1);

  if (name.includes(".")) name = name.replace(".", "@");

  return name;
};

const getBaseUrl = (url: string) => {
  const CHAR_RESTORE = url.startsWith("https") ? 8 : 7;
  const index = url.substring(url.indexOf("://") + 3).indexOf("/");
  if (index < 0) return url;
  return url.substring(0, index + CHAR_RESTORE);
};

export const addQuickLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let link: string = req.body.link.trim();
    if (!link.startsWith("http")) {
      link = "http://" + link;
    }
    const syncId = req.syncId;

    if (!syncId) {
      throw new HttpException(
        404,
        "Could not add link to non existing syncstart data"
      );
    }

    const syncData = (await SyncData.find({ syncStartId: syncId }))[0];
    let title: string;
    let iconPath: string;
    try {
      const fetchResponse = await fetch(link);
      const body = await fetchResponse.text();

      title =
        link.includes("://localhost") ||
        link.includes("://192") ||
        link.includes("://127")
          ? parseTitle(body)
          : getNameFromUrl(link);
      iconPath = getBaseUrl(link) + "/favicon.ico";

      const root = parse(body);
      const elementArray = root
        .getElementsByTagName("link")
        .filter((x) => x.hasAttribute("rel") && x.hasAttribute("href"))
        .filter((x) => x.getAttribute("rel") === "icon");

      if (elementArray.length > 0) {
        iconPath = elementArray[0].getAttribute("href") as string;
        if (!validator.isURL(iconPath)) {
          iconPath = getBaseUrl(link) + iconPath;
        }
      }
    } catch (error) {
      title = getNameFromUrl(link);
      iconPath = getBaseUrl(link) + "/favicon.ico";
    }

    const newQuickLink = {
      id: uuidv4(),
      name: capitalize(title),
      url: link,
      icon: iconPath,
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
