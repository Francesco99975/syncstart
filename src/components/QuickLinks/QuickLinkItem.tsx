import React, { useContext, useState } from "react";
import useLongPress from "../../hooks/useLongPress";
import ConfigContext from "../../store/config-context";
import BackIcon from "../Icons/BackIcon";
import TrashIcon from "../Icons/TrashIcon";

interface LinkProps {
  id: string;
  icon: string;
  url: string;
  name: string;
  fallback: string;
}

const QuickLinkItem = (props: LinkProps) => {
  const [isRemoveVisible, setIsRemoveVisible] = useState(false);
  const [isRemovable, setIsRemovable] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { removeQuickLink } = useContext(ConfigContext);

  const removeVisibilityHandler = (value: boolean) => setIsRemoveVisible(value);

  const removeLinkHandler = () => {
    removeQuickLink(props.id);
  };

  const imageErrorHandler = () => {
    setImageError(true);
  };

  const onReturn = () => {
    setIsRemovable(false);
    setIsRemoveVisible(false);
  };

  const onLongPress = () => {
    setIsRemovable(true);
  };

  const onClick = () => {
    window.location.assign(props.url);
  };

  const defaultOptions = {
    shouldPreventDefault: true,
    delay: 1000,
  };
  const longPressEvent = useLongPress(onLongPress, onClick, defaultOptions);

  return (
    <li
      className="relative cursor-pointer"
      onMouseEnter={removeVisibilityHandler.bind(null, true)}
      onMouseLeave={removeVisibilityHandler.bind(null, false)}
    >
      {isRemoveVisible && !isRemovable && (
        <span
          onClick={removeLinkHandler}
          role="button"
          className="absolute top-0 right-0 w-6 h-6 rounded-full bg-red-600 text-white text-center cursor-pointer z-10 flex items-center justify-center"
        >
          <TrashIcon className="h-6 w-6" />
        </span>
      )}
      {!isRemovable && (
        <div className="m-2" {...longPressEvent}>
          <div className="flex flex-col justify-between items-center p-2 bg-slate-800 rounded h-20 w-16 md:h-24 md:w-24">
            {!imageError && (
              <img
                onError={imageErrorHandler}
                draggable="false"
                className="m-1"
                src={props.icon}
                alt={props.name}
                height="32px"
                width="32px"
              />
            )}
            {imageError && (
              <div className="p-2 rounded-full w-10 h-10 font-bold text-white text-center bg-slate-600">
                {props.fallback}
              </div>
            )}
            <span className="text-sm md:text-base md:p-1 text-center text-white max-w-full overflow-hidden whitespace-nowrap overflow-ellipsis">
              {props.name}
            </span>
          </div>
        </div>
      )}
      {isRemovable && (
        <li className="m-2 relative">
          <span
            onClick={onReturn}
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-blue-600 text-white text-center cursor-pointer z-10 flex items-center justify-center"
          >
            <BackIcon />
          </span>
          <div
            onClick={removeLinkHandler}
            className="flex items-center justify-center p-2 bg-red-600 rounded h-20 w-16 md:h-24 md:w-24"
          >
            <TrashIcon />
          </div>
        </li>
      )}
    </li>
  );
};

export default QuickLinkItem;
