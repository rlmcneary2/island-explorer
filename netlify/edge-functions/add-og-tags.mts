import type { Context } from "@netlify/edge-functions";

const replacementTag = "<!--{{OG_BLOCK}}-->";

export default async (req: Request, ctx: Context) => {
  const url = new URL(req.url); // https://www.islandexplorer.app/route/3/map
  const parts = url.pathname.split("/"); // ["https://www.islandexplorer.app", "route", "3", "map"]

  let routeId: number | undefined;
  let routeUrl: string | undefined;
  if (parts.length < 3) {
    routeId = 3;
    routeUrl = `${url.protocol}//${url.host}/route/${routeId}/map`;
  } else {
    routeId = +parts[2];
    routeUrl = req.url;
  }

  console.log(
    `---\n - url='${req.url}'\n - parts.length='${parts.length}'\n - routeId='${routeId}'`
  );

  const route = routes.find(
    route => route.id === routeId
  ) as (typeof routes)[0] & { url: string };

  if (!route) {
    return;
  }

  route.url = routeUrl;

  const res = (await ctx.next()) as Response;
  const html = await res.text();

  if (!html.includes(replacementTag)) {
    return new Response(html, res);
  }

  console.log(`--- route url='${route.url}'`);

  // Deno (and Node) have terrible support for parsing, manipulating, and
  // serializing HTML documents. So we're just going to insert strings for the
  // meta tags.

  // Add OG tags.
  return new Response(setOpenGraph(html, route), res);
};

// Set `<meta>` open graph tags that will allow previews to be generated from a
// link to an Island Explorer route.
function setOpenGraph(
  html: string,
  route: {
    description: string;
    displayName: string;
    url: string;
  }
): string {
  return html.replace(
    replacementTag,
    createMetaTag("description", route.description) +
      createMetaTag("title", `Island Explorer - ${route.displayName}`) +
      createMetaTag("url", route.url)
  );
}

function createMetaTag(property: string, content: string): string {
  return `<meta content="${content}" id="og-${property.replace(
    ":",
    "-"
  )}" property="og:${property}" />`;
}

const routes = [
  {
    description:
      "Serves campgrounds along the north side of Mount Desert Island.",
    displayName: "Bar Harbor Road",
    id: 1
  },
  {
    description:
      "Serves the ferry terminal and lodging between Bar Harbor and the Hulls Cove Visitor Center.",
    displayName: "Eden Street",
    id: 2
  },
  {
    description:
      "Serves Bar Harbor, the Loop Road to Otter Point, and Route 3.",
    displayName: "Sand Beach",
    id: 3
  },
  {
    description: "Serves all of Ocean Drive, Seal Harbor, and Jordan Pond.",
    displayName: "Loop Road",
    id: 4
  },
  {
    description:
      "Serves the Loop Road from the Hulls Cove Visitor Center to Jordan Pond.",
    displayName: "Jordan Pond",
    id: 5
  },
  {
    description:
      "An out-and-back route servicing interior mountain trails and carriage roads as well as Northeast Harbor and Jordan Pond from the south.",
    displayName: "Northeast Harbor",
    id: 6
  },
  {
    description:
      "Travels to Southwest Harbor along the west side of the island.",
    id: 7,
    displayName: "Southwest Harbor"
  },
  {
    description:
      "This loop covers the Schoodic Peninsula portion of Acadia National Park and surrounding communities.",
    id: 8,
    displayName: "Schoodic"
  },
  {
    description:
      "Travels from Bar Harbor, crossing over to the mainland, and on to the Bar Harbor Airport; serving campgrounds along its path.",
    id: 9,
    displayName: "Trenton"
  },
  {
    description:
      "Transportation between Bar Harbor and the Blackwoods Campground.",
    id: 10,
    displayName: "Blackwoods"
  },
  {
    description:
      "This route traverses the south of Mount Desert Island's 'quiet side' visiting Southwest Harbor and Bernard.",
    id: 11,
    displayName: "Manset / Bernard"
  }
];
