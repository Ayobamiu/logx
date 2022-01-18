import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../config/colors";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";

function TransactionTimer(props) {
  React.useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <Ionicons
          color={colors.black}
          name="ellipsis-vertical-sharp"
          size={24}
        />
      ),
    });
  }, [props.navigation]);
  return (
    <View style={styles.container}>
      <View style={styles.details}>
        <View style={styles.detail}>
          <AppText>Delivery Date</AppText>
          <AppText>Jan 1st, 2021</AppText>
        </View>
        <View style={styles.detail}>
          <AppText>Delivery Time</AppText>
          <AppText>6:00pm</AppText>
        </View>
        <View style={styles.detail}>
          <AppText>Delivery Time</AppText>
          <AppText>6:00pm</AppText>
        </View>
      </View>
      <View style={styles.timers}>
        <View style={styles.circleOverLay}>
          <View style={styles.circle}></View>
        </View>
      </View>
      <View style={styles.buttons}>
        <AppButton title="Get started" fullWidth />
        <AppButton title="Get started" fullWidth secondary />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  buttons: { paddingHorizontal: 16 },
  circle: {
    width: 232,
    height: 232,
    borderRadius: 232 / 2,
    backgroundColor: colors.greyBg,
    borderColor: "red",
    borderWidth: 1,
    position: "absolute",
    left: 0,
    bottom: 0,
    transform: [{ translateX: 60 / 2 - 10 }, { translateY: -(60 / 2 - 10) }],
  },
  circleOverLay: {
    width: 232 + 60,
    height: 232 + 60,
    borderRadius: 232 + 60 / 2,
    backgroundColor: colors.greyBg,
    borderColor: "red",
    borderWidth: 10,
    position: "relative",
  },
  container: {
    justifyContent: "space-between",
    backgroundColor: colors.white,
    flex: 1,
  },
  detail: {
    borderRightColor: colors.greyBg,
    borderRightWidth: 1,
    padding: 10,
    flex: 1 / 3,
    alignItems: "center",
  },
  details: {
    justifyContent: "space-between",
    flexDirection: "row",
    borderBottomColor: colors.greyBg,
    borderBottomWidth: 1,
    borderTopColor: colors.greyBg,
    borderTopWidth: 1,
    marginBottom: 10,
  },
  timers: {
    alignItems: "center",
    justifyContent: "center",
  },
});
export default TransactionTimer;
