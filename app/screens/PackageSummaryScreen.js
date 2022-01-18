import React, { useContext, useState } from "react";
import { View, StyleSheet } from "react-native";
import AppButton from "../components/AppButton";
import AppModal from "../components/AppModal";
import AppText from "../components/AppText";
import colors from "../config/colors";
import Logx_onboardtwo from "../assets/PackageAdded.svg";
import PackageSummaryItem from "../components/PackageSummaryItem";

function PackageSummaryScreen(props) {
  const [proceed, setProceed] = useState(false);

  return (
    <View style={styles.container}>
      {/* ALert */}
      <AppModal isVisble={proceed} toggleModal={() => setProceed(!proceed)}>
        <View
          style={{
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            padding: 58,
          }}
        >
          <Logx_onboardtwo style={{ marginVertical: 40 }} />
          <AppText size="medium">Successful</AppText>
          <AppText
            style={{
              color: colors.light,
              textAlign: "center",
              paddingVertical: 16,
            }}
          >
            You have successfully added a package for the two locations. Click
            the link below to proceed.
          </AppText>
          <AppButton
            title="Add a payment method"
            fullWidth
            style={styles.bottom}
            onPress={() => {
              setProceed(!proceed);
              props.navigation.navigate("AvailableDrivers");
            }}
          />
        </View>
      </AppModal>

      {/* ALert */}

      <AppText size="header" style={[styles.mb16]}>
        Add Apackage
      </AppText>
      <AppText style={[styles.light, styles.mb32]}>
        {`Check the summary of the packages \nyou want to send.`}{" "}
      </AppText>
      <PackageSummaryItem />
      <PackageSummaryItem />
      <PackageSummaryItem />
      <View style={styles.row}>
        <AppText style={[styles.light]}>Total Cost</AppText>
        <AppText style={[styles.black, styles.bold]}>4,000</AppText>
      </View>

      <View
        style={[
          {
            backgroundColor: colors.orange,
            padding: 8,
            borderRadius: 20,
            marginVertical: 16,
          },
          styles.mtAuto,
        ]}
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
          Note that this payment will not get to the receiver until al packages
          has been delivered
        </AppText>
      </View>
      <AppButton
        title="Add package"
        fullWidth
        onPress={() => {
          setProceed(true);
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  bold: { fontWeight: "bold" },
  black: { color: colors.black },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.white,
    paddingBottom: 32,
  },
  fs18: { fontSize: 18 },
  light: { color: colors.light },
  mb16: { marginBottom: 16 },
  mb32: { marginBottom: 32 },
  mh16: { marginHorizontal: 16 },
  mtAuto: { marginTop: "auto" },
  primary: { color: colors.primary },

  fs16: { fontSize: 16 },
  jANdACenter: { justifyContent: "center", alignItems: "center" },
  mv10: { marginVertical: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  secondary: { color: colors.secondary },
  textCenter: { textAlign: "center" },

  textContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginTop: 20,
  },
});
export default PackageSummaryScreen;
