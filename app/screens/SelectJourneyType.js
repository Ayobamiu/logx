/** @format */

import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import useLocation from "../hooks/useLocation";
import { store } from "../utility/cache";

function SelectJourneyType(props) {
  const { address } = useLocation();

  return (
    <View style={styles.container}>
      <AppText size='large' style={styles.mv10}>
        Where are you sending package to?
      </AppText>
      <AppButton
        title={address?.region ? `Within ${address?.region}` : "Intra City"}
        fullWidth
        style={styles.mv10}
        onPress={async () => {
          await store("journey:type", "intra-state");
          props.navigation.navigate("EnterLocationScreen");
        }}
      />
      <AppButton
        title={address?.region ? `Outside ${address?.region}` : "Inter City"}
        fullWidth
        style={styles.mv10}
        onPress={async () => {
          await store("journey:type", "inter-state");
          props.navigation.navigate("EnterLocationScreen");
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  mv10: { marginVertical: 10 },
});
export default SelectJourneyType;
