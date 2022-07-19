import { PropsWithChildren } from "react";
import { createPortal } from "react-dom";

const CreditsBuild = (props: PropsWithChildren<any>) => {
  return (
    <div className="fixed bottom-0 left-0 bg-transparent backdrop-blur-xl m-1 p-2 rounded z-30 text-slate-900 dark:text-slate-200 text-base w-auto">
      <span>Photo by </span>
      <a target="blank" href={props.photographer.link}>
        {props.photographer.name}
      </a>{" "}
      on{" "}
      <a target="blank" href="https://unsplash.com">
        Unsplash
      </a>
    </div>
  );
};

const Credits = (props: PropsWithChildren<any>) => {
  return (
    <>
      {createPortal(
        <CreditsBuild photographer={props.photographer} />,
        document.getElementById("credits") as HTMLElement
      )}
    </>
  );
};

export default Credits;
