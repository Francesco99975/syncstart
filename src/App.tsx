import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import QuickLinks from "./components/QuickLinks/QuickLinks";
import ConfigContext from "./store/config-context";
import AuthPanel from "./components/AuthPanel/AuthPanel";
import Credits from "./components/UI/Credits";
import axios from "axios";
import { FastAverageColor } from "fast-average-color";
import Information from "./components/Information/Informations";
import SyncStartIdDisplay from "./components/UI/SyncStartIdDisplay";
import Brand from "./components/UI/Brand";
import SettingsIcon from "./components/Icons/SettingsIcon";
import Settings from "./components/Settings/Settings";
import db from "./database/db";
import Loading from "./components/UI/Loading";
import Snackbar from "./components/Snackbar/Snackbar";
import SnackbarContext from "./store/snackbar-context";

const generateRandomBackgroundColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

const getLuma = (hex: string) => {
  if (hex.indexOf("#") === 0) {
    hex = hex.slice(1);
  }

  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error("Invalid HEX color.");
  }
  let R = parseInt(hex.slice(0, 2), 16);
  let G = parseInt(hex.slice(2, 4), 16);
  let B = parseInt(hex.slice(4, 6), 16);
  let d = false;

  // Counting the perceptive luminance - human eye favors green color...
  const luminance = (0.299 * R + 0.587 * G + 0.114 * B) / 255;

  if (luminance > 0.5) d = false; // bright colors - black font: ;
  else d = true; // dark colors - white font: ;

  return d;
};

function App() {
  const bgColor = useMemo(() => generateRandomBackgroundColor(), []);

  const [photographer, setPhotographer] = useState<{
    name: string;
    link: string;
  }>({ name: "", link: "" });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { isDisplayed } = useContext(SnackbarContext);
  const {
    fetchData,
    syncStartId,
    setBackgroundImage,
    setClock,
    setUnit,
    backgroundImageLocalPath,
    isLoading,
  } = useContext(ConfigContext);

  const fastAverageColor = useMemo(() => new FastAverageColor(), []);

  const getBackground = useCallback(async () => {
    if (typeof window !== "undefined") {
      const backgroundData = await axios.get(
        `${
          process.env.NODE_ENV === "development" ? "http://localhost:5342" : ""
        }/background`
      );

      setPhotographer(() => {
        return {
          name: backgroundData.data.user.name,
          link: backgroundData.data.user.links.html,
        };
      });
      document.body.style.backgroundImage = `url(${backgroundData.data.urls.regular})`;

      const rgbAvg = await fastAverageColor.getColorAsync(
        backgroundData.data.urls.regular
      );

      const root = window.document.documentElement;

      root.classList.remove(rgbAvg.isDark ? "light" : "dark");
      root.classList.add(rgbAvg.isDark ? "dark" : "light");
    }
  }, [fastAverageColor]);

  const handleBackgroundColorContrast = useCallback(() => {
    if (typeof window !== "undefined") {
      document.body.style.backgroundColor = bgColor;
      const isDark = getLuma(bgColor);

      const root = window.document.documentElement;

      root.classList.remove(isDark ? "light" : "dark");
      root.classList.add(isDark ? "dark" : "light");
    }
  }, [bgColor]);

  useEffect(() => {
    const id = localStorage.getItem("SYNCSTART_ID");
    if (!id) {
      setIsOpenModal(true);
      return;
    }

    try {
      fetchData(id);
    } catch (error) {
      console.log(error);
    }
  }, [fetchData]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      db.transaction("rw", db.settings, async () => {
        const settings = await db.settings.get(1);
        const bg = settings?.background;
        setClock(settings?.clockFormat);
        setUnit(settings?.unit);
        try {
          if (
            !bg &&
            !document.body.style.backgroundImage.includes("unsplash")
          ) {
            getBackground();
          } else if (bg) {
            setBackgroundImage(bg);
            document.body.style.backgroundImage = `url(${bg})`;
            fastAverageColor
              .getColorAsync(bg?.toString() as string)
              .then((rgbAvg) => {
                const root = window.document.documentElement;

                root.classList.remove(rgbAvg.isDark ? "light" : "dark");
                root.classList.add(rgbAvg.isDark ? "dark" : "light");
              })
              .catch((err) => console.log(err));
          }
        } catch (error) {
          handleBackgroundColorContrast();
        }
      });
    }
  }, [
    getBackground,
    handleBackgroundColorContrast,
    fastAverageColor,
    setBackgroundImage,
    setClock,
    setUnit,
  ]);

  const closeModalHandler = () => {
    setIsOpenModal(false);
  };

  const settingsHandler = () => {
    setIsSettingsOpen((state) => !state);
  };

  const positionedElements = (
    <>
      <Brand />
      <div
        className="fixed bottom-0 right-0 m-2 cursor-pointer backdrop-blur-xl rounded p-2"
        onClick={settingsHandler}
      >
        <SettingsIcon />
      </div>
      {syncStartId && <SyncStartIdDisplay id={syncStartId} />}
      {!backgroundImageLocalPath && <Credits photographer={photographer} />}
      {isOpenModal && <AuthPanel onClose={closeModalHandler} />}
      {isSettingsOpen && <Settings onClose={settingsHandler} />}
      {isLoading && <Loading />}
      {isDisplayed && <Snackbar />}
    </>
  );

  return (
    <>
      {typeof window !== "undefined" && positionedElements}

      <Information />
      <QuickLinks />
    </>
  );
}

export default App;
