import { useEffect } from "react";
import { useParams } from "react-router-dom";
import type { IntlShape } from "react-intl";
import { useIntl } from "react-intl";
import type { ContextData } from "../../context/types";
import useContextActions from "../../context/use-context-actions";
import useContextState from "../../context/use-context-state";
import { BusRouteView } from "./bus-route-view";

export function BusRoute() {
  // The `paramRouteId` from the URL params is passed to context to fetch data
  // from remote services and is used for application routing.
  const { routeId: paramRouteId } = useParams() as Record<string, string>;
  const { formatMessage } = useIntl();

  // To keep route information in state synchronized the `routeId` from state is
  // passed as a prop to child components that will use it to get the data they
  // need from state. Note that `paramRouteId` and `routeId` will not always
  // match!
  const { routeId, routes } = useContextState(selector);

  const { setRoute } = useContextActions();

  useEffect(() => {
    if (!paramRouteId || routeId === +paramRouteId) {
      return;
    }

    setRoute(+paramRouteId);
  }, [paramRouteId, routeId, setRoute]);

  setCanonical();
  // setOpenGraph(routeId, routes, formatMessage);

  return <BusRouteView />;
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

  const nextLink = document.createElement("link");
  nextLink.id = "canon";
  nextLink.href = window.location.href;
  nextLink.setAttribute("rel", "canonical");
  document.head.appendChild(nextLink);
}

// Set `<meta>` open graph tags that will allow previews to be generated from a
// link to an Island Explorer route.
function setOpenGraph(
  routeId: ContextData["routeId"],
  routes: ContextData["routes"],
  formatter: IntlShape["formatMessage"]
) {
  const route = routes?.data?.find(r => r.id === routeId);
  if (!route) {
    return;
  }

  updateOpenGraphTag("description", formatter({ id: route.description }));
  updateOpenGraphTag(
    "image",
    "https://www.islandexplorer.app/assets/opengraph-image.png"
  );
  updateOpenGraphTag(
    "image:alt",
    "A map of Island Explorer routes displayed in the Acadia's Island Explorer app."
  );
  updateOpenGraphTag("image:height", "1080");
  updateOpenGraphTag("image:width", "1080");
  updateOpenGraphTag("site_name", "Acadia's Island Explorer");
  updateOpenGraphTag("title", `Island Explorer - ${route.displayName}`);
  updateOpenGraphTag("type", "website");
  updateOpenGraphTag("url", window.location.href);
}

function updateOpenGraphTag(property: string, content: string) {
  const id = `og-${property.replace(":", "-")}`;
  const meta = getHeadTag<HTMLMetaElement>(`#${id}`);
  const attr = meta?.getAttribute("content");
  if (attr === content) {
    return;
  }

  console.log(`updateOpenGraphTag: attr=`, attr);

  meta?.remove();

  const nextMeta = document.createElement("meta") as HTMLMetaElement;
  nextMeta.id = id;
  nextMeta.setAttribute("property", `og:${property}`);
  nextMeta.setAttribute("content", content);
  document.head.appendChild(nextMeta);
}
