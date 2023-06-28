import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

export function Help() {
  return (
    <section className="help">
      <h1>
        <FormattedMessage id="HELP" />
      </h1>
      <div className="toc">
        <h2>
          <FormattedMessage id="TABLE_OF_CONTENTS" />
        </h2>
        <ul className="toc-list">
          <li>
            <Link to="#map">
              <FormattedMessage id="HLP_MAP_TAB" />
            </Link>
          </li>
          <li>
            <Link to="#information">
              <FormattedMessage id="HLP_INFORMATION_TAB" />
            </Link>
          </li>
          <li>
            <Link to="#explorer">
              <FormattedMessage id="HLP_ISLAND_EXPLORER" />
            </Link>
          </li>
        </ul>
      </div>
      <h2 className="chapter" id="map">
        <FormattedMessage id="HLP_MAP_TAB" />
      </h2>
      <p>
        <FormattedMessage id="HLP_MAP_TAB_DESCRIPTION" />
      </p>
      <h2 className="chapter" id="information">
        <FormattedMessage id="HLP_INFORMATION_TAB" />
      </h2>
      <p>
        <FormattedMessage id="HLP_INFORMATION_TAB_DESCRIPTION" />
      </p>
      <h2 className="chapter" id="explorer">
        <FormattedMessage id="HLP_ISLAND_EXPLORER" />
      </h2>
      <p>
        <FormattedMessage id="HLP_ISLAND_EXPLORER_DESCRIPTION" />
      </p>
      <div className="symbol-container">
        <i className="sym-tower" />
      </div>
    </section>
  );
}
