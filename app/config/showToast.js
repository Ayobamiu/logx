/** @format */

import { ToastAndroid, Platform, AlertIOS } from "react-native";
import Toast from "react-native-root-toast";

function showToast(msg) {
  if (Platform.OS === "android") {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  } else {
    Toast.show(msg, {
      position: Toast.positions.TOP,
      duration: Toast.durations.SHORT,
    });
  }
}
export default showToast;
