/** @format */

import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import colors from "../config/colors";
import AppText from "./AppText";

function ResetButton({ onPress }) {
  const [timerCount, setTimer] = useState(60);

  useEffect(() => {
    let interval = setInterval(() => {
      setTimer((lastTimerCount) => {
        lastTimerCount <= 1 && clearInterval(interval);
        return lastTimerCount - 1;
      });
    }, 1000); //each count lasts for a second
    //cleanup the interval on complete
    return () => clearInterval(interval);
  }, []);
  return (
    <TouchableOpacity
      onPress={() => {
        if (timerCount <= 1) {
          onPress();
        }
      }}>
      <AppText style={styles.showPassword}>
        {timerCount > 0 ? timerCount : "Resend Code"}
      </AppText>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {},
  showPassword: { color: colors.primary, fontSize: 13, fontWeight: "bold" },
});
export default ResetButton;
