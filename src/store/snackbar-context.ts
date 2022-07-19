import { createContext } from "react";

export interface Snackbar {
  message: string;
  isDisplayed: boolean;
  messageStyle: string;
  displayMessage: Function;
  onClose: Function;
}

const SnackbarContext = createContext<Snackbar>({
  message: "",
  isDisplayed: false,
  messageStyle: "",
  onClose: () => {},
  displayMessage: (msg: string, style: string) => {},
});

export default SnackbarContext;
