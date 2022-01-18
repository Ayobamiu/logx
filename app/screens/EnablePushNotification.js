import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import BellGroup from "../assets/BellGroup.svg";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import colors from "../config/colors";
import AppAlert from "../components/AppAlert";

function EnablePushNotification(props) {
  const [showAlert, setShowAlert] = useState(false);
  return (
    <View style={[styles.container, styles.jANdACenter]}>
      <AppAlert isVisble={showAlert}>
        <AppText
          style={[
            styles.bold,
            styles.fs16,
            styles.secondary,
            styles.textCenter,
          ]}
        >
          Log-X would like to send you Notifications
        </AppText>
        <AppText style={[styles.light, styles.mv10, styles.textCenter]}>
          Notifications may include alerts, sounds, icon badges. These can be
          configured in settings
        </AppText>
        <View style={styles.textContainer}>
          <AppText
            style={[styles.primary, styles.bold]}
            onPress={() => {
              setShowAlert(false);
            }}
          >
            Don’t allow
          </AppText>
          <AppText
            style={[styles.primary, styles.bold]}
            onPress={() => {
              setShowAlert(false);
            }}
          >
            Allow
          </AppText>
        </View>
      </AppAlert>

      <BellGroup />
      <AppText size="header" style={[styles.bold, styles.mv10]}>
        Gain peace of mind
      </AppText>
      <AppText
        style={[
          {
            color: colors.light,
            paddingVertical: 16,
          },
          styles.textCenter,
        ]}
      >
        Enable push locations to stay ontop of your deliveries with updates from
        different transactions
      </AppText>
      <View
        style={[
          {
            width: "100%",
            position: "absolute",
            bottom: 16,
          },
          styles.jANdACenter,
        ]}
      >
        <View
          style={{
            backgroundColor: colors.orange,
            padding: 8,
            borderRadius: 20,
            marginVertical: 16,
          }}
        >
          <AppText
            style={[
              {
                color: colors.darkyellow,
                paddingHorizontal: 10,
              },
              styles.textCenter,
            ]}
          >
            You can change seetings anytime
          </AppText>
        </View>
        <AppButton
          title="Enable Notifications"
          fullWidth
          style={styles.bottom}
          onPress={() => {
            setShowAlert(true);
          }}
        />
        <AppButton title="Maybe Later" fullWidth secondary onPress={() => {}} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  bold: { fontWeight: "bold" },
  container: { flex: 1, paddingHorizontal: 58 },
  fs16: { fontSize: 16 },
  light: { color: colors.light },
  jANdACenter: { justifyContent: "center", alignItems: "center" },
  textCenter: { textAlign: "center" },
  mtAuto: { marginTop: "auto" },
  mv10: { marginVertical: 10 },
  primary: { color: colors.primary },
  secondary: { color: colors.secondary },
  textContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginTop: 20,
  },
});
export default EnablePushNotification;
