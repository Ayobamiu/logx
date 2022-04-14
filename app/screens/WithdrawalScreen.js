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
  FlatList,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import colors from "../config/colors";
import showToast from "../config/showToast";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import AppTextInput from "../components/AppTextInput";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import transactionAPIs from "../api/transaction";
import useAuth from "../auth/useAuth";
import AuthContext from "../contexts/auth";
import useBanks from "../hooks/useBanks";
import WithdrawalAPIs from "../api/withdraw";
import axios from "axios";
import server from "../api/server";
import storage from "../auth/storage";
import TransactionContext from "../contexts/transactions";

function WithdrawalScreen(props) {
  let mounted = true;
  const { loading, getBankRecords, bankRecords } = useBanks();

  const [refreshing, setRefreshing] = React.useState(false);
  const { transactions, setTransactions } = useContext(TransactionContext);
  useEffect(() => {
    getBankRecords();
    // setUploadVisible(false);

    return () => {
      mounted = false;
    };
  }, []);
  const [amount, setAmount] = useState();
  const [processing, setProcessing] = useState(false);
  const [useProcessingModal, setUseProcessingModal] = useState(false);

  const [selectABank, setSelectABank] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [status, setStatus] = useState("pending");
  const { saveUser } = useAuth();
  const { user } = useContext(AuthContext);
  const [progress, setProgress] = useState(0);
  const [paying, setPaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (data) => {
    const token = await storage.getToken();
    setErrorMessage("");

    if (mounted) {
      setProcessing(true);
      setUseProcessingModal(true);
    }
    try {
      const result = await axios.post(
        server + "withdraw",
        { ...data },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (result.data.user) {
        saveUser(result.data.user);
      }
      if (result.data.transactions) {
        setTransactions([result.data.transactions, ...transactions]);
      }
      if (mounted) {
        setProcessing(false);
        setStatus("success");
      }
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Error withdrawing, try again"
      );
      if (mounted) {
        setProcessing(false);
        setStatus("failed");
      }
    }
  };

  const BankRecord = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.bankRecord}
        onPress={() => {
          setSelectedBank(item);
          setSelectABank(false);
        }}>
        <View style={[styles.row, { justifyContent: "space-between" }]}>
          <AppText>{item.bank?.Name}</AppText>
          <AppText>{item.accountNumber}</AppText>
        </View>
        <AppText style={styles.mv10}>{item.accountName}</AppText>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : ""}>
        <AppText size='header'>Withdraw funds</AppText>
        <View style={styles.mv10}>
          <AppTextInput
            title='Amount to withdraw?'
            placeholder='e.g #40,000'
            style={[{ paddingHorizontal: 16 }]}
            onChangeText={(text) => setAmount(text)}
            keyboardType='numeric'
            returnKeyType='done'
          />
          <AppText style={{ color: colors.success }}>
            Total balance in your account: &#8358;
            {Math.round(user.availableBalance)}
          </AppText>
        </View>

        <AppText size='input' style={{ color: colors.title }}>
          Choose your bank
        </AppText>
        <Pressable
          style={[
            styles.row,
            {
              width: "100%",
              height: 50,
              backgroundColor: colors.inputGray,
              marginVertical: 10,
              paddingHorizontal: 16,
              justifyContent: "space-between",
            },
          ]}
          onPress={() => setSelectABank(true)}>
          <AppText style={{ color: colors.light }}>
            {selectedBank
              ? `${selectedBank.bank?.Name} ${selectedBank.accountNumber}`
              : "Select your bank"}
          </AppText>
          <AntDesign name='caretdown' size={14} color={colors.light} />
        </Pressable>
      </KeyboardAvoidingView>
      <AppButton
        title='Proceed'
        style={{
          width: "100%",
          alignSelf: "center",
          marginTop: 50,
        }}
        onPress={() => {
          if (!amount) {
            return showToast("Enter Amount!");
          }
          if (Number(amount) > user.availableBalance) {
            return showToast(
              "Amount cannot be greater than your total balance!"
            );
          }
          if (!selectedBank) {
            return showToast("Select a bank!");
          }
          // setUseProcessingModal(true);
          // setProcessing(true);
          // setTimeout(() => {
          //   // setUseProcessingModal(false);
          //   setProcessing(false);
          //   setStatus("success");
          // }, 2000);
          handleSubmit({
            amount,
            account_bank: selectedBank.bank.Code,
            account_number: selectedBank.accountNumber,
          });
        }}
      />
      <Modal visible={selectABank} presentationStyle='formSheet'>
        <FlatList
          stickyHeaderIndices={[0]}
          contentContainerStyle={styles.container}
          ListHeaderComponent={
            <View>
              <View style={[styles.row, { justifyContent: "space-between" }]}>
                <AppText
                  style={{
                    color: colors.primary,
                    fontWeight: "bold",
                    marginVertical: 16,
                  }}
                  onPress={() => setSelectABank(false)}>
                  Close
                </AppText>
                <AppText
                  style={{
                    color: colors.primary,
                    fontWeight: "bold",
                    marginVertical: 16,
                  }}
                  onPress={() => {
                    setSelectABank(false);
                    props.navigation.navigate("AddBankRecordScreen");
                  }}>
                  Add new
                </AppText>
              </View>
              <AppTextInput placeholder='Search' />
            </View>
          }
          data={bankRecords}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <BankRecord item={item} />}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </Modal>
      <Modal visible={useProcessingModal}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}>
          {processing ? (
            <>
              <AppText style={{ fontWeight: "bold", marginVertical: 10 }}>
                Processing Withdrawal!
              </AppText>
              <AppText style={{ marginVertical: 10, color: colors.warning }}>
                Do not close the App.
              </AppText>
              <ActivityIndicator color={colors.primary} />
            </>
          ) : (
            <>
              {status === "failed" && (
                <>
                  <AppText
                    style={{
                      fontWeight: "bold",
                      marginVertical: 10,
                      color: colors.danger,
                    }}>
                    Withdrawal Failed!
                  </AppText>
                  {errorMessage ? (
                    <AppText
                      style={{
                        fontWeight: "bold",
                        marginVertical: 10,
                        color: colors.danger,
                      }}>
                      {errorMessage}
                    </AppText>
                  ) : null}
                  <AppButton
                    title='Try Again'
                    small
                    onPress={() => setUseProcessingModal(false)}
                  />
                </>
              )}
              {status === "success" && (
                <>
                  <AppText
                    style={{
                      fontWeight: "bold",
                      marginVertical: 10,
                      color: colors.success,
                    }}>
                    &#8358;{amount} processed for Withdrawal Successfully!
                  </AppText>
                  <AppButton
                    title='Okay'
                    small
                    onPress={() => {
                      setUseProcessingModal(false);

                      props.navigation.popToTop();
                    }}
                  />
                </>
              )}
            </>
          )}
        </View>
      </Modal>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  bankRecord: { width: "100%", backgroundColor: colors.white, padding: 16 },
  container: { padding: 16, flex: 1 },
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
  separator: { height: 2, width: "100%", backgroundColor: colors.greyBg },

  statusContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
});
export default WithdrawalScreen;
