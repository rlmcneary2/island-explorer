import { useCallback, useEffect, useState } from "react";
import { Checkbox } from "../controls/checkbox/checkbox";
import { ContextState, OptionKeys } from "../../context/types";
import useContextActions from "../../context/use-context-actions";
import useContextState from "../../context/use-context-state";
import { AnimatedModalDialog } from "modal";
import { stringToBoolean } from "../../util/type-coercion";
import { FormattedMessage } from "react-intl";

export function Menu({ show }: Props) {
  const [hide, setHide] = useState(false);
  const [mount, setMount] = useState(false);
  const handleHidden = useCallback(() => setMount(false), []);
  const handleClose = useCallback(() => setHide(true), []);
  const { setOption } = useContextActions();
  const options = useContextState(selector);

  const showPois = stringToBoolean(options?.SHOW_POIS, false);
  const showStops = stringToBoolean(options?.SHOW_STOPS, true);
  const showTrailheads = stringToBoolean(options?.SHOW_TRAILHEADS, false);

  useEffect(() => {
    if (show) {
      setMount(true);
      setTimeout(() => setHide(false), 0);
    }
  }, [show]);

  function handleOptionChanged(name: OptionKeys, value: string): void {
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
        <div className="menu-group">
          <h1>
            <FormattedMessage id="OPTIONS" />
          </h1>
          <Checkbox
            checked={showStops}
            id="OPTION_SHOW_STOPS"
            onChange={checked =>
              handleOptionChanged("SHOW_STOPS", `${checked}`)
            }
          />
          <Checkbox
            checked={showTrailheads}
            id="OPTION_SHOW_TRAILHEADS"
            onChange={checked =>
              handleOptionChanged("SHOW_TRAILHEADS", `${checked}`)
            }
          />
          <Checkbox
            checked={showPois}
            id="OPTION_SHOW_POIS"
            onChange={checked => handleOptionChanged("SHOW_POIS", `${checked}`)}
          />
        </div>
        <div>
          <h1>
            <FormattedMessage id="ABOUT_TITLE" />
          </h1>
          <p>
            <FormattedMessage
              id="ABOUT_MESSAGE"
              values={{
                link: <a href="mailto:rich@limnous.com">Rich McNeary</a>
              }}
            />
          </p>
          <p className="breaker">
            <FormattedMessage
              id="ABOUT_MESSAGE_2"
              values={{
                linkHome: (
                  <a href="https://islandexplorer.app/">
                    https://islandexplorer.app/
                  </a>
                )
              }}
            />
          </p>
          <p className="breaker">
            <FormattedMessage
              id="ABOUT_MESSAGE_3"
              values={{
                linkGithub: (
                  <a href="https://github.com/rlmcneary2/island-explorer">
                    https://github.com/rlmcneary2/island-explorer
                  </a>
                )
              }}
            />
          </p>
          <p>
            <FormattedMessage id="COPYRIGHT" />
          </p>
        </div>
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
