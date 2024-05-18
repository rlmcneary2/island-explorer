import { BusRouteView, type BusRouteViewProps } from "./bus-route-view";

export function BusRoute({ routeView }: BusRouteViewProps) {
  setCanonical();
  return <BusRouteView routeView={routeView} />;
}

function getHeadTag<T extends HTMLElement>(selector: string): T {
  return document.head.querySelector(selector) as T;
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
