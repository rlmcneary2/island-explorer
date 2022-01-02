import routesJson from "../assets/routes.json";
import { FormattedMessage } from "react-intl";
import useContextActions from "../context/use-context-actions";
import { Message } from "./controls/message/message";
import { MessageDismissible } from "./controls/message/message-dismissible";
import { InformationLandmark } from "./information-landmark";
import { getLandmark } from "../util/landmark";

const { routes } = routesJson;

export default function Information({ routeId }: Props) {
  const { selectLandmark } = useContextActions();

  const route = routes.find(r => r.id === routeId);
  if (!route) {
    return null;
  }

  const routeLandmarks = (route.landmarks as number[]).map(id =>
    getLandmark(id)
  );

  return (
    <section className="information">
      <h1>{route.displayName}</h1>
      {route.description && (
        <p className="description">
          <FormattedMessage id={route.description} />
        </p>
      )}
      {route.notices?.length
        ? route.notices.map(notice => (
            <MessageDismissible id={notice} key={notice} type="warning">
              <p>
                <FormattedMessage id={notice} />
              </p>
            </MessageDismissible>
          ))
        : null}
      {route.tips?.length
        ? route.tips.map(tip => (
            <Message key={tip} type="tip">
              <FormattedMessage id={tip} />
            </Message>
          ))
        : null}
      {routeLandmarks.length ? (
        <ul className="landmarks">
          {routeLandmarks.map(landmark => (
            <InformationLandmark
              key={landmark?.id}
              landmark={landmark}
              onClick={selectLandmark}
              routeId={routeId}
            />
          ))}
        </ul>
      ) : null}
    </section>
  );
}

type Props = {
  routeId?: number;
};
