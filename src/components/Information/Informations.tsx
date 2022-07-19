import { PropsWithChildren, useContext, useEffect, useState } from "react";
import ConfigContext from "../../store/config-context";
import CelsiusIcon from "../Icons/CelsiusIcon";
import FahrenheitIcon from "../Icons/FahrenheitIcon";
import HumidityIcon from "../Icons/HumidityIcon";
import MaxTempIcon from "../Icons/MaxTempIcon";
import MinTempIcon from "../Icons/MinTempIcon";
import RealFeelIcon from "../Icons/RealFeelIcon";
import SunriseIcon from "../Icons/SunriseIcon";
import SunsetIcon from "../Icons/SunsetIcon";
import TempIcon from "../Icons/TempIcon";
import Button from "../UI/Button";

const Information = (props: PropsWithChildren<any>) => {
  const [time, setTime] = useState(new Date());
  const { currentWeather, setLocation, clockFormat, unitFormat } =
    useContext(ConfigContext);
  let weatherDisplay;

  useEffect(() => {
    const clock = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(clock);
    };
  }, [time]);

  if (currentWeather !== null && currentWeather !== undefined) {
    const sunrise = new Date(0);
    sunrise.setUTCSeconds(currentWeather?.sys.sunrise!);
    const sunset = new Date(0);
    sunset.setUTCSeconds(currentWeather?.sys.sunset!);
    weatherDisplay = (
      <div className="flex w-3/4 text-slate-900 dark:text-slate-200 justify-between rounded">
        <div className="flex flex-col backdrop-blur-xl rounded text-center justify-center w-[40%] md:w-[25%]">
          <span>{currentWeather?.name}</span>
          <span>
            <TempIcon /> {Math.round(currentWeather?.main.temp!)}
            {unitFormat ? <CelsiusIcon /> : <FahrenheitIcon />}
          </span>
          <span>
            <RealFeelIcon /> {Math.round(currentWeather?.main.feels_like!)}
            {unitFormat ? <CelsiusIcon /> : <FahrenheitIcon />}
          </span>
          <span>
            <MinTempIcon /> {Math.round(currentWeather?.main.temp_min!)}
            {unitFormat ? <CelsiusIcon /> : <FahrenheitIcon />}
          </span>
          <span>
            <MaxTempIcon /> {Math.round(currentWeather?.main.temp_max!)}
            {unitFormat ? <CelsiusIcon /> : <FahrenheitIcon />}
          </span>
        </div>
        <div className="flex flex-col backdrop-blur-xl rounded text-center justify-center w-[40%] md:w-[25%]">
          <span>
            <HumidityIcon /> {currentWeather?.main.humidity}%
          </span>
          <span>
            <SunriseIcon />{" "}
            {(clockFormat
              ? sunrise.getHours()
              : sunrise.getHours() % 12 === 0
              ? "12"
              : sunrise.getHours() % 12
            )
              .toString()
              .padStart(2, "0")}
            :{sunrise.getMinutes().toString().padStart(2, "0")}{" "}
            {!clockFormat ? (sunrise.getHours() < 12 ? "AM" : "PM") : ""}
          </span>
          <span>
            <SunsetIcon />{" "}
            {(clockFormat
              ? sunset.getHours()
              : sunset.getHours() % 12 === 0
              ? "12"
              : sunset.getHours() % 12
            )
              .toString()
              .padStart(2, "0")}
            :{sunset.getMinutes().toString().padStart(2, "0")}{" "}
            {!clockFormat ? (sunset.getHours() < 12 ? "AM" : "PM") : ""}
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-2 mt-1 w-full text-center flex justify-center items-center">
        <h1 className="text-slate-900 dark:text-slate-200 text-5xl backdrop-blur-xl p-2 rounded">
          {(clockFormat
            ? time.getHours()
            : time.getHours() % 12 !== 0
            ? time.getHours() % 12
            : "12"
          )
            .toString()
            .padStart(2, "0")}{" "}
          : {time.getMinutes().toString().padStart(2, "0")}{" "}
          {!clockFormat ? (time.getHours() < 12 ? "AM" : "PM") : ""}
        </h1>
      </div>
      {currentWeather == null && (
        <Button onClick={setLocation} className="bg-slate-600 text-white w-1/3">
          Enable Weather
        </Button>
      )}
      {currentWeather != null && weatherDisplay}
    </>
  );
};

export default Information;
