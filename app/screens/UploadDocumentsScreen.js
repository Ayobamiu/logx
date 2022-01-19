/** @format */

import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons, Fontisto } from "@expo/vector-icons";
import AppText from "../components/AppText";
import colors from "../config/colors";
import * as DocumentPicker from "expo-document-picker";
import showToast from "../config/showToast";
import authApi from "../api/auth";
import AuthContext from "../contexts/auth";
import useAuth from "../auth/useAuth";

function UploadDocumentsScreen(props) {
  const [nationalId, setNationalId] = useState(null);
  const [votersCard, setVotersCard] = useState(null);
  const [internationalPassport, setInternationalPassport] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useContext(AuthContext);
  const { saveUser } = useAuth();
  const handleUpdateProfileMedia = async (data) => {
    setLoading(true);
    const result = await authApi.updateProfileMedia(data);

    if (result.data.error) {
      setLoading(false);
      return showToast(result.data.message);
    }
    if (result.error) {
      setLoading(false);
      return showToast(result.message);
    }
    setLoading(false);
    await saveUser(result.data);
    showToast("Now sit back and relax, We will review your document!");
    props.navigation.goBack();
  };
  const handleUpdateProfile = async (data) => {
    setLoading(true);
    const result = await authApi.updateProfile(data);

    if (result.data.error) {
      setLoading(false);
      return showToast(result.data.message);
    }
    if (result.error) {
      setLoading(false);
      return showToast(result.message);
    }
    setLoading(false);
    await saveUser(result.data);
    showToast("Profile Updated!");
    props.navigation.goBack();
  };

  const uploadNIN = async () => {
    if (user.ninSlip) {
      Alert.alert(
        "You have uploaded your NIN Slip",
        "Do you want to change your NIN Slip?",
        [
          {
            text: "No",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: async () => {
              props.navigation.navigate("UploadNINScreen");
            },
          },
        ]
      );
    } else {
      props.navigation.navigate("UploadNINScreen");
    }
  };
  const uploadLicense = async () => {
    if (user.driversLicense) {
      Alert.alert(
        "You have uploaded your drivers License",
        "Do you want to change your drivers License?",
        [
          {
            text: "No",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: async () => {
              props.navigation.navigate("UploadLicenseScreen");
            },
          },
        ]
      );
    } else {
      props.navigation.navigate("UploadLicenseScreen");
    }
  };
  const uploadNationalId = async () => {
    if (user.nationalId) {
      Alert.alert(
        "You have uploaded your National ID?",
        "Do you want to change your National ID?",
        [
          {
            text: "No",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: async () => {
              const file = await DocumentPicker.getDocumentAsync({
                type: "application/pdf",
              });
              if (file.type === "success") {
                let { name, size, uri } = file;
                let nameParts = name.split(".");
                let fileType = nameParts[nameParts.length - 1];
                var fileToUpload = {
                  name: name,
                  size: size,
                  uri: uri,
                  type: "application/" + fileType,
                };
                const formData = new FormData();
                formData.append("nationalId", fileToUpload);
                handleUpdateProfileMedia(formData);
              }
            },
          },
        ]
      );
    } else {
      const file = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });
      if (file.type === "success") {
        let { name, size, uri } = file;
        let nameParts = name.split(".");
        let fileType = nameParts[nameParts.length - 1];
        var fileToUpload = {
          name: name,
          size: size,
          uri: uri,
          type: "application/" + fileType,
        };
        const formData = new FormData();
        formData.append("nationalId", fileToUpload);
        handleUpdateProfileMedia(formData);
      }
    }
  };
  const uploadVotersCard = async () => {
    if (user.votersCard) {
      Alert.alert(
        "You have uploaded your Voter's Card?",
        "Do you want to change your Voter's Card?",
        [
          {
            text: "No",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: async () => {
              const file = await DocumentPicker.getDocumentAsync({
                type: "application/pdf",
              });
              if (file.type === "success") {
                let { name, size, uri } = file;
                let nameParts = name.split(".");
                let fileType = nameParts[nameParts.length - 1];
                var fileToUpload = {
                  name: name,
                  size: size,
                  uri: uri,
                  type: "application/" + fileType,
                };
                const formData = new FormData();
                formData.append("votersCard", fileToUpload);
                handleUpdateProfileMedia(formData);
              }
            },
          },
        ]
      );
    } else {
      const file = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });
      if (file.type === "success") {
        let { name, size, uri } = file;
        let nameParts = name.split(".");
        let fileType = nameParts[nameParts.length - 1];
        var fileToUpload = {
          name: name,
          size: size,
          uri: uri,
          type: "application/" + fileType,
        };
        const formData = new FormData();
        formData.append("votersCard", fileToUpload);
        handleUpdateProfileMedia(formData);
      }
    }
  };
  const uploadInternationalPassport = async () => {
    if (user.internationalPassport) {
      Alert.alert(
        "You have uploaded your International Passport?",
        "Do you want to change your International Passport?",
        [
          {
            text: "No",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: async () => {
              const file = await DocumentPicker.getDocumentAsync({
                type: "application/pdf",
              });
              if (file.type === "success") {
                let { name, size, uri } = file;
                let nameParts = name.split(".");
                let fileType = nameParts[nameParts.length - 1];
                var fileToUpload = {
                  name: name,
                  size: size,
                  uri: uri,
                  type: "application/" + fileType,
                };
                const formData = new FormData();
                formData.append("internationalPassport", fileToUpload);
                handleUpdateProfileMedia(formData);
              }
            },
          },
        ]
      );
    } else {
      const file = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });
      if (file.type === "success") {
        let { name, size, uri } = file;
        let nameParts = name.split(".");
        let fileType = nameParts[nameParts.length - 1];
        var fileToUpload = {
          name: name,
          size: size,
          uri: uri,
          type: "application/" + fileType,
        };
        const formData = new FormData();
        formData.append("internationalPassport", fileToUpload);
        handleUpdateProfileMedia(formData);
      }
    }
  };
  const removeVoterscard = () => {
    Alert.alert(
      "Delete File",
      "Do you want to delete your Voter's Card file?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            handleUpdateProfile({ votersCard: "" });
          },
        },
      ]
    );
  };
  const removeNIN = () => {
    Alert.alert("Delete File", "Do you want to delete your NIN Slip file?", [
      {
        text: "No",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => handleUpdateProfile({ ninSlip: "" }),
      },
    ]);
  };
  const removeNID = () => {
    Alert.alert("Delete File", "Do you want to delete your National ID file?", [
      {
        text: "No",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => handleUpdateProfile({ nationalId: "" }),
      },
    ]);
  };
  const removeLicense = () => {
    Alert.alert(
      "Delete File",
      "Do you want to delete your driver's License file?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => handleUpdateProfile({ driversLicense: "" }),
        },
      ]
    );
  };
  const removeInPss = () => {
    Alert.alert(
      "Delete File",
      "Do you want to delete your International Passport file?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => handleUpdateProfile({ internationalPassport: "" }),
        },
      ]
    );
  };

  const VerificationItem = ({
    onPress,
    title,
    uploaded = false,
    onDelete,
    status,
  }) => {
    return (
      <Pressable
        onPress={onPress}
        style={[
          styles.row,
          {
            borderBottomColor: colors.light,
            borderBottomWidth: 1,
            paddingVertical: 16,
          },
        ]}>
        <View>
          <AppText size='16' style={[styles.mh10]}>
            {title}
          </AppText>
          {uploaded && status === "pending" ? (
            <View
              style={{
                backgroundColor: colors.opaquePrimary,
                borderRadius: 20,
                padding: 3,
                width: "auto",
              }}>
              <AppText
                size='16'
                style={[styles.mh10, { color: colors.primary }]}>
                Verification ongoing
              </AppText>
            </View>
          ) : null}
          {uploaded && status === "failed" ? (
            <View
              style={{
                backgroundColor: colors.dangerLight,
                borderRadius: 20,
                padding: 3,
                width: "auto",
              }}>
              <AppText
                size='16'
                style={[styles.mh10, { color: colors.danger }]}>
                Verification failed
              </AppText>
            </View>
          ) : null}
          {uploaded && status === "success" ? (
            <View
              style={{
                backgroundColor: colors.successLight,
                borderRadius: 20,
                padding: 3,
                width: "auto",
              }}>
              <AppText
                size='16'
                style={[styles.mh10, { color: colors.success }]}>
                Verification Successful
              </AppText>
            </View>
          ) : null}
        </View>
        <View style={[styles.row, { marginLeft: "auto" }]}>
          {uploaded ? (
            <Pressable onPress={onDelete} style={[styles.mh10]}>
              <Ionicons
                color={colors.danger}
                size={25}
                name='ios-close-circle'
              />
            </Pressable>
          ) : null}
          {uploaded ? (
            <View style={[styles.avatarSmall]}>
              <Ionicons color={colors.white} size={20} name='checkmark' />
            </View>
          ) : null}
          <Fontisto
            name='angle-right'
            size={16}
            color={colors.black}
            style={[styles.mh10]}
          />
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <VerificationItem
        title='Driver’s License'
        onPress={uploadLicense}
        uploaded={user.driversLicense}
        onDelete={removeLicense}
        status={user.driversLicenseVerificationStatus}
      />
      <VerificationItem
        title='National ID Card'
        uploaded={user.nationalId}
        onPress={uploadNationalId}
        onDelete={removeNID}
        status={user.nationalIdVerificationStatus}
      />
      <VerificationItem
        title='Voter’s card'
        onPress={uploadVotersCard}
        uploaded={user.votersCard}
        onDelete={removeVoterscard}
        status={user.votersCardVerificationStatus}
      />
      <VerificationItem
        title='Valid Passport'
        uploaded={user.internationalPassport}
        onPress={uploadInternationalPassport}
        onDelete={removeInPss}
        status={user.internationalPassportVerificationStatus}
      />
      <VerificationItem
        title='NIN Slip'
        onPress={uploadNIN}
        uploaded={user.ninSlip}
        onDelete={removeNIN}
        status={user.ninSlipVerificationStatus}
      />
      <ActivityIndicator animating={loading} color={colors.primary} />
    </View>
  );
}
const styles = StyleSheet.create({
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 55 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarSmall: {
    width: 20,
    height: 20,
    backgroundColor: colors.success,
    borderRadius: 20 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  bold: { fontWeight: "bold" },
  container: { padding: 16, backgroundColor: colors.white, flex: 1 },
  mh10: { marginHorizontal: 10 },
  row: {
    alignItems: "center",
    flexDirection: "row",
  },
});
export default UploadDocumentsScreen;
