import { PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import ReactLoading from "react-loading";

const Backload = (props: PropsWithChildren<any>) => {
  return (
    <div className="fixed top-0 left-0 w-full h-screen z-40  backdrop-blur-sm"></div>
  );
};

const LoadingOverlay = (props: PropsWithChildren<any>) => {
  return (
    <div className="fixed top-0 left-0 flex items-center justify-center w-full h-screen z-50">
      <ReactLoading
        type="bubbles"
        color="#0df2af"
        width="200px"
        height="200px"
      />
    </div>
  );
};

const Loading = (props: PropsWithChildren<any>) => {
  return (
    <>
      {createPortal(
        <Backload onClick={props.onClick} />,
        document.getElementById("backload") as HTMLElement
      )}
      {createPortal(
        <LoadingOverlay>{props.children}</LoadingOverlay>,
        document.getElementById("loading") as HTMLElement
      )}
    </>
  );
};

export default Loading;
