import { FormEvent, useState, useRef, useContext } from "react";
import ConfigContext from "../../store/config-context";
import Button from "../UI/Button";
import Input from "../UI/Input";
import QuickLinkList from "./QuickLinkList";

const QuickLinks = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const enteredLink = useRef<HTMLInputElement>(null);
  const { quickLinks, addQuickLink } = useContext(ConfigContext);

  const toggleFormHandler = (value: boolean) => {
    setIsFormOpen(value);
  };

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
    if (enteredLink.current!.value.trim().length > 0) {
      addQuickLink(enteredLink.current!.value.trim());
    }
  };

  let form = (
    <div className="m-2">
      <Button
        className="border-2 border-slate-800 dark:border-slate-100 border-solid text-xl backdrop-blur-xl bg-transparent/10 text-slate-800 dark:text-slate-200"
        type="button"
        onClick={toggleFormHandler.bind(null, true)}
      >
        {quickLinks.length > 0 ? "+" : "Add your first quicklink!"}
      </Button>
    </div>
  );

  if (isFormOpen) {
    form = (
      <form className="m-2" onSubmit={submitHandler}>
        <Input ref={enteredLink} id="link" label="Add Quicklink" type="url" />
        <Button className="bg-slate-800 text-white" type="submit">
          Add New Quicklink
        </Button>
        <Button
          className="bg-red-600 text-white"
          type="button"
          onClick={toggleFormHandler.bind(null, false)}
        >
          Cancel
        </Button>
      </form>
    );
  }
  return (
    <div className="w-2/3 md:w-1/3">
      <QuickLinkList links={quickLinks} />
      {form}
    </div>
  );
};

export default QuickLinks;
