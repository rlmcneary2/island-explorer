/**
 * Cache files that are provided through external 3rd party libraries and may
 * change outside this application.
 *
 * @param requests These requests will be cached.
 * @param worker optional
 */
export async function postCacheMessageToServiceWorker(
  requests: (string | MessageRequest)[],
  worker?: ServiceWorker
) {
  const message: { requests: (string | MessageRequest)[]; name: string } = {
    requests,
    name: "cache"
  };

  if (!worker) {
    await navigator.serviceWorker.ready;
  }

  (worker || navigator.serviceWorker.controller).postMessage(message);
}

interface MessageRequest extends Pick<Request, "url"> {
  headers: Record<string, string>;
}
