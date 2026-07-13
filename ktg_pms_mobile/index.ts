const {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} = require("react-native-reanimated");

// Fix triệt để lỗi "property is not configurable" trên Hermes
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Tắt chế độ strict để không crash khi ghi đè property
});

import { registerRootComponent } from "expo";
import App from "./src/App";

registerRootComponent(App);
