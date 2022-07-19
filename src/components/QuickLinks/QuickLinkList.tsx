import { QuickLink } from "../../interfaces/types";
import QuickLinkItem from "./QuickLinkItem";

interface QlProps {
  links: QuickLink[];
}

// const capitalize = (str: string) => {
//   return str.at(0)?.toUpperCase() + str.substring(1);
// };

const getWebsiteStartChar = (str: string) => {
  str = str.substring(str.indexOf("/") + 2);

  let sub = str;

  if (sub.includes("/")) {
    sub = str.substring(0, sub.indexOf("/"));
  }

  let reversed = sub.split("").reverse().join("");
  let sliced = reversed.slice(reversed.indexOf(".") + 1);
  return sliced.includes(".")
    ? sliced[sliced.indexOf(".") - 1].toLocaleUpperCase()
    : sliced[sliced.length - 1].toUpperCase();
};

const QuickLinkList = (props: QlProps) => {
  return (
    <ul className="flex flex-wrap p-2 w-full justify-around max-h-[45vh] overflow-scroll overflow-x-hidden no-scrollbar">
      {props.links.map((link) => {
        return (
          <QuickLinkItem
            key={link.id}
            id={link.id}
            url={link.url}
            icon={link.icon}
            name={link.name}
            fallback={getWebsiteStartChar(link.url)}
          />
        );
      })}
    </ul>
  );
};

export default QuickLinkList;
