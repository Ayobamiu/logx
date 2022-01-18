import React from "react";
import { View, StyleSheet } from "react-native";
import AppText from "../components/AppText";

function MessagesScreen(props) {
  return (
    <View style={styles.container}>
      <AppText>MessagesScreen</AppText>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});
export default MessagesScreen;
