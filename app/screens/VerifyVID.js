/** @format */

import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Platform,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "../components/AppText";
import colors from "../config/colors";
import AuthContext from "../contexts/auth";
import DateTimePicker from "@react-native-community/datetimepicker";
import AppTextInput from "../components/AppTextInput";
import AppButton from "../components/AppButton";
import apiClientNotCached from "../api/clientNotCached";
import authApi from "../api/auth";
import useAuth from "../auth/useAuth";
import showToast from "../config/showToast";

function VerifyVID(props) {
  const { user } = useContext(AuthContext);

  const [dob, setDob] = useState(user.dob);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
  const [votersCardNum, setVotersCardNum] = useState(user.votersCardNum);

  const [loading, setLoading] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [status, setStatus] = useState("pending");
  const { saveUser } = useAuth();

  const handleUpdateProfileMedia = async (data) => {
    setLoading(true);
    //verify Voters ID
    const verifyResult = await apiClientNotCached.post(
      "https://vapi.verifyme.ng/v1/verifications/identities/vin/10000000001",
      {
        firstname: "John",
        lastname: "Doe",
        phone: "080000000000",
        dob: "04-04-1944",
      }
    );
    if (verifyResult.data) {
      await authApi.updateProfile({
        votersCardVerificationStatus: "success",
        votersCardNum: votersCardNum,
      });

      setLoading(false);
      if (result.data && result.data.error) {
        return showToast(result.data.message);
      }
      if (result.error) {
        return showToast(result.message);
      }
      if (result.data) {
        await saveUser(result.data);
        showToast("Profile Updated. Verified!");
        return setStatus("success");
        //  props.navigation.goBack();
      } else {
        return showToast("Couldn't Update Profile!");
      }
    }
    if (verifyResult.error) {
      setLoading(false);
      return showToast(verifyResult.message);
    }
    if (verifyResult.data && verifyResult.data.error) {
      return showToast(verifyResult.data.message);
    }
    //verify Voters ID
  };
  return (
    <View style={styles.container}>
      <AppTextInput
        placeholder='Voters ID Number'
        title='Voters ID Number'
        keyboardType='number-pad'
        returnKeyType='done'
        defaultValue={user.votersCardNum}
        onChangeText={(text) => setVotersCardNum(text)}
      />
      <AppTextInput
        placeholder='First Name'
        title='First Name'
        defaultValue={user.firstName}
        onChangeText={(text) => setFirstName(text)}
      />
      <AppTextInput
        placeholder='Last Name'
        title='Last Name'
        defaultValue={user.lastName}
        onChangeText={(text) => setLastName(text)}
      />
      <AppTextInput
        placeholder='Phone Number'
        title='Phone Number'
        keyboardType='number-pad'
        returnKeyType='done'
        defaultValue={user.phoneNumber}
        onChangeText={(text) => setPhoneNumber(text)}
      />
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
            mode='date'
            onChange={(event, selectedDate) => {
              const currentDate = selectedDate || dob;
              setShowDate(Platform.OS === "ios");
              setDob(currentDate.toISOString());
            }}
          />
        )}
      </View>
      <AppButton
        title={loading ? <ActivityIndicator animating={loading} /> : "Done"}
        fullWidth
        style={[styles.mv10]}
        onPress={handleUpdateProfileMedia}
      />
      <Modal visible={status === "success"}>
        <View
          style={{
            height: "100%",
            width: "100%",
            backgroundColor: colors.white,
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}>
          <View
            style={{
              width: 113,
              height: 113,
              backgroundColor: colors.successLight,
              borderRadius: 113 / 2,
              alignItems: "center",
              justifyContent: "center",
            }}>
            <Ionicons
              name='checkmark'
              size={(113 * 2) / 3}
              color={colors.success}
            />
          </View>
          <AppText
            size='16'
            style={[
              {
                color: colors.black,
                fontWeight: "bold",
                textAlign: "center",
              },
              styles.mv10,
            ]}>
            Voters ID Verified!
          </AppText>
          {/* <AppText
            size='input'
            style={[{ color: colors.light, textAlign: "center" }]}>
            It usuallt take less than a day to complete this process.
          </AppText> */}
          <View
            style={[{ width: "100%", padding: 16 }, styles.floatActionButton]}>
            <AppButton
              title='Go to next step'
              onPress={() => {
                setStatus("complete");
                props.navigation.goBack();
              }}
              fullWidth
            />
            <AppButton
              title='Go to account status'
              secondary
              onPress={() => {
                setStatus("complete");
                props.navigation.goBack();
              }}
              fullWidth
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  avatar: {
    width: "100%",
    height: 200,
    backgroundColor: colors.greyBg,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  avatarSmall: {
    width: 43,
    height: 43,
    backgroundColor: colors.success,
    borderRadius: 43 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarCamera: {
    width: 60,
    height: 60,
    backgroundColor: colors.secondary,
    borderRadius: 60 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  camera: { width: "100%", height: "60%" },
  cameraBox: { width: "100%", height: 300, position: "relative" },
  closeIcon: {
    position: "absolute",
    right: 16,
    top: 16,
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  container: {
    padding: 16,
    backgroundColor: colors.white,
    paddingBottom: 200,
  },
  floatActionButton: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
    padding: 16,
  },
  floatCameraButton: {
    position: "absolute",
    bottom: 43 / 2,
    zIndex: 2,
  },
  floatBottom: {
    position: "absolute",
    bottom: 43 / 2,
    right: 229 / 8 - 43 / 2,
  },
  flipCamera: {
    position: "absolute",
    left: 16,
    top: 16,
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  mv10: { marginVertical: 10 },
});
export default VerifyVID;
