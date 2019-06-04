# Contributing

## Local Development (via symbolic links)

In order to develop against a local checkout:

1. Run `yarn link` in `brainstem-redux`
1. Run `yarn compile` in `brainstem-redux` **after every change** (to simulate library packaging)
1. Run `yarn link brainstem-redux` in the targetted project
1. Retart Webpack in the targetted project

## Running example

1. Run `yarn start`
1. Navigate to `http://localhost:8080/`
1. Select the `examples` folder
1. View example application and type an approved string into the search bar
