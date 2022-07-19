import { FormEvent, useContext, useRef, useState } from "react";
import Modal from "../UI/Modal";
import Input from "../UI/Input";
import ConfigContext from "../../store/config-context";

const AuthPanel = (props: { onClose: Function }) => {
  const [hasId, setHasId] = useState(false);
  const enteredId = useRef<HTMLInputElement>(null);
  const { createSyncStart, fetchData } = useContext(ConfigContext);

  const switchFormHandler = () => {
    setHasId((state) => !state);
  };

  const createHandler = async () => {
    await createSyncStart();
    props.onClose();
  };

  const fetchHandler = async (event: FormEvent) => {
    event.preventDefault();
    const id = enteredId.current!.value.trim();
    if (id.length > 0) {
      await fetchData(id);
    }
    props.onClose();
  };
  return (
    <Modal>
      <form onSubmit={fetchHandler} className="">
        {!hasId && (
          <div className="flex justify-between items-center text-center text-white font-bold">
            Create a new SyncStart ID
          </div>
        )}

        {hasId && (
          <Input
            ref={enteredId}
            id="id"
            label="Insert your existing StartSync ID"
            type="text"
            className="text-white"
            key="0"
          />
        )}

        <div className="flex flex-col text-center">
          {!hasId && (
            <button
              type="button"
              className="p-2 bg-transparent border-2 border-white text-white border-solid"
              onClick={createHandler}
            >
              Create
            </button>
          )}
          {hasId && (
            <button
              type="submit"
              className="p-2 border-2 border-zinc-200 text-white bg-transparent border-solid"
            >
              Authenticate
            </button>
          )}
          <button
            type="button"
            onClick={switchFormHandler}
            className="border-none bg-transparent text-center text-white mt-2"
          >
            {!hasId
              ? "I already have a SyncStart ID"
              : "I don't have a SyncStart ID"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AuthPanel;
