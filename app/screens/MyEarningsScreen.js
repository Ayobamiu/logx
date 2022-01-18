/** @format */

import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Modal,
  Pressable,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import AppText from "../components/AppText";
import colors from "../config/colors";
import { Feather, Ionicons } from "@expo/vector-icons";
import MasterCardLogo from "../assets/MasterCardLogo.svg";
import AppButton from "../components/AppButton";
import AppTextInput from "../components/AppTextInput";
import SectionHeader from "../components/SectionHeader";
import AuthContext from "../contexts/auth";
import transactionAPIs from "../api/transaction";
import showToast from "../config/showToast";
import TransactionContext from "../contexts/transactions";
import PayWithFlutterWave from "../components/PayWithFlutterWave";

function MyEarningsScreen(props) {
  const { user } = useContext(AuthContext);
  const [openPayment, setOpenPayment] = useState(false);
  const { transactions, setTransactions } = useContext(TransactionContext);

  const getTransactions = async () => {
    const { data, error } = await transactionAPIs.getMyTransactions();
    if (error) {
      showToast("Failed, Try Again!");
    }
    if (!error && data) {
      // showToast("Successful!");
      setTransactions(data);
    }
  };
  useEffect(() => {
    getTransactions();
  }, []);

  const CardDesign = ({ empty = false }) => {
    if (empty)
      return (
        <Pressable
          onPress={() => setShowBidModal(true)}
          style={[
            styles.card,
            {
              justifyContent: "center",
              borderStyle: "dashed",
              borderColor: colors.black,
              borderWidth: 1,
            },
          ]}>
          <Feather
            name='plus'
            color={colors.black}
            size={15}
            style={{ marginHorizontal: 10 }}
          />
          <AppText style={{ color: colors.black, fontWeight: "bold" }}>
            Add new account
          </AppText>
        </Pressable>
      );
    return (
      <View style={styles.card}>
        <MasterCardLogo />
        <View style={{ marginHorizontal: 10 }}>
          <AppText style={{ color: colors.black, fontWeight: "bold" }}>
            **** **** **** 9097
          </AppText>
          <AppText style={{ color: colors.light }}>Visa</AppText>
        </View>
      </View>
    );
  };
  const PaymentHistory = ({ imageUrl, name, transCode, amount, type }) => {
    return (
      <View style={styles.paycard}>
        <ImageBackground
          source={{ uri: imageUrl }}
          style={styles.bigAvatar}
          borderRadius={32 / 2}>
          {!imageUrl && (
            <Feather name='user' size={(32 * 2) / 3} color={colors.black} />
          )}
        </ImageBackground>
        <View style={{ marginHorizontal: 10 }}>
          <AppText style={{ color: colors.black, fontWeight: "bold" }}>
            {name || "Anonymous"}
          </AppText>
          <AppText style={{ color: colors.light }}>#{transCode}</AppText>
        </View>
        <AppText style={type === "plus" ? styles.plus : styles.minus}>
          &#8358;{Math.round(amount)}
        </AppText>
      </View>
    );
  };
  const [showBidModal, setShowBidModal] = useState(false);
  return (
    <View style={styles.container}>
      <AppText style={styles.bold} size='header'>
        My Wallet
      </AppText>
      <View style={styles.yellowBox}>
        <AppText size='header'>
          {user.availableBalance}
          <AppText size='x-small' style={{ color: colors.white }}>
            {" "}
            NGN
          </AppText>
        </AppText>
        <View
          style={[
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 16,
            },
          ]}>
          <TouchableOpacity
            onPress={() => setOpenPayment(true)}
            style={{
              width: "40%",
              backgroundColor: colors.white,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}>
            <AppText style={[styles.primary, styles.bold]}>Add funds</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => props.navigation.navigate("WithdrawalScreen")}
            style={{
              width: "40%",
              backgroundColor: colors.white,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}>
            <AppText style={[styles.primary, styles.bold]}>withdraw</AppText>
          </TouchableOpacity>
        </View>
      </View>
      {/* <View>
        <FlatList
          data={[{ id: "1" }, { id: "3", empty: true }]}
          renderItem={({ item }) => <CardDesign empty={item.empty} />}
          keyExtractor={(item) => item.id}
          horizontal
          contentContainerStyle={{
            height: 70,
            alignItems: "center",
            marginVertical: 16,
          }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View> */}

      <SectionHeader
        headerText='Payment History'
        buttonText='See all'
        onPress={() => {
          props.navigation.navigate("PaymentHistoryScreen");
        }}
      />

      <FlatList
        data={transactions}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <PaymentHistory
            name={
              item.payer && `${item?.payer?.firstName} ${item?.payer?.lastName}`
            }
            transCode={item._id}
            amount={item.amount}
            type={item.type}
            imageUrl={item?.payer?.profilePhoto}
          />
        )}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View
            style={{
              width: "100%",
              height: 200,
              justifyContent: "center",
              alignItems: "center",
            }}>
            <Ionicons name='ios-card-outline' size={24} color='black' />
            <AppText>Your Transactions will show here.</AppText>
          </View>
        }
      />
      <PayWithFlutterWave
        visible={openPayment}
        toggleModal={() => setOpenPayment(false)}
      />
      <Modal visible={showBidModal} transparent>
        <View style={{ height: "100%", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <Pressable
            style={{ flex: 0.3, width: "100%", flexGrow: 1 }}
            onPress={() => {
              setShowBidModal(false);
            }}
          />
          <View
            style={{
              backgroundColor: colors.white,
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              overflow: "hidden",
            }}>
            <Pressable
              style={[styles.close, styles.mv16, { alignSelf: "center" }]}
              onPress={() => {
                setShowBidModal(false);
              }}
            />
            <View style={{ padding: 16 }}>
              <AppText size='medium' style={styles.mv16}>
                Add New Card
              </AppText>
              <AppTextInput style={styles.mv16} title='Card Number' />
              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <AppTextInput style={styles.mv16} title='Expiry Date' />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <AppTextInput style={styles.mv16} title='CVC/CVV' />
                </View>
              </View>
              <AppTextInput style={styles.mv16} title='Cardholder Name' />
            </View>
            <View
              style={[
                styles.row,
                {
                  justifyContent: "space-around",
                  paddingBottom: 16,
                  paddingHorizontal: 32,
                },
              ]}>
              <AppButton
                title='Submit'
                onPress={() => {
                  setShowBidModal(false);
                }}
                fullWidth
                whiteText
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  bigAvatar: {
    alignItems: "center",
    width: 32,
    height: 32,
    borderRadius: 32 / 2,
    backgroundColor: colors.secondary,
    justifyContent: "center",
  },
  bold: { fontWeight: "bold" },
  card: {
    width: 277,
    height: 67,
    backgroundColor: colors.inputGray,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },

  close: {
    width: 58,
    height: 4,
    backgroundColor: colors.light,
    alignSelf: "center",
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  minus: {
    color: colors.danger,
    marginLeft: "auto",
    backgroundColor: colors.dangerLight,
    padding: 4,
    borderRadius: 10,
    overflow: "hidden",
  },
  mv16: { marginVertical: 16 },
  paycard: {
    width: "100%",
    backgroundColor: colors.inputGray,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  plus: {
    color: colors.success,
    marginLeft: "auto",
    backgroundColor: colors.successLight,
    padding: 4,
    borderRadius: 10,
    overflow: "hidden",
  },
  primary: { color: colors.primary },
  separator: { height: 20, width: 10 },
  row: { flexDirection: "row", alignItems: "center" },
  yellowBox: {
    width: "100%",
    backgroundColor: colors.primary,
    borderRadius: 5,
    padding: 20,
    // flexDirection: "row",
    // alignItems: "center",
    // justifyContent: "space-between",
    marginVertical: 16,
  },
});
export default MyEarningsScreen;
