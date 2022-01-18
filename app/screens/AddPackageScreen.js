/** @format */

import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Pressable,
  Platform,
} from "react-native";
import AppButton from "../components/AppButton";
import AppModal from "../components/AppModal";
import AppText from "../components/AppText";
import AppTextInput from "../components/AppTextInput";
import colors from "../config/colors";
import Logx_onboardtwo from "../assets/PackageAdded.svg";
import PackageContext from "../contexts/package";
import { Formik } from "formik";
import * as Yup from "yup";
import ErrorMessages from "../components/ErrorMessages";
import DateTimePicker from "@react-native-community/datetimepicker";

const validationSchema = Yup.object().shape({
  date: Yup.string().required().label("Date"),
  // time: Yup.string().required().label("Time"),
  receipentName: Yup.string().required().label("Receipent's Name"),
  receipentNumber: Yup.string().required().label("Receipent's Number"),
  description: Yup.string().required().label("Description"),
});
function AddPackageScreen(props) {
  const [proceed, setProceed] = useState(false);
  const { packages, setPackages } = useContext(PackageContext);
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      <Formik
        initialValues={{
          date: new Date(),
        }}
        onSubmit={async (values) => {
          // handleLogIn({ ...values });
          let currentPackages = packages;
          currentPackages[currentPackages.length - 1] = {
            ...currentPackages[currentPackages.length - 1],
            ...values,
          };
          setPackages(currentPackages);

          props.navigation.navigate("PackageSummaryScreenNew");
        }}
        validationSchema={validationSchema}>
        {({ handleChange, handleBlur, handleSubmit, errors, values }) => (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : ""}>
            {/* ALert */}
            <AppModal
              isVisble={proceed}
              toggleModal={() => setProceed(!proceed)}>
              <View
                style={{
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 58,
                }}>
                <Logx_onboardtwo style={{ marginVertical: 40 }} />
                <AppText size='medium'>Package has been added</AppText>
                <AppText
                  style={{
                    color: colors.light,
                    textAlign: "center",
                    paddingVertical: 16,
                  }}>
                  You have successfully added a package. Click the button below
                  to proceed.
                </AppText>
                <AppButton
                  title='Proceed to delivery'
                  fullWidth
                  style={styles.bottom}
                  onPress={() => {
                    setProceed(!proceed);
                    props.navigation.navigate("PackageSummaryScreenNew");
                  }}
                />
              </View>
            </AppModal>

            {/* ALert */}

            <AppText size='header' style={[styles.mb16]}>
              Add Apackage
            </AppText>

            {/* <AppTextInput
              title="Date of Expected delivery"
              onChangeText={handleChange("date")}
              onBlur={handleBlur("date")}
            /> */}

            <View style={styles.mb16}>
              <AppText
                size='input'
                fontWeight='medium'
                style={[{ color: colors.title }, styles.mb8]}
                defaultValue={new Date()}
                // onChangeText={(text) => {
                //   handleChange("date")(text);
                // }}
              >
                Time of Expected delivery
              </AppText>
              <Pressable
                style={{
                  minHeight: 47,
                  backgroundColor: colors.inputGray,
                  width: "100%",
                  borderRadius: 3,
                  justifyContent: "center",
                  paddingHorizontal: 8,
                }}
                onPress={() => setShowDate(true)}>
                <AppText>
                  {values.date && new Date(values.date).toDateString()}{" "}
                  {values.date && new Date(values.date).toLocaleTimeString()}
                </AppText>
              </Pressable>
              {showDate && (
                <DateTimePicker
                  testID='dateTimePicker'
                  // minimumDate={new Date()}
                  value={new Date(values.date)}
                  mode='datetime'
                  onChange={(event, selectedDate) => {
                    const currentDate = selectedDate || values.date;
                    setShowDate(Platform.OS === "ios");

                    handleChange("date")(currentDate.toISOString());
                  }}
                />
              )}
            </View>

            <ErrorMessages error={errors.date} visible={errors.date} />

            {/* <View style={styles.mb16} */}
            <AppTextInput
              title='Receiver’s Name'
              onChangeText={handleChange("receipentName")}
              onBlur={handleBlur("receipentName")}
            />
            <ErrorMessages
              error={errors.receipentName}
              visible={errors.receipentName}
            />
            <AppTextInput
              title='Receiver’s Number'
              keyboardType='number-pad'
              onChangeText={handleChange("receipentNumber")}
              onBlur={handleBlur("receipentNumber")}
              returnKeyType='done'
            />
            <ErrorMessages
              error={errors.receipentNumber}
              visible={errors.receipentNumber}
            />
            <AppTextInput
              autoCapitalize='none'
              title='Receiver’s Email'
              keyboardType='email-address'
              onChangeText={handleChange("receipentEmail")}
              onBlur={handleBlur("receipentEmail")}
            />
            <ErrorMessages
              error={errors.receipentEmail}
              visible={errors.receipentEmail}
            />
            <AppTextInput
              title='Description'
              multiline={true}
              textAlignVertical='top'
              numberOfLines={6}
              onChangeText={handleChange("description")}
              onBlur={handleBlur("description")}
            />
            <ErrorMessages
              error={errors.description}
              visible={errors.description}
            />
            <AppButton
              title='Done'
              fullWidth
              style={[styles.mtAuto]}
              onPress={handleSubmit}
              // onPress={() => {
              //   props.navigation.navigate("PackageSummaryScreenNew");
              // }}
            />
          </KeyboardAvoidingView>
        )}
      </Formik>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  bold: { fontWeight: "bold" },
  container: {
    padding: 16,
    backgroundColor: colors.white,
    // flex: 1,
  },
  fs18: { fontSize: 18 },
  light: { color: colors.light },
  mb16: { marginBottom: 16 },
  mb32: { marginBottom: 32 },
  mh16: { marginHorizontal: 16 },
  mv16: { marginVertical: 16 },
  mtAuto: { marginTop: 20 },
  primary: { color: colors.primary },

  fs16: { fontSize: 16 },
  jANdACenter: { justifyContent: "center", alignItems: "center" },
  mv10: { marginVertical: 10 },
  secondary: { color: colors.secondary },
  textContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginTop: 20,
  },
});
export default AddPackageScreen;
