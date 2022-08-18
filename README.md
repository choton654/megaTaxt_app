# This is MEGATAXI-RN project

## Local Dev

Prep the project

`yarn install --force`
`cd ios`
`pod install`
`cd ..`

Run on Android

`yarn android`

Run on iOS

`yarn ios`

or run the following command to test on a specific iOS simulator

`npx react-native run-ios --simulator="iPhone 13 Pro"`

### ESLint

Run `npx eslint src/` before committing and make sure there are no errors there.
