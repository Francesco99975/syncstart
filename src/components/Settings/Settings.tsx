import { FastAverageColor } from "fast-average-color";
import { PropsWithChildren, useContext, useMemo, useState } from "react";
import ConfigContext from "../../store/config-context";
import ImageIcon from "../Icons/ImageIcon";
import UploadIcon from "../Icons/UploadIcon";
import Modal from "../UI/Modal";

const Settings = (props: PropsWithChildren<any>) => {
  const [nav, setNav] = useState(0);
  const {
    setBackgroundImage,
    backgroundImageLocalPath,
    setClock,
    clockFormat,
    setUnit,
    unitFormat,
  } = useContext(ConfigContext);

  const fastAverageColor = useMemo(() => new FastAverageColor(), []);

  const navHandler = (val: number) => {
    setNav(val);
  };

  const backgroundDefaultHandler = () => {
    localStorage.removeItem("LOCAL_BG");
    setBackgroundImage("");
  };

  const backgroundChangeHandler = () => {
    var input = document.createElement("input") as HTMLInputElement;
    input.type = "file";
    input.accept = "image/*";

    input.onchange = (e: any) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const file = reader.result;
        setBackgroundImage(file);
        document.body.style.backgroundImage = `url(${file})`;
        fastAverageColor
          .getColorAsync(file?.toString() as string)
          .then((rgbAvg) => {
            const root = window.document.documentElement;

            root.classList.remove(rgbAvg.isDark ? "light" : "dark");
            root.classList.add(rgbAvg.isDark ? "dark" : "light");
          })
          .catch((err) => console.log(err));
      });
      reader.readAsDataURL(e.target.files[0]);
    };

    input.click();
  };

  const hourFormatHandler = (format: boolean) => {
    setClock(format);
  };

  const unitFormatHandler = (format: boolean) => {
    setUnit(format);
  };

  const backgroundSettings = (
    <div className="flex justify-around md:w-3/4">
      <button
        onClick={backgroundChangeHandler}
        className="flex flex-col gap-2 w-1/3 items-center justify-center"
      >
        <div className="w-full flex items-center justify-center">
          <UploadIcon
            className={
              backgroundImageLocalPath ? "text-yellow-500" : "text-white"
            }
          />
        </div>

        <div
          className={
            backgroundImageLocalPath ? "text-yellow-500" : "text-white"
          }
        >
          Use local background image
        </div>
      </button>

      <button
        onClick={backgroundDefaultHandler}
        className="flex flex-col gap-2 w-1/3 items-center justify-center"
      >
        <div className="w-full flex items-center justify-center">
          <ImageIcon
            className={
              !backgroundImageLocalPath ? "text-yellow-500" : "text-white"
            }
          />
        </div>

        <div
          className={
            !backgroundImageLocalPath ? "text-yellow-500" : "text-white"
          }
        >
          Use default random images
        </div>
      </button>
    </div>
  );

  const clockSettings = (
    <div className="flex flex-col justify-around w-full md:w-3/4">
      <div className="flex justify-around mb-2">
        <button
          onClick={hourFormatHandler.bind(null, true)}
          className="flex flex-col gap-2 w-1/3 items-center justify-center"
        >
          <div className={clockFormat ? "text-yellow-500" : "text-white"}>
            24 Hour Format
          </div>
        </button>

        <button
          onClick={hourFormatHandler.bind(null, false)}
          className="flex flex-col gap-2 w-1/3 items-center justify-center"
        >
          <div className={!clockFormat ? "text-yellow-500" : "text-white"}>
            12 Hour Format
          </div>
        </button>
      </div>

      <div className="flex justify-around">
        <button
          onClick={unitFormatHandler.bind(null, true)}
          className="flex flex-col gap-2 w-1/3 m-2 items-center justify-center"
        >
          <div className={unitFormat ? "text-yellow-500" : "text-white"}>
            Metric
          </div>
        </button>

        <button
          onClick={unitFormatHandler.bind(null, false)}
          className="flex flex-col gap-2 w-1/3 m-2 items-center justify-center"
        >
          <div className={!unitFormat ? "text-yellow-500" : "text-white"}>
            Imperial
          </div>
        </button>
      </div>
    </div>
  );
  return (
    <Modal onClick={props.onClose}>
      <div className="flex flex-col relative w-full">
        <span
          className="fixed m-2 p-2 top-0 right-0 font-bold text-slate-200 cursor-pointer"
          onClick={props.onClose}
        >
          X
        </span>
        <header className="text-lg text-white p-2 border-b-2 border-solid border-slate-200">
          Settings
        </header>

        <div className="flex flex-col md:flex-row items-center w-full mt-4">
          <nav className="flex flex-row justify-evenly md:justify-start items-center md:items-start md:flex-col w-full md:w-1/4 h-full m-2 md:m-0 md:border-r-2 border-solid border-slate-200">
            <span
              className={
                "border-b-2 border-solid md:border-none cursor-pointer p-2 m-2 " +
                (nav === 0
                  ? "text-yellow-500  border-yellow-500"
                  : "text-white border-slate-200")
              }
              onClick={navHandler.bind(null, 0)}
            >
              Background Image
            </span>
            <span
              className={
                "border-b-2 border-solid md:border-none cursor-pointer p-2 m-2 " +
                (nav !== 0
                  ? "text-yellow-500 border-yellow-500"
                  : "text-white border-slate-200")
              }
              onClick={navHandler.bind(null, 1)}
            >
              Clock and Units
            </span>
          </nav>
          {nav === 0 && backgroundSettings}
          {nav !== 0 && clockSettings}
        </div>
      </div>
    </Modal>
  );
};

export default Settings;
