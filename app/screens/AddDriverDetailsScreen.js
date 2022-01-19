/** @format */

import React, { useContext, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  ActivityIndicator,
  Pressable,
  Platform,
} from "react-native";
import AppButton from "../components/AppButton";
import AppPicker from "../components/AppPicker";
import AppText from "../components/AppText";
import AppTextInput from "../components/AppTextInput";
import colors from "../config/colors";
import AuthContext from "../contexts/auth";
import authApi from "../api/auth";
import useAuth from "../auth/useAuth";
import showToast from "../config/showToast";
import DateTimePicker from "@react-native-community/datetimepicker";

function AddDriverDetailsScreen(props) {
  const { user } = useContext(AuthContext);
  const [selectedValue, setSelectedValue] = useState(user.deliveryType);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
  const [dob, setDob] = useState(user.dob);
  const [loading, setLoading] = useState(false);
  const [showDate, setShowDate] = useState(false);

  const { saveUser } = useAuth();

  const handleUpdateProfileMedia = async (data) => {
    setLoading(true);
    const result = await authApi.updateProfile(data);

    setLoading(false);
    if (result.data && result.data.error) {
      return showToast(result.data.message);
    }
    if (result.error) {
      return showToast(result.message);
    }
    if (result.data) {
      await saveUser(result.data);
      showToast("Profile Updated.");
      props.navigation.goBack();
    } else {
      return showToast("Couldn't Update Profile!");
    }
  };
  return (
    <View
      style={{
        height: "100%",
        backgroundColor: colors.white,
        justifyContent: "space-between",
      }}>
      <View style={{ height: "85%" }}>
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <AppText size='header' style={[styles.mb16]}>
            Add your details{" "}
            {loading && <ActivityIndicator animating={loading} />}
          </AppText>

          <AppTextInput title='First Name' defaultValue={user.firstName} />
          <AppTextInput title='Last Name' defaultValue={user.lastName} />

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
              Date of Birth
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
              <AppText>{dob && new Date(dob).toDateString()} </AppText>
            </Pressable>
            {showDate && (
              <DateTimePicker
                testID='dateTimePicker'
                // minimumDate={new Date()}
                value={new Date(dob)}
                mode='datetime'
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate || dob;
                  setShowDate(Platform.OS === "ios");
                  setDob(currentDate.toISOString());
                }}
              />
            )}
          </View>
          <AppPicker
            title='Category'
            data={[
              { label: "Car", value: "car" },
              { label: "Truck", value: "truck" },
              { label: "Bike", value: "bike" },
              { label: "Walk", value: "walk" },
            ]}
            placeholder='Select Category'
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
          />
          <AppTextInput
            title='Phone Number'
            keyboardType='number-pad'
            returnKeyType='done'
            defaultValue={user.phoneNumber}
          />
        </ScrollView>
      </View>
      <View style={{ height: "15%", paddingHorizontal: 10 }}>
        <AppButton
          title={loading ? <ActivityIndicator animating={loading} /> : "Done"}
          fullWidth
          style={[styles.mv10]}
          onPress={() => {
            handleUpdateProfileMedia({
              deliveryType: selectedValue,
              firstName,
              lastName,
              phoneNumber,
            });
          }}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  bold: { fontWeight: "bold" },
  container: {
    padding: 16,
    backgroundColor: colors.white,
  },
  fs18: { fontSize: 18 },
  light: { color: colors.light },
  mb16: { marginBottom: 16 },
  mb32: { marginBottom: 32 },
  mh16: { marginHorizontal: 16 },
  mv16: { marginVertical: 16 },
  mtAuto: { marginTop: "auto" },
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
export default AddDriverDetailsScreen;
