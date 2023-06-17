export default async (req: Request, ctx: any) => {
  const url = new URL(req.url);
  console.log(`url='${req.url}'`);
  const parts = url.pathname.split("/");

  if (parts.length < 3) {
    return ctx.next();
  }

  console.log(`parts=`, parts);
  const routeId = +parts[2];

  console.log(`routeId='${routeId}'`);
  const route = routes.find(
    route => route.id === routeId
  ) as (typeof routes)[0] & { url: string };

  if (!route) {
    return ctx.next();
  }

  route.url = req.url;

  const res = (await ctx.next()) as Response;
  const html = await res.text();

  // Add OG tags.
  setOpenGraph(html, route);

  return new Response(setOpenGraph(html, route), res);
};

// Set `<meta>` open graph tags that will allow previews to be generated from a
// link to an Island Explorer route.
function setOpenGraph(
  doc: string,
  route: { description: string; displayName: string; url: string }
): string {
  let nextHtml = updateOpenGraphTag(doc, "description", route.description);
  nextHtml = updateOpenGraphTag(
    nextHtml,
    "image",
    "https://www.islandexplorer.app/assets/opengraph-image.png"
  );
  nextHtml = updateOpenGraphTag(
    nextHtml,
    "image:alt",
    "A map of Island Explorer routes displayed in the Acadia's Island Explorer app."
  );
  nextHtml = updateOpenGraphTag(nextHtml, "image:height", "1080");
  nextHtml = updateOpenGraphTag(nextHtml, "image:width", "1080");
  nextHtml = updateOpenGraphTag(
    nextHtml,
    "site_name",
    "Acadia's Island Explorer"
  );
  nextHtml = updateOpenGraphTag(
    nextHtml,
    "title",
    `Island Explorer - ${route.displayName}`
  );
  nextHtml = updateOpenGraphTag(nextHtml, "type", "website");
  nextHtml = updateOpenGraphTag(nextHtml, "url", route.url);
  return nextHtml;
}

function updateOpenGraphTag(
  doc: string,
  property: string,
  content: string
): string {
  const id = `og-${property.replace(":", "-")}`;
  const index = doc.indexOf("</head>");
  return `${doc.substring(
    0,
    index
  )}<meta content="${content}" id="${id}" property="og:${property}" />${doc.substring(
    index
  )}`;
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
      "This loop around the south of Mount Desert Island's 'quiet side' visits Southwest Harbor, Seawall, and Bass Harbor.",
    id: 11,
    displayName: "Tremont"
  }
];
