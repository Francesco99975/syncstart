import { PropsWithChildren } from "react";

const InfoBox = (props: PropsWithChildren<any>) => {
  return (
    <div className="absolute bottom-0 z-20 rounded bg-slate-900 text-slate-200 p-2 text-sm">
      {props.content}
    </div>
  );
};

export default InfoBox;
