import { PropsWithChildren } from "react";
import { createPortal } from "react-dom";

const BrandBuild = (props: PropsWithChildren<any>) => {
  return (
    <div className="rotate-90 font-bold text-5xl fixed top-36 -left-20 bg-transparent m-1 p-2 -z-10 text-slate-900 dark:text-slate-200 w-auto">
      SyncStart
    </div>
  );
};

const Brand = (props: PropsWithChildren<any>) => {
  return (
    <>
      {createPortal(
        <BrandBuild />,
        document.getElementById("brand") as HTMLElement
      )}
    </>
  );
};

export default Brand;
