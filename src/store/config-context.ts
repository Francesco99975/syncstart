import { createContext } from "react";
import {
  BookmarkDir,
  Location,
  QuickLink,
  SearchEngine,
} from "../interfaces/types";
import { CurrentWeather } from "../interfaces/weather";

export interface SyncData {
  syncStartId: string;
  quickLinks: QuickLink[];
  bookmarkDirectories: BookmarkDir[];
  currentWeather: CurrentWeather;
  searchEngines: SearchEngine[];
}

export interface Context {
  syncStartId: string;
  quickLinks: QuickLink[];
  bookmarkDirectories: BookmarkDir[];
  backgroundImageLocalPath: string;
  clockFormat: boolean;
  unitFormat: boolean;
  isLoading: boolean;
  currentWeather: CurrentWeather | null;
  // searchEngines: SearchEngine[];
  // mainSearchEngine: string;
  createSyncStart: Function;
  fetchData: Function;
  addQuickLink: Function;
  removeQuickLink: Function;
  addBookmarkDirectory: Function;
  addBookmark: Function;
  removeBookmarkDirectory: Function;
  removeBookmark: Function;
  setLocation: Function;
  setWeather: Function;
  // addEngine: Function;
  // removeEngine: Function;
  // setMainEngine: Function;
  setBackgroundImage: Function;
  setClock: Function;
  setUnit: Function;
  setLoading: Function;
}

const ConfigContext = createContext<Context>({
  syncStartId: "",
  quickLinks: [],
  bookmarkDirectories: [],
  backgroundImageLocalPath: "",
  clockFormat: true,
  unitFormat: true,
  isLoading: false,
  currentWeather: null,
  // searchEngines: [],
  // mainSearchEngine: "",
  createSyncStart: async () => {},
  fetchData: async (syncStartId: string) => {},
  addQuickLink: async (link: string) => {},
  removeQuickLink: async (id: string) => {},
  addBookmarkDirectory: async (directoryName: string) => {},
  addBookmark: async (link: string, directoryId: string) => {},
  removeBookmarkDirectory: async (id: string) => {},
  removeBookmark: async (id: string, directoryId: string) => {},
  setLocation: async (locationData: Location) => {},
  setWeather: async () => {},
  // addEngine: (url: string) => {},
  // removeEngine: (id: string) => {},
  // setMainEngine: (id: string) => {},
  setBackgroundImage: (path: string) => {},
  setClock: (val: boolean) => {},
  setUnit: (val: boolean) => {},
  setLoading: () => {},
});

export default ConfigContext;
