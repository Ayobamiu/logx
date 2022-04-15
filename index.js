// /** @format */

import "react-native-gesture-handler";
// import App from "./App";
// import { AppRegistry } from "react-native";
// import { registerRootComponent } from "expo";

// // registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// // It also ensures that whether you load the app in Expo Go or in a native build,
// // the environment is set up appropriately
// // registerRootComponent(App);
// AppRegistry.registerComponent("main", () => App);
// // registerRootComponent(App);

// import "expo-dev-client";

import { registerRootComponent } from "expo";

import App from "./App";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
