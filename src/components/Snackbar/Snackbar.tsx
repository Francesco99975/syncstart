import { useContext } from "react";
import SnackbarContext from "../../store/snackbar-context";

const Snackbar = () => {
  const { message, messageStyle, onClose } = useContext(SnackbarContext);
  return (
    <div className="fixed bottom-0 left-0 m-1 z-30 bg-slate-900 flex justify-between items-center w-9/12 md:w-2/5 p-2 text-center animate-slide2">
      <div className={messageStyle}>{message}</div>
      <div
        onClick={onClose as any}
        className="text-red-500 text-xl cursor-pointer"
      >
        &times;
      </div>
    </div>
  );
};

export default Snackbar;
