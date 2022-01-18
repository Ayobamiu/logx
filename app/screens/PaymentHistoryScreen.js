/** @format */

import React, { useContext } from "react";
import { View, StyleSheet, ImageBackground, FlatList } from "react-native";
import AppText from "../components/AppText";
import colors from "../config/colors";
import { Feather, Ionicons } from "@expo/vector-icons";
import TransactionContext from "../contexts/transactions";

function PaymentHistoryScreen(props) {
  const { transactions, setTransactions } = useContext(TransactionContext);

  const PaymentHistory = ({ imageUrl, name, transCode, amount, type }) => {
    return (
      <View style={styles.paycard}>
        <ImageBackground
          source={{ uri: imageUrl }}
          borderRadius={32 / 2}
          style={styles.bigAvatar}>
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
        <AppText style={type === "minus" ? styles.minus : styles.plus}>
          &#8358;{Math.round(amount)}
        </AppText>
      </View>
    );
  };

  return (
    <FlatList
      data={transactions}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <PaymentHistory
          name={
            item.payer && `${item?.payer?.firstName} ${item?.payer?.lastName}`
          }
          transCode={item._id}
          type={item.type}
          amount={item.amount}
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
  separator: { height: 20, width: 10 },
  row: { flexDirection: "row", alignItems: "center" },
  yellowBox: {
    width: "100%",
    height: 100,
    backgroundColor: colors.primary,
    borderRadius: 5,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 16,
  },
});

export default PaymentHistoryScreen;
