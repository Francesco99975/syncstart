import { PropsWithChildren, useContext } from "react";
import { createPortal } from "react-dom";
import SnackbarContext from "../../store/snackbar-context";

const SyncStartIdDisplayBuild = (props: PropsWithChildren<any>) => {
  const { displayMessage } = useContext(SnackbarContext);
  const copyToClipboardHandler = async () => {
    await navigator.clipboard.writeText(props.id);
    displayMessage("ID copied to clipboard!", "text-slate-200");
  };
  return (
    <div
      onClick={copyToClipboardHandler}
      className="rotate-90 cursor-pointer fixed bottom-64 -right-36 bg-transparent backdrop-blur-2xl rounded-xl m-1 p-2 z-29 text-slate-900 dark:text-slate-200 text-base w-auto"
    >
      <span>{props.id}</span>
    </div>
  );
};

const SyncStartIdDisplay = (props: PropsWithChildren<any>) => {
  return (
    <>
      {createPortal(
        <SyncStartIdDisplayBuild id={props.id} />,
        document.getElementById("sync") as HTMLElement
      )}
    </>
  );
};

export default SyncStartIdDisplay;
