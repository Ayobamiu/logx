/** @format */

import React, { useContext } from "react";
import { View, StyleSheet, ScrollView, Linking } from "react-native";
import AppText from "../components/AppText";
import colors from "../config/colors";
import AuthContext from "../contexts/auth";

function SafetyAndSecurityScreen(props) {
  const { user } = useContext(AuthContext);
  const ListItem = ({ text }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          marginVertical: 16,
        }}>
        <View
          style={{
            width: 10,
            height: 10,
            backgroundColor: colors.black,
            borderRadius: 5,
            marginRight: 16,
            marginVertical: 8,
          }}
        />
        <AppText size='16' style={{ flex: 1 }}>
          {text}
        </AppText>
      </View>
    );
  };

  const texts = [
    {
      id: "1",
      text:
        " It is highly recommended that transactions are done with verified parties only. ",
    },
    {
      id: "2",
      text:
        " If you run into problems with a delivery personnel, you can report to us and the Log-x team will look into the delivery personnel as soon as possible. ",
    },
    {
      id: "3",
      text:
        "All transactions including payments, communication, etc. must be done within the Log-x application. DO NOT pay in advance into the delivery personnel's bank account if he ask you to. In any case such situation exists, report him/her to us immediately. ",
    },
    {
      id: "4",
      text:
        "It is advisable that transactions between the sender, delivery personnel and receiver is done at a safe and public place. ",
    },
    {
      id: "5",
      text:
        "As a delivery personnel, if an item doesn't correlate with the description made by the sender, or the seal of the package feels off, you have the right to reject the offer. Also, you have the right either as a sender or delivery personnel not to commence with the transaction if you don't feel comfortable with the other party.",
    },
  ];
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}>
      <AppText size='16'>
        Welcome{" "}
        <AppText style={styles.bold} size='16'>
          {user.firstName}
        </AppText>{" "}
        Log-x takes the security of its clients serious. This makes us focused
        on ensuring a good user experience when using our service. Below are
        some tips to ensure your safety and security.{" "}
      </AppText>
      <View style={{ marginLeft: 32, marginTop: 16 }}>
        {texts.map((item) => (
          <ListItem text={item.text} key={item.id} />
        ))}
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            marginVertical: 16,
          }}>
          <View
            style={{
              width: 10,
              height: 10,
              backgroundColor: colors.black,
              borderRadius: 5,
              marginRight: 16,
              marginVertical: 8,
            }}
          />
          <AppText size='16' style={{ flex: 1 }}>
            For feedbacks, comments and technical support, contact the Log-x
            team by email:
            {
              <AppText
                onPress={async () => {
                  await Linking.openURL("mailto:contact@logtechx.com");
                }}
                style={{ color: colors.link }}>
                {" "}
                contact@logtechx.com
              </AppText>
            }
          </AppText>
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  bold: { fontWeight: "bold" },
  container: {
    padding: 16,
    backgroundColor: colors.white,
    paddingVertical: 32,
  },
});
export default SafetyAndSecurityScreen;
