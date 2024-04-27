import { useEffect } from "react";
import { useParams } from "react-router-dom";
import type { ContextData } from "../../context/types";
import useContextActions from "../../context/use-context-actions";
import useContextState from "../../context/use-context-state";
import { BusRouteView, type BusRouteViewProps } from "./bus-route-view";

export function BusRoute({ routeView }: BusRouteViewProps) {
  // The `paramRouteId` from the URL params is passed to context to fetch data
  // from remote services and is used for application routing.
  const { routeId: paramRouteId } = useParams() as Record<string, string>;

  // To keep route information in state synchronized the `routeId` from state is
  // passed as a prop to child components that will use it to get the data they
  // need from state. Note that `paramRouteId` and `routeId` will not always
  // match!
  const { routeId } = useContextState(selector);

  const { setRoute } = useContextActions();

  useEffect(() => {
    if (!paramRouteId || routeId === +paramRouteId) {
      return;
    }

    setRoute(+paramRouteId);
  }, [paramRouteId, routeId, setRoute]);

  setCanonical();

  return <BusRouteView routeView={routeView} />;
}

function getHeadTag<T extends HTMLElement>(selector: string): T {
  return document.head.querySelector(selector) as T;
}

function selector({ routeId, routes }: ContextData) {
  return { routeId, routes };
}

/**
 * Google doesn't believe that the data presented by /map and /information are
 * different so it is not indexing each of those for a route. One way to change
 * that (possibly) is to set a link in the header with `rel` = "canonical". This
 * function updates a link tag based on the current location.
 *
 * See: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics?hl=en#properly-inject-canonical-links
 */
function setCanonical() {
  const link = getHeadTag<HTMLLinkElement>("#canon");
  if (link) {
    if (link.href === window.location.href) {
      return;
    }

    link.remove();
  }

  const url = new URL(window.location.href);
  url.hostname = url.hostname.startsWith("www.")
    ? url.hostname
    : `www.${url.hostname}`;

  const nextLink = document.createElement("link");
  nextLink.id = "canon";
  nextLink.href = url.toString();
  nextLink.setAttribute("rel", "canonical");
  document.head.appendChild(nextLink);
}
