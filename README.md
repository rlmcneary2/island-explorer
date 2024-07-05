# island-explorer

## Publish

> [!IMPORTANT]
> Changes to the master branch are automatically deployed by Netlify.

1. Bump the version in `package.json`. _Causes the service-worker.js file to be updated._
1. Bump the `CACHE_VERSION` in `service-worker.ts` if the cached files have changed.
1. Commit the change.
1. Update the master branch.

## Development

### Install

```sh
npm i
```

### Dev server

The development server is the Vite server with fast reloading of changes to code. The files served
are **not** the same as the production build files.

```sh
npm run serve
```

### Preview server

Serves a production build using the Vite server. Proxies calls to the `/api` path to the location
specified in the "preview" section of `apps/island-explorer/vite.config.ts`

```sh
npm run preview
```

### Static server

Builds production and serves the files using http-server; no proxy.

```sh
npm run serve:static
```
