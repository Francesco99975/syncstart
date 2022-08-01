import http from "http";
import path from "path";
import fs from "fs";
import express from "express";
import React from "react";
import ReactDOMServer from "react-dom/server";
import App from "../src/App";
import SnackbarContextProvider from "../src/store/SnackbarContextProvider";
import ConfigContextProvider from "../src/store/ConfigContextProvider";
import mongoose from "mongoose";
import dotenv from "dotenv";
//import cors from "cors";
import quickLinksRoutes from "./routes/quicklinks";
import bookmarksRoutes from "./routes/bookmarks";
import locationRoutes from "./routes/location";
import backgroundRoutes from "./routes/background";
import weatherRoutes from "./routes/weather";
import { HttpException } from "./interfaces/error";
import SyncData from "./models/syncData";
import { v4 as uuidv4 } from "uuid";

let result = dotenv.config();
if (result.error) console.log(result.error);

declare global {
  namespace Express {
    export interface Request {
      syncId?: string;
    }
  }
}

const app = express();

const PORT = process.env.PORT || 5500;

//app.use(cors());
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", express.static(path.join(__dirname, "static")));

const manifest = fs.readFileSync(
  path.join(__dirname, "static/manifest-webpack.json"),
  "utf-8"
);
const assets = JSON.parse(manifest);

app.get("/", (req, res, next) => {
  const component = ReactDOMServer.renderToString(
    React.createElement(React.StrictMode, {
      children: React.createElement(SnackbarContextProvider, {
        children: React.createElement(ConfigContextProvider, {
          children: React.createElement(App),
        }),
      }),
    })
  );
  res.render("index", { assets, component });
});

app.post("/create", async (req, res, next) => {
  try {
    const syncData = await new SyncData({
      syncStartId: uuidv4(),
      quickLinks: [],
      bookmarkDirectories: [],
      location: { lat: 0, lon: 0 },
      searchEngines: [],
    }).save();

    return res.status(201).json(syncData);
  } catch (error) {
    next(error);
  }
});
app.get("/fetch/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const syncData = (await SyncData.find({ syncStartId: id }))[0];

    if (!syncData) {
      throw new HttpException(404, "Data not found");
    }
    return res.status(200).json(syncData);
  } catch (error) {
    next(error);
  }
});

app.use("/weather", weatherRoutes);
app.use("/background", backgroundRoutes);
app.use("/quicklinks", quickLinksRoutes);
app.use("/bookmarks", bookmarksRoutes);
app.use("/location", locationRoutes);

app.use((req, res, next) => {
  return res.status(404).json({ message: "Not found" });
});

app.use(
  (
    error: HttpException,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.log(error);
    return res
      .status(error.code || 500)
      .json({ message: error.message || "An error occurred on the server" });
  }
);

const server = http.createServer(app);

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Listening on PORT: ${PORT}`);
    });
  })
  .catch(() => {
    console.log("Could not connect to DB");
  });
