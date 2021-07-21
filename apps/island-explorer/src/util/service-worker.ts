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

  let postWorker = worker;
  if (!postWorker) {
    const reg = await navigator.serviceWorker.ready;
    postWorker = reg.active;
  }

  postWorker.postMessage(message);
}

interface MessageRequest extends Pick<Request, "url"> {
  headers: Record<string, string>;
}
