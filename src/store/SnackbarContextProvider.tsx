import { PropsWithChildren, useState } from "react";
import SnackbarContext from "./snackbar-context";

const SnackBarContextProvider = (props: PropsWithChildren<any>) => {
  const [message, setMessage] = useState("");
  const [isDisplayed, setIsDisplayed] = useState(false);
  const [messageStyle, setMessageStyle] = useState("");

  let timer: any;

  const displayHandler = (msg: string, style: string) => {
    setMessage(msg);
    setMessageStyle(style);
    setIsDisplayed(true);
    timer = setTimeout(() => {
      closeHandler();
    }, 3000); // close snackbar after 3 seconds
  };

  const closeHandler = () => {
    clearTimeout(timer);
    setIsDisplayed(false);
  };

  return (
    <SnackbarContext.Provider
      value={{
        message,
        isDisplayed,
        messageStyle,
        displayMessage: displayHandler,
        onClose: closeHandler,
      }}
    >
      {props.children}
    </SnackbarContext.Provider>
  );
};

export default SnackBarContextProvider;
