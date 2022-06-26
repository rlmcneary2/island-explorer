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
