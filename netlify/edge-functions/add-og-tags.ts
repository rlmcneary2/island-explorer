import { routes } from "../../apps/island-explorer/src/assets/routes.json";
import messages from "../../apps/island-explorer/src/assets/messages-en-us.json";

export default async (req: Request, ctx: any) => {
  const url = new URL(req.url);
  const parts = url.pathname.split("/");

  if (parts.length < 3) {
    return ctx.next();
  }

  const route = routes.find(
    route => route.id === +parts[1]
  ) as (typeof routes)[0] & { url: string };
  route.description = messages[route.description];
  route.url = req.url;

  if (!route) {
    return ctx.next();
  }

  const res = (await ctx.next()) as Response;
  const html = await res.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Add OG tags.
  setOpenGraph(doc, route);

  return new Response(new XMLSerializer().serializeToString(doc), res);
};

// Set `<meta>` open graph tags that will allow previews to be generated from a
// link to an Island Explorer route.
function setOpenGraph(
  doc: Document,
  route: { description: string; displayName: string; url: string }
) {
  updateOpenGraphTag(doc, "description", route.description);
  updateOpenGraphTag(
    doc,
    "image",
    "https://www.islandexplorer.app/assets/opengraph-image.png"
  );
  updateOpenGraphTag(
    doc,
    "image:alt",
    "A map of Island Explorer routes displayed in the Acadia's Island Explorer app."
  );
  updateOpenGraphTag(doc, "image:height", "1080");
  updateOpenGraphTag(doc, "image:width", "1080");
  updateOpenGraphTag(doc, "site_name", "Acadia's Island Explorer");
  updateOpenGraphTag(doc, "title", `Island Explorer - ${route.displayName}`);
  updateOpenGraphTag(doc, "type", "website");
  updateOpenGraphTag(doc, "url", route.url);
}

function updateOpenGraphTag(doc: Document, property: string, content: string) {
  const id = `og-${property.replace(":", "-")}`;
  const meta = document.head.querySelector(`#${id}`) as HTMLMetaElement;
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
