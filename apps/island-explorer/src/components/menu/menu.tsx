import { useCallback, useEffect, useState } from "react";
import { Checkbox } from "../controls/checkbox/checkbox";
import useContextActions from "../../context/use-context-actions";
import useContextState from "../../context/use-context-state";
import { AnimatedModalDialog } from "modal";
import { ContextState } from "../../context/types";

export function Menu({ show }: Props) {
  const [hide, setHide] = useState(false);
  const [mount, setMount] = useState(false);
  const handleHidden = useCallback(() => setMount(false), []);
  const handleClose = useCallback(() => setHide(true), []);
  const { setOption } = useContextActions();
  const options = useContextState(selector);

  const showStops = options?.SHOW_STOPS
    ? options.SHOW_STOPS === "true"
      ? true
      : false
    : true;

  useEffect(() => {
    if (show) {
      setMount(true);
      setTimeout(() => setHide(false), 0);
    }
  }, [show]);

  function handleOptionChanged(name: string, value: string): void {
    setOption(name, value);
  }

  return mount ? (
    <AnimatedModalDialog
      className="modal menu"
      containerId="menu"
      hide={hide}
      onExternalTap={handleClose}
      onHidden={handleHidden}
    >
      <div className="content">
        <button className="icon" onClick={handleClose}>
          <i className="icon-dismiss" />
        </button>
        <Checkbox
          checked={showStops}
          id="OPTION_SHOW_STOPS"
          onChange={checked => handleOptionChanged("SHOW_STOPS", `${checked}`)}
        />
        {/* <button className="button plain" onClick={handleAboutClick}>
          <FormattedMessage id="ABOUT_APP" />
        </button> */}
      </div>
    </AnimatedModalDialog>
  ) : null;
}

interface Props {
  show: boolean;
}

function selector(state: ContextState) {
  return state?.options;
}
