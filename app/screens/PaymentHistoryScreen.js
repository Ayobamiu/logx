/** @format */

import React, { useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import AppText from "../components/AppText";
import colors from "../config/colors";
import { Feather, Ionicons } from "@expo/vector-icons";
import TransactionContext from "../contexts/transactions";
import AppUserAvatar from "../components/AppUserAvatar";
import transactionAPIs from "../api/transaction";
import showToast from "../config/showToast";

function PaymentHistoryScreen(props) {
  let mounted = true;
  const { transactions, setTransactions } = useContext(TransactionContext);

  const getTransactions = async () => {
    const { data, error } = await transactionAPIs.getMyTransactions();
    if (error) {
      showToast("Failed, Try Again!");
    }
    if (!error && data) {
      // showToast("Successful!");
      if (mounted) {
        setTransactions(data);
      }
    }
  };
  useEffect(() => {
    getTransactions();
    return () => {
      mounted = false;
    };
  }, []);
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    (async () => {
      await getTransactions();
      setRefreshing(false);
    })();
  }, []);
  const PaymentHistory = ({
    imageUrl,
    name,
    transCode,
    amount,
    type,
    item,
  }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("TransactionDetails", item);
        }}
        style={styles.paycard}>
        <AppUserAvatar
          size='small'
          color={colors.black}
          profilePhoto={imageUrl}
          backgroundColor={colors.greyBg}
        />
        <View style={{ marginHorizontal: 10 }}>
          <AppText style={{ color: colors.black, fontWeight: "bold" }}>
            {name || "Anonymous"}
          </AppText>
          <AppText style={{ color: colors.light }}>#{transCode}</AppText>
        </View>
        <AppText style={type === "minus" ? styles.minus : styles.plus}>
          &#8358;{Math.round(amount)}
        </AppText>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
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
          item={item}
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
