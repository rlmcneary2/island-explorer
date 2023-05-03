# island-explorer

## Publish

Changes to the master branch are automatically deployed by Netlify.

1. Bump the version in `package.json`. _Causes the service-worker.js file to be updated._
1. Commit the change.
1. Update the master branch.

## Development

Start the development environment.

```sh
yarn build:sw && yarn start
```

This application uses a service worker. Recent changes to browsers have made
secure connections more strict. To test with Chromium (or Chrome) start the
browser with the command line switch which will treat `http` connections from a
specific domain as secure:

```sh
chromium --unsafely-treat-insecure-origin-as-secure=http://< address >:< port >
```
