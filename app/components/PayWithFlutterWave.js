/** @format */

import React, { useContext, useEffect, useState } from "react";
import { PayWithFlutterwave } from "flutterwave-react-native";
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
} from "react-native";
import colors from "../config/colors";
import showToast from "../config/showToast";
import AppButton from "./AppButton";
import AppText from "./AppText";
import AppTextInput from "./AppTextInput";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import transactionAPIs from "../api/transaction";
import useAuth from "../auth/useAuth";
import AuthContext from "../contexts/auth";

function PayWithFlutterWave({ visible, toggleModal }) {
  const [amount, setAmount] = useState();
  const [processing, setProcessing] = useState(false);
  const [useProcessingModal, setUseProcessingModal] = useState(false);
  const { saveUser } = useAuth();
  const { user } = useContext(AuthContext);

  const handlePaymentOnTheServer = async (transaction_id) => {
    setUseProcessingModal(true);
    setProcessing(true);

    const { data, error } = await transactionAPIs.addOrRemoveMoney({
      type: "plus",
      amount,
      description: "Account Recharge with Card",
      transaction_id,
      payer: user._id,
      receipent: user._id,
    });

    if (error) {
      setProcessing(false);
      showToast("Failed, Try Again!");
    }
    if (!error && data) {
      saveUser(data.user);
      setProcessing(false);
      showToast("Successful!");
    }
    setTimeout(() => {
      setUseProcessingModal(false);
      toggleModal();
    }, 200);
  };

  return (
    <View>
      <Modal visible={visible} transparent>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : ""}>
          <View
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              width: "100%",
              height: "100%",
            }}>
            <Pressable
              style={{ flex: 0.5, flexGrow: 1 }}
              onPress={toggleModal}
            />
            <View
              style={{
                flex: 0.5,
                width: "100%",
                borderTopRightRadius: 15,
                borderTopLeftRadius: 16,
                backgroundColor: colors.white,
                padding: 32,
                flexShrink: 1,
              }}>
              <View>
                {useProcessingModal && (
                  <View>
                    <ActivityIndicator
                      animating={processing}
                      color={colors.primary}
                    />
                  </View>
                )}
                <AppText size='medium'>Add funds </AppText>

                <View style={styles.mv10}>
                  <AppTextInput
                    placeholder='Amount'
                    title='How much?'
                    onChangeText={(text) => {
                      setAmount(text);
                    }}
                    defaultValue={amount}
                    keyboardType='numeric'
                    returnKeyType='done'
                  />
                </View>
                <View
                  style={[
                    styles.row,
                    {
                      width: "100%",
                      justifyContent: "space-between",
                      marginTop: 30,
                    },
                  ]}>
                  <AppButton
                    title='Go back'
                    secondary
                    style={{
                      borderColor: colors.black,
                      borderWidth: 1,
                      paddingHorizontal: 40,
                    }}
                    onPress={toggleModal}
                    disabled={processing}
                  />

                  <PayWithFlutterwave
                    onRedirect={(data) => {
                      if (data.status === "successful") {
                        handlePaymentOnTheServer(data.transaction_id);
                      }
                    }}
                    options={{
                      tx_ref: new Date().toString(),
                      authorization:
                        "FLWPUBK_TEST-5120f20f66db336ffc0f6131bcc49936-X",
                      customer: {
                        email: "customer-email@example.com",
                      },
                      amount: Number(amount),
                      currency: "NGN",
                      payment_options: "card",
                      customizations: {
                        title: "Recharge your Log X Account",
                        description:
                          "While recharging your account, note 1.7% processing fee.",
                      },
                    }}
                    customButton={(props) => (
                      <AppButton
                        title='Submit'
                        style={{
                          paddingHorizontal: 40,
                        }}
                        onPress={() => {
                          if (amount) {
                            props.onPress();
                          } else {
                            showToast("Enter amount!");
                          }
                        }}
                        disabled={processing}
                      />
                    )}
                  />
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {},
  full_width: { flex: 1, height: "100%" },
  mv10: { marginVertical: 10 },
  picker: {
    borderLeftColor: colors.secondary,
    borderLeftWidth: 1,
    width: 120,
    height: "100%",
    justifyContent: "space-evenly",
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
  },
  pickedItem: {
    backgroundColor: colors.light,
    height: "100%",
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    borderRadius: 5,
  },
  pickerItem: {
    backgroundColor: colors.white,
    height: "100%",
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  pickedItemText: { fontWeight: "bold", color: colors.white },
  pickerItemText: { fontWeight: "bold", color: colors.black },
  row: { flexDirection: "row", alignItems: "center" },
  statusContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
});
export default PayWithFlutterWave;
