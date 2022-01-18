import React from "react";
import { View, StyleSheet } from "react-native";
import AppText from "../components/AppText";
import { Ionicons, Feather, FontAwesome5 } from "@expo/vector-icons";
import colors from "../config/colors";
import showToast from "../config/showToast";
import { TouchableOpacity } from "react-native-gesture-handler";
import copyToClipboard from "../config/copyToClipboard";

function CopyTripCodeScreen(props) {
  const code = props.route.params?.code;
  return (
    <View style={styles.container}>
      <View
        style={{
          padding: 30,
          backgroundColor: colors.successLight,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 10,
          width: "90%",
          height: "90%",
        }}
      >
        <AppText size="medium" style={{ color: colors.black }}>
          Trip code
        </AppText>
        <AppText size="x-small" style={{ color: colors.black }}>
          Copy and share with driver to start jorney
        </AppText>
        <AppText size="large" style={{ fontWeight: "bold" }}>
          {code}
        </AppText>
        <TouchableOpacity
          onPress={() => {
            copyToClipboard(code?.toString());
            showToast("Copied to clipboard!");
          }}
        >
          <Ionicons name="ios-copy-outline" color={colors.success} size={30} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: colors.white,
  },
});
export default CopyTripCodeScreen;
