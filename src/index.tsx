import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import ConfigContextProvider from "./store/ConfigContextProvider";
import axios from "axios";
import SnackbarContextProvider from "./store/SnackbarContextProvider";

if (typeof window !== "undefined") {
  if (process.env.NODE_ENV === "development") {
    const root = ReactDOM.createRoot(
      document.getElementById("root") as HTMLElement
    );
    root.render(
      <React.StrictMode>
        <SnackbarContextProvider>
          <ConfigContextProvider>
            <App />
          </ConfigContextProvider>
        </SnackbarContextProvider>
      </React.StrictMode>
    );
  } else {
    ReactDOM.hydrateRoot(
      document.getElementById("root") as HTMLElement,
      <React.StrictMode>
        <SnackbarContextProvider>
          <ConfigContextProvider>
            <App />
          </ConfigContextProvider>
        </SnackbarContextProvider>
      </React.StrictMode>
    );
  }

  axios.interceptors.request.use((request) => {
    request.headers!["X-USER-ID"] =
      localStorage.getItem("SYNCSTART_ID") || "none";

    return request;
  });

  reportWebVitals();
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
