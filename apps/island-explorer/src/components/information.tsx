import { routes } from "../assets/routes.json";
import { landmarks } from "../assets/landmarks.json";
import { FormattedMessage } from "react-intl";
import useContextActions from "../context/use-context-actions";
import { Message } from "./controls/message/message";
import { MessageDismissible } from "./controls/message/message-dismissible";
import { InformationLandmark } from "./information-landmark";

export default function Information({ routeId }: Props) {
  const { selectStop } = useContextActions();

  const route = routes.find(r => r.id === routeId);
  if (!route) {
    return null;
  }

  const routeLandmarks = (route.landmarks as number[]).map(id =>
    landmarks.find(lmk => lmk.id === id)
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
              onClick={selectStop}
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
