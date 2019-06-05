# Contributing

## Local Development (via symbolic links)

In order to develop against a local checkout:

1. Run `yarn link` in `brainstem-redux`
1. Run `yarn compile` in `brainstem-redux` **after every change** (to simulate library packaging)
1. Run `yarn link brainstem-redux` in the targetted project
1. Restart Webpack in the targeted project

## Running example

1. Run `yarn start`
1. Navigate to `http://localhost:8080/`
1. Select the `examples` folder
1. View example application and type an approved string into the search bar

## Publishing

As we are making changes, we should publish prerelease versions to test changes in other repositories:

1. We have a PR for some change set
1. Appropriately change the semantic version with a prerelease version
1. Publish prerelease version

Once we are ready to cut a new release:

1. Merge PR into `master`
1. Cut a new PR for new release
1. Appropriately change the semantic version
1. Get an approved review and passing CI suite
1. Publish new version (`yarn publish`)
1. Merge PR into `master`
