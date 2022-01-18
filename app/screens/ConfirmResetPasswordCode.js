/** @format */

import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import Toast from "react-native-root-toast";
import useAuth from "../auth/useAuth";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import AppTextInput from "../components/AppTextInput";
import colors from "../config/colors";
import { get } from "../utility/cache";

function ConfirmResetPasswordCode(props) {
  const [code, setCode] = useState("");
  const [text, setText] = useState("");
  const { saveAndSendResetPassworCode, sendingCode } = useAuth();

  useEffect(() => {
    (async () => {
      const code = await get("password:reset:code");
      setCode(code);
    })();
  }, []);
  return (
    <View style={styles.container}>
      <AppText>
        Enter Password reset code{" "}
        <ActivityIndicator animating={sendingCode} color={colors.primary} />
      </AppText>
      <AppTextInput
        placeholder='Enter Code'
        keyboardType='number-pad'
        returnKeyType='done'
        style={{ marginVertical: 16 }}
        onChangeText={(txt) => {
          setText(txt);
          if (txt.length === 6) {
            if (txt === code.toString()) {
              props.navigation.navigate("ResetPasswordScreen");
            } else {
              Toast.show("Incorrect code!", {
                position: Toast.positions.TOP,
              });
            }
          }
        }}
      />
      <AppButton
        title='Proceed'
        onPress={() => {
          if (txt.length === 6 && text === code.toString()) {
            props.navigation.navigate("ResetPasswordScreen");
          } else {
            Toast.show("Incorrect code!", {
              position: Toast.positions.TOP,
            });
          }
        }}
      />
      <AppButton
        title='Resend code'
        secondary
        onPress={async () => {
          const newCode = await saveAndSendResetPassworCode();
          setCode(newCode);
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    padding: 16,
  },
});
export default ConfirmResetPasswordCode;
