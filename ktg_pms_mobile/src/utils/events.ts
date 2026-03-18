import { DeviceEventEmitter } from "react-native";

export const authEvents = {
  emitLogout: () => DeviceEventEmitter.emit("FORCE_LOGOUT"),
  addListener: (callback: () => void) => {
    return DeviceEventEmitter.addListener("FORCE_LOGOUT", callback);
  },
};
