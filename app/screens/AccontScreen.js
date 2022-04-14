/** @format */

import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
  ImageBackground,
  Alert,
} from "react-native";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import AppTextInput from "../components/AppTextInput";
import colors from "../config/colors";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import AuthContext from "../contexts/auth";
import showToast from "../config/showToast";
import authApi from "../api/auth";
import * as ImagePicker from "expo-image-picker";
import useAuth from "../auth/useAuth";

function AccontScreen(props) {
  const [date, setDate] = useState(new Date());
  const { user, setUser } = useContext(AuthContext);

  const { saveUser } = useAuth();
  // storeUser

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [homeAddress, setHomeAddress] = useState("");

  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (data) => {
    setLoading(true);
    const result = await authApi.updateProfile(data);

    if (result.data && result.data.error) {
      setLoading(false);
      return showToast(result.data.message);
    }
    if (result.error) {
      setLoading(false);
      return showToast(result.message);
    }
    setLoading(false);
    setUser(result.data);
    await saveUser(result.data);
    showToast("Profile Updated!");
    props.navigation.goBack();
  };

  const updateProfilePhoto = async () => {
    if (user.profilePhoto) {
      Alert.alert(
        "Update Profle Photo?",
        "Do you want to change your Profle Photo?",
        [
          {
            text: "No",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: async () => {
              let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
              }).catch((err) => {});
              if (!result?.cancelled) {
                let localUri = result.uri;
                let filename = localUri.split("/").pop();

                let match = /\.(\w+)$/.exec(filename);
                let type = match ? `image/${match[1]}` : `image`;
                const formData = new FormData();
                formData.append("profilePhoto", {
                  uri: localUri,
                  name: filename,
                  type,
                });

                handleUpdateProfileMedia(formData);
              }
            },
          },
        ]
      );
    } else {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      }).catch((err) => {});

      if (!result.cancelled) {
        let localUri = result.uri;
        let filename = localUri.split("/").pop();

        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;
        const formData = new FormData();
        formData.append("profilePhoto", {
          uri: localUri,
          name: filename,
          type,
        });

        handleUpdateProfileMedia(formData);
      }
    }
  };
  const handleUpdateProfileMedia = async (data) => {
    setLoading(true);
    const result = await authApi.updateProfileMedia(data);

    setLoading(false);
    if (result.data && result.data.error) {
      return showToast("Error Updating Profile!");
    }
    if (result.error) {
      return showToast("Error Updating Profile!");
    }
    if (result.data) {
      setUser(result.data);
      await saveUser(result.data);
      return showToast("Profile Updated!");
    } else {
      return showToast("Couldn't Update Profile!");
    }
  };

  const [show, setShow] = useState(false);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : ""}
        style={styles.container}>
        {loading && (
          <ActivityIndicator animating={loading} color={colors.primary} />
        )}
        {!user.profilePhoto || user.profilePhoto === "" ? (
          <View style={styles.avatar}>
            {!user.profilePhoto && (
              <Feather color={colors.white} size={(93 * 2) / 3} name='user' />
            )}
            <Pressable
              style={[
                styles.avatarSmall,
                { position: "absolute", top: 0, right: 0 },
              ]}
              onPress={updateProfilePhoto}>
              <Feather
                color={colors.secondary}
                size={(20 * 2) / 3}
                name='edit-3'
              />
            </Pressable>
          </View>
        ) : (
          <ImageBackground
            style={styles.avatar}
            source={{ uri: user.profilePhoto }}
            borderRadius={93 / 2}>
            {!user.profilePhoto && (
              <Feather color={colors.white} size={(93 * 2) / 3} name='user' />
            )}
            <Pressable
              style={[
                styles.avatarSmall,
                { position: "absolute", top: 0, right: 0 },
              ]}
              onPress={updateProfilePhoto}>
              <Feather
                color={colors.secondary}
                size={(20 * 2) / 3}
                name='edit-3'
              />
            </Pressable>
          </ImageBackground>
        )}

        <AppTextInput
          title='First Name'
          defaultValue={user.firstName}
          onChangeText={(text) => {
            setFirstName(text);
          }}
        />
        <AppTextInput
          title='Last Name'
          defaultValue={user.lastName}
          onChangeText={(text) => {
            setLastName(text);
          }}
        />
        <View style={styles.mb16}>
          <AppText
            size='medium'
            fontWeight='medium'
            style={[styles.title, styles.mb8]}
            defaultValue={user.dob}
            onChangeText={(text) => {
              setDob(text);
            }}>
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
            onPress={() => setShow(true)}>
            <AppText>{user.dob && new Date(user.dob).toDateString()}</AppText>
          </Pressable>
          {show && (
            <DateTimePicker
              testID='dateTimePicker'
              value={dob || date}
              mode='date'
              onChange={(event, selectedDate) => {
                const currentDate = selectedDate || date;
                setShow(Platform.OS === "ios");

                setDob(currentDate);
              }}
            />
          )}
        </View>

        <AppTextInput
          title='Phone Number'
          keyboardType='number-pad'
          returnKeyType='done'
          defaultValue={user.phoneNumber}
          onChangeText={(text) => {
            setPhoneNumber(text);
          }}
        />
        <AppTextInput
          title='Email Address'
          keyboardType='email-address'
          autoComplete='email'
          defaultValue={user.email}
          onChangeText={(text) => {
            setEmail(text);
          }}
        />
        <AppTextInput
          title='Home Address'
          onChangeText={(text) => {
            setHomeAddress(text);
          }}
        />

        <AppButton
          title={loading ? <ActivityIndicator animating={loading} /> : "Save"}
          fullWidth
          style={[styles.mtAuto, styles.mb16]}
          disabled={loading}
          onPress={() => {
            // showToast("Nothing happened!");

            if (
              firstName ||
              lastName ||
              dob ||
              phoneNumber ||
              email ||
              homeAddress
            ) {
              const data = {};
              if (firstName) {
                data.firstName = firstName;
              }
              if (lastName) {
                data.lastName = lastName;
              }
              if (dob) {
                data.dob = dob;
              }
              if (phoneNumber) {
                data.phoneNumber = phoneNumber;
              }
              if (email) {
                data.email = email;
              }
              if (homeAddress) {
                data.homeAddress = homeAddress;
              }
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
              }, 2000);
              showToast("Changes made!");
              handleUpdateProfile(data);
            } else {
              showToast("No changes made!");
              props.navigation.goBack();
            }
          }}
        />
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  avatar: {
    width: 93,
    height: 93,
    backgroundColor: colors.secondary,
    borderRadius: 93 / 2,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 30,
  },
  avatarSmall: {
    width: 30,
    height: 30,
    backgroundColor: colors.white,
    borderRadius: 30 / 2,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  bold: { fontWeight: "bold" },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.white,
    paddingBottom: 32,
    paddingTop: 0,
  },
  fs18: { fontSize: 18 },
  light: { color: colors.light },
  mb8: { marginBottom: 8 },
  mb16: { marginBottom: 16 },
  mb32: { marginBottom: 32 },
  mh16: { marginHorizontal: 16 },
  mtAuto: { marginTop: "auto" },
  primary: { color: colors.primary },
  title: { fontSize: 13, color: colors.title },
});
export default AccontScreen;
