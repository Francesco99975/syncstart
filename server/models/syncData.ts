import { Schema, model } from "mongoose";
import { SyncData } from "../interfaces/type";

const syncDataSchema = new Schema<SyncData>(
  {
    syncStartId: {
      type: String,
      required: true,
    },
    quickLinks: [],
    bookmarkDirectories: [],
    location: {
      type: Object,
      default: { lat: 0, lon: 0 },
    },
    searchEngines: [],
  },
  { timestamps: true }
);

export default model("SyncData", syncDataSchema);
