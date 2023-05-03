import { FormattedMessage } from "react-intl";
import { Landmark } from "../types/types";
import type { ContextData } from "../context/types";
import useContextActions from "../context/use-context-actions";
import useContextState from "../context/use-context-state";
import { Message } from "./controls/message/message";
import { MessageDismissible } from "./controls/message/message-dismissible";
import { InformationLandmark } from "./information-landmark";
import { getLandmark } from "../util/landmark";

export default function Information({ routeId }: Props) {
  const { selectLandmark } = useContextActions();
  const { landmarks, routes } = useContextState(selector);

  if (
    routes?.status !== "idle" ||
    routes?.error ||
    landmarks?.status !== "idle" ||
    landmarks?.error
  ) {
    return null;
  }

  const route = routes.data?.find(r => r.id === routeId);
  if (!route) {
    return null;
  }

  const landmarksData = landmarks.data;
  const routeLandmarks = route.landmarks
    .map(id => getLandmark(id, landmarksData))
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

function selector(state: ContextData) {
  return { landmarks: state?.landmarks, routes: state?.routes };
}
