/** @format */

import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import AppTextInput from "../components/AppTextInput";
import colors from "../config/colors";
import AppModal from "../components/AppModal";
import FullPageLoading from "../components/FullPageLoading";
import StarGroup from "../assets/StarGroup.svg";
import { get } from "../utility/cache";
import useAuth from "../auth/useAuth";
import Toast from "react-native-root-toast";

function VerifyNumber(props) {
  const [showModal, setShowModal] = useState(false);
  const [proceed, setProceed] = useState(false);
  const [code, setCode] = useState("");
  const { saveAndSendCode } = useAuth();

  const param = props.route.params;
  useEffect(() => {
    (async () => {
      const code = await get("verify:code");
      setCode(code);
    })();
  }, []);

  const showLoadingBreifly = () => {
    setShowModal(true);
    setTimeout(() => {
      setShowModal(false);
      setProceed(true);
    }, 3000);
  };
  React.useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <AppText
          style={[styles.bold, styles.fs18, styles.mh16, styles.primary]}
          onPress={async () => {
            const newCode = await saveAndSendCode(param.email);
            setCode(newCode);
          }}>
          Resend Code
        </AppText>
      ),
    });
  });
  return (
    <View style={styles.container}>
      <FullPageLoading isVisble={showModal} />
      <AppModal isVisble={proceed} toggleModal={() => setProceed(!proceed)}>
        <View
          style={{
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            padding: 58,
          }}>
          <StarGroup style={{ marginVertical: 40 }} />
          <AppText size='medium'>You are unstoppable!</AppText>
          <AppText
            style={{
              color: colors.light,
              textAlign: "center",
              paddingVertical: 16,
            }}>
            Hi Champ, we have verified your phone number and email address,
            kindly click the link below to setup your account.
          </AppText>
          <AppButton
            title='Set up your account'
            fullWidth
            style={styles.bottom}
            onPress={() => {
              setProceed(!proceed);
              props.navigation.navigate("Sign Up Two", { ...param, code });
            }}
          />
        </View>
      </AppModal>

      <AppText size='header' style={[styles.mb16]}>
        Enter Code
      </AppText>
      <AppText style={[styles.light, styles.mb32]}>
        Please submit the six digit confirmation code sent to{" "}
        <AppText style={[styles.bold, styles.black]}>
          {param.phoneNumber}
        </AppText>{" "}
        or
        <AppText style={[styles.bold, styles.black]}> {param.email}</AppText>
      </AppText>
      <AppTextInput
        title='Enter the confrimation code'
        placeholder='Six digit code'
        keyboardType='number-pad'
        returnKeyType='done'
        maxLength={6}
        enablesReturnKeyAutomatically
        onChangeText={(text) => {
          if (text.length === 6) {
            if (text === code.toString()) {
              showLoadingBreifly();
            } else {
              Toast.show("Incorrect code!", {
                position: Toast.positions.TOP,
              });
            }
          }
        }}
      />
      <AppButton
        title='Didn’t get the code? Resend'
        fullWidth
        secondary
        style={[styles.mtAuto]}
        onPress={async () => {
          const newCode = await saveAndSendCode();
          setCode(newCode);
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  black: { color: colors.black },
  bold: { fontWeight: "bold" },
  bottom: { position: "absolute", bottom: 16 },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.white,
    paddingBottom: 32,
    width: "100%",
  },
  fs18: { fontSize: 18 },
  light: { color: colors.light },
  mb16: { marginBottom: 16 },
  mb32: { marginBottom: 32 },
  mh16: { marginHorizontal: 16 },
  mtAuto: { marginTop: "auto" },
  primary: { color: colors.primary },
});
export default VerifyNumber;
