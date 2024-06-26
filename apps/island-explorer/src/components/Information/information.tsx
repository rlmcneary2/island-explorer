import { FormattedMessage } from "react-intl";
import type { Landmark } from "../../types/types";
import useContextActions from "../../context/use-context-actions";
import { Message } from "../controls/message/message";
import { MessageDismissible } from "../controls/message/message-dismissible";
import { InformationLandmark } from "../InformationLandmark/information-landmark";
import { getLandmark } from "../../util/landmark";
import routes from "../../data/routes";
import landmarks from "../../data/landmarks";

export default function Information({ routeId }: Props) {
  const { selectLandmark } = useContextActions();

  const route = routes.find(r => r.id === routeId);
  if (!route) {
    return null;
  }

  const routeLandmarks = route.landmarks
    .map(id => getLandmark(id, landmarks))
    .reduce<Landmark[]>(
      (output, lmk) =>
        output.some(x => x.id === lmk.refId || x.id === lmk.id)
          ? output
          : [...output, lmk],
      []
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
  routeId: number;
};
