/** @format */

import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import AppText from "../components/AppText";
import colors from "../config/colors";
const ListItem = ({ label, value }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 10,
      }}>
      <View style={{ flex: 0.6 }}>
        <AppText style={{ fontWeight: "bold" }} size='16'>
          {label}
        </AppText>
      </View>
      <View style={{ flex: 0.4 }}>
        <AppText style={{ textAlign: "right", color: colors.secondary }}>
          {value}
        </AppText>
      </View>
    </View>
  );
};

function TransactionDetails(props) {
  const item = props.route.params;
  return (
    <ScrollView style={styles.container}>
      <ListItem label='Description' value={item?.description} />
      <View style={styles.separator} />
      <ListItem label='Amount' value={`${item.currency} ${item?.amount}`} />
      <ListItem
        label='Status'
        value={
          (item?.status === "success" && "Successful") ||
          (item?.status === "pending" && "Pending") ||
          (item?.status === "failed" && "Failed")
        }
      />
      <View style={styles.separator} />
      {item?.payer ? (
        <ListItem
          label='Paid By'
          value={
            item?.payer && `${item?.payer?.firstName} ${item?.payer?.lastName}`
          }
        />
      ) : null}
      {item?.receipent ? (
        <ListItem
          label='Received By'
          value={
            item?.receipent &&
            `${item?.receipent?.firstName} ${item?.receipent?.lastName}`
          }
        />
      ) : null}
      <View style={styles.separator} />
      <ListItem
        label='Date'
        value={`${new Date(item?.createdAt).toDateString()}, ${new Date(
          item?.createdAt
        ).toLocaleTimeString()} `}
      />
      <ListItem
        label='Last Updated'
        value={`${new Date(item?.updatedAt).toDateString()}, ${new Date(
          item?.updatedAt
        ).toLocaleTimeString()} `}
      />
      <View style={styles.separator} />
      <ListItem
        label='Service Fee'
        value={`${item.currency} ${item?.serviceFee}`}
      />
      <View style={styles.separator} />
      <ListItem label='Refund' value={`${item.currency} ${item?.refund}`} />
      <View style={styles.separator} />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.white,
    flex: 1,
  },
  separator: { width: "100%", height: 0.5, backgroundColor: colors.greyBg },
});
export default TransactionDetails;
