import {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { BookmarkDir, QuickLink, Bookmark } from "../interfaces/types";
import ConfigContext, { Context, SyncData } from "./config-context";
import axios from "axios";
import { CurrentWeather } from "../interfaces/weather";
import db from "../database/db";
import SnackbarContext from "./snackbar-context";

const BASE_URL =
  process.env.NODE_ENV === "development" ? "http://localhost:5500" : "";

const ConfigContextProvider = (props: PropsWithChildren<any>) => {
  const { displayMessage } = useContext(SnackbarContext);
  const [syncStartId, setSyncStartId] = useState<string>("");
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
  const [bookmarkDirectories, setBookmarkDirectories] = useState<BookmarkDir[]>(
    []
  );
  const [backgroundImageLocalPath, setBackgroundImageLocalPath] =
    useState<string>("");
  const [clockFormat, setClockFormat] = useState(true);
  const [unitFormat, setUnitFormat] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(
    null
  );
  // const [searchEngines, setSearchEngines] = useState<SearchEngine[]>([]);

  const setWeather = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.post<any>(`${BASE_URL}/weather`, {
        metric: unitFormat,
      });
      setCurrentWeather(response.data.weather);
    } catch (error: any) {
      console.log(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  }, [unitFormat]);

  useEffect(() => {
    if (syncStartId && syncStartId.length > 0) {
      setWeather();
    }
  }, [syncStartId, setWeather]);

  const createHandler = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post<{ syncStartId: string }>(
        `${BASE_URL}/create`
      );

      if (response.status >= 400) {
        throw new Error("Could not create unique id");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("SYNCSTART_ID", response.data.syncStartId);
      }
      setSyncStartId(response.data.syncStartId);
      displayMessage("SyncStart ID successfully created", "text-slate-200");
    } catch (error) {
      displayMessage("Could not create SyncStart ID", "text-red-500");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHandler = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      const response = await axios.get<SyncData>(`${BASE_URL}/fetch/${id}`);

      if (response.status >= 400) {
        throw new Error("Could not fetch data");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("SYNCSTART_ID", response.data.syncStartId);
      }
      setSyncStartId(response.data.syncStartId);
      setQuickLinks(response.data.quickLinks);
      setBookmarkDirectories(response.data.bookmarkDirectories);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addQuickLinkHandler = async (link: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post<QuickLink>(`${BASE_URL}/quicklinks`, {
        link,
      });

      if (response.status >= 400) {
        throw new Error("Could not add quicklink");
      }

      setQuickLinks((links) => {
        return [...links, response.data];
      });
      displayMessage("Added Quicklink", "text-slate-200");
    } catch (error: any) {
      displayMessage(error.message || "Error", "text-red-500");
    } finally {
      setIsLoading(false);
    }
  };

  const removeQuickLinkHandler = async (id: string) => {
    try {
      const response = await axios.delete<QuickLink>(
        `${BASE_URL}/quicklinks/${id}`
      );

      if (response.status >= 400) {
        throw new Error("Could not remove quicklink");
      }

      setQuickLinks((links) => {
        return links.filter((x) => x.id !== response.data.id);
      });
    } catch (error) {
      displayMessage("Could not remove quicklink", "text-red-500");
    }
  };

  const addBookmarkDirectoryHandler = async (link: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post<BookmarkDir>(`${BASE_URL}/bookmarks`, {
        link,
      });

      if (response.status >= 400) {
        throw new Error("Could not add bookmark directory");
      }

      setBookmarkDirectories((dirs) => {
        return [...dirs, response.data];
      });
    } catch (error: any) {
      displayMessage(error.message || "Error", "text-red-500");
    } finally {
      setIsLoading(false);
    }
  };

  const addBookmarkHandler = async (link: string, directoryId: string) => {
    try {
      setIsLoading(true);
      const response = await axios.put<Bookmark>(`${BASE_URL}/bookmarks`, {
        link,
        directoryId,
      });

      if (response.status >= 400) {
        throw new Error("Could not add bookmark");
      }

      setBookmarkDirectories((dirs) => {
        const updatedDirs = dirs;
        const index = updatedDirs.findIndex(
          (x) => x.id === response.data.directoryId
        );
        const updatedDir = updatedDirs[index];
        updatedDir.bookmarks = [...updatedDir.bookmarks, response.data];

        updatedDirs[index] = updatedDir;

        return updatedDirs;
      });
    } catch (error: any) {
      displayMessage(error.message || "Error", "text-red-500");
    } finally {
      setIsLoading(false);
    }
  };

  const removeBookmarkDirectoryHandler = async (id: string) => {
    try {
      const response = await axios.delete<BookmarkDir>(
        `${BASE_URL}/bookmarks/${id}`
      );

      if (response.status >= 400) {
        throw new Error("Could not remove bookmark directory");
      }

      setBookmarkDirectories((dirs) => {
        return dirs.filter((x) => x.id !== response.data.id);
      });
    } catch (error: any) {
      displayMessage(error.message || "Error", "text-red-500");
    }
  };

  const removeBookmarkHandler = async (id: string, directoryId: string) => {
    try {
      const response = await axios.delete<Bookmark>(
        `${BASE_URL}/bookmarks/${directoryId}/${id}`
      );

      if (response.status >= 400) {
        throw new Error("Could not add bookmark");
      }

      setBookmarkDirectories((dirs) => {
        const updatedDirs = dirs;
        const index = updatedDirs.findIndex(
          (x) => x.id === response.data.directoryId
        );
        const updatedDir = updatedDirs[index];
        updatedDir.bookmarks = updatedDir.bookmarks.filter(
          (x) => x.id !== response.data.id
        );

        updatedDirs[index] = updatedDir;

        return updatedDirs;
      });
    } catch (error: any) {
      displayMessage(error.message || "Error", "text-red-500");
    }
  };

  const setLocationHandler = async () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        setIsLoading(true);
        const response = await axios.post<any>(`${BASE_URL}/location/`, {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });

        setCurrentWeather(response.data.weather);
      } catch (error) {
        displayMessage(
          "Something went wrong while setting location",
          "text-red-500"
        );
      } finally {
        setIsLoading(false);
      }
    });
  };

  // const addEngineHandler = async (url: string) => {
  //   const response = await axios.post<SearchEngine>(`${BASE_URL}/engine/`, {
  //     url,
  //   });

  //   if (response.status >= 400) {      //   className="fixed top-[35vh] left-[25%] md:left-[calc(60%-15rem)] z-50 w-full"
  //     throw new Error("Could not add engine");
  //   }

  //   setSearchEngines((engines) => {
  //     return [...engines, response.data];
  //   });
  // };

  // const removeEngineHandler = async (id: string) => {
  //   const response = await axios.delete<SearchEngine>(
  //     `${BASE_URL}/engine/${id}`
  //   );

  //   if (response.status >= 400) {
  //     throw new Error("Could not remove engine");
  //   }

  //   setSearchEngines((engines) => {
  //     return engines.filter((x) => x.id !== response.data.id);
  //   });
  // };

  // const setMainEngineHandler = async (id: string) => {
  //   const response = await axios.put<SearchEngine[]>(
  //     `${BASE_URL}/engine/${id}`
  //   );

  //   if (response.status >= 400) {
  //     throw new Error("Could not set main engine");
  //   }

  //   setSearchEngines((engines) => {
  //     const updatedEngines = engines;
  //     const index = updatedEngines.findIndex(
  //       (x) => x.id === response.data[0].id
  //     );
  //     const oldIndex = updatedEngines.findIndex(
  //       (x) => x.id === response.data[1].id
  //     );
  //     updatedEngines[oldIndex].isMain = false;
  //     updatedEngines[index].isMain = true;

  //     return updatedEngines;
  //   });
  // };

  const setBackgroundLocalImageHandler = useCallback((path: string) => {
    db.transaction("rw", db.settings, async () => {
      return await db.settings.update(1, { background: path });
    });
    setBackgroundImageLocalPath(path);
  }, []);

  const setClockFormatHandler = useCallback((val: boolean) => {
    db.transaction("rw", db.settings, async () => {
      return await db.settings.update(1, { clockFormat: val });
    });
    setClockFormat(val);
  }, []);

  const setUnitFormatHandler = useCallback((val: boolean) => {
    db.transaction("rw", db.settings, async () => {
      return await db.settings.update(1, { unit: val });
    });
    setUnitFormat(val);
  }, []);

  const setIsLoadingHandler = useCallback((val: boolean) => {
    setIsLoading(val);
  }, []);

  const context: Context = {
    syncStartId,
    quickLinks,
    bookmarkDirectories,
    backgroundImageLocalPath,
    clockFormat,
    unitFormat,
    isLoading,
    currentWeather,
    // searchEngines,
    // mainSearchEngine:
    //   searchEngines.length > 0 ? searchEngines.find((x) => x.isMain)!.id : "",
    createSyncStart: createHandler,
    fetchData: fetchHandler,
    addQuickLink: addQuickLinkHandler,
    removeQuickLink: removeQuickLinkHandler,
    addBookmarkDirectory: addBookmarkDirectoryHandler,
    addBookmark: addBookmarkHandler,
    removeBookmarkDirectory: removeBookmarkDirectoryHandler,
    removeBookmark: removeBookmarkHandler,
    setLocation: setLocationHandler,
    setWeather: setWeather,
    // addEngine: addEngineHandler,
    // removeEngine: removeEngineHandler,
    // setMainEngine: setMainEngineHandler,
    setBackgroundImage: setBackgroundLocalImageHandler,
    setClock: setClockFormatHandler,
    setUnit: setUnitFormatHandler,
    setLoading: setIsLoadingHandler,
  };

  return (
    <ConfigContext.Provider value={context}>
      {props.children}
    </ConfigContext.Provider>
  );
};

export default ConfigContextProvider;
