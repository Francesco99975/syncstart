import { PropsWithChildren } from "react";
import { createPortal } from "react-dom";

const Backdrop = (props: PropsWithChildren<any>) => {
  return (
    <div
      className="fixed top-0 left-0 w-full h-screen z-20 bg-black opacity-75"
      onClick={props.onClick}
    ></div>
  );
};

const ModalOverlay = (props: PropsWithChildren<any>) => {
  return (
    <div className="fixed top-[15vh] left-[5%] md:left-[calc(50%-20rem)] w-11/12 bg-slate-600 p-4 rounded-2xl shadow-md shadow-black z-30 md:w-[40rem] animate-slide">
      <div>{props.children}</div>
    </div>
  );
};

const Modal = (props: PropsWithChildren<any>) => {
  return (
    <>
      {createPortal(
        <Backdrop onClick={props.onClick} />,
        document.getElementById("backdrop") as HTMLElement
      )}
      {createPortal(
        <ModalOverlay>{props.children}</ModalOverlay>,
        document.getElementById("modal") as HTMLElement
      )}
    </>
  );
};

export default Modal;
