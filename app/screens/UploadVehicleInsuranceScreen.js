/** @format */

import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Pressable,
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import colors from "../config/colors";
import { Ionicons } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import authApi from "../api/auth";
import showToast from "../config/showToast";
import AuthContext from "../contexts/auth";
import useAuth from "../auth/useAuth";

function UploadVehicleInsuranceScreen(props) {
  const [image, setImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const camera = useRef();
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useContext(AuthContext);
  const { saveUser } = useAuth();

  const handleUpdateProfileMedia = async (data) => {
    setLoading(true);
    const result = await authApi.updateProfileMedia(data);

    setLoading(false);
    setShowModal(false);
    if (result.data && result.data.error) {
      return showToast(result.data.message);
    }
    if (result.error) {
      return showToast(result.message);
    }
    if (result.data) {
      await saveUser(result.data);
      showToast("Profile Updated. We will verify soon!");
      return setStatus("success");
      //  props.navigation.goBack();
    } else {
      return showToast("Couldn't Update Profile!");
    }
  };

  const snap = async () => {
    let photo = await camera.current.takePictureAsync();
    setImage(photo);
    // setShowModal(false);
  };
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <AppText>No access to camera</AppText>;
  }
  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <View>
          <AppText
            size='16'
            style={[{ color: colors.black, fontWeight: "bold" }, styles.mv10]}>
            Take a photo of your valid vehicle insurance policy
          </AppText>
          <AppText size='input' style={[{ color: colors.black }, styles.mv10]}>
            Please make sure we can easily read all the details. Check the
            sample below
          </AppText>
        </View>

        <ImageBackground
          style={[styles.avatar, { marginTop: 50 }]}
          source={image}>
          {!image && (
            <Ionicons
              name='md-document-text-outline'
              size={(229 * 2) / 3}
              color={colors.white}
            />
          )}
        </ImageBackground>
      </ScrollView>
      <View style={[{ width: "100%" }, styles.floatActionButton]}>
        {!image ? (
          <AppButton
            title='Take photo '
            onPress={() => setShowModal(true)}
            fullWidth
          />
        ) : (
          <AppButton
            title='Retake photo '
            onPress={() => setShowModal(true)}
            fullWidth
          />
        )}
      </View>
      <Modal visible={showModal}>
        <View
          style={{
            height: "100%",
            width: "100%",
            backgroundColor: colors.black,
            alignItems: "center",
            justifyContent: "center",
          }}>
          <Pressable
            onPress={() => {
              setShowModal(false);
              setImage(null);
            }}
            style={styles.closeIcon}>
            <Ionicons name='close' size={(50 * 2) / 3} color={colors.white} />
          </Pressable>
          {/* <TouchableOpacity
            style={styles.flipCamera}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
              setImage(null);
            }}
          >
            <Ionicons
              name="ios-camera-reverse"
              size={(50 * 2) / 3}
              color={colors.white}
            />
          </TouchableOpacity> */}
          {!image ? (
            <Camera
              style={styles.camera}
              type={type}
              ref={camera}
              onCameraReady={() => {}}></Camera>
          ) : (
            <ImageBackground
              style={styles.camera}
              source={image}></ImageBackground>
          )}
          {!image ? (
            <Pressable
              style={[
                styles.avatarCamera,
                styles.floatCameraButton,
                { alignSelf: "center" },
              ]}
              onPress={() => {
                snap();
              }}>
              <Ionicons
                name='camera'
                size={(43 * 2) / 3}
                color={colors.white}
              />
            </Pressable>
          ) : (
            <View
              style={[
                {
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-around",
                },
                styles.floatCameraButton,
              ]}>
              <Pressable
                style={[styles.avatarCamera]}
                onPress={() => {
                  setImage(null);
                }}>
                <Ionicons
                  name='close'
                  size={(43 * 2) / 3}
                  color={colors.white}
                />
              </Pressable>
              <Pressable
                style={[styles.avatarCamera]}
                onPress={() => {
                  const formData = new FormData();
                  formData.append("insurancePolicy", {
                    ...image,
                    name: `image${Math.random() * 10000}.jpg`,
                  });
                  handleUpdateProfileMedia(formData);
                }}>
                {loading ? (
                  <ActivityIndicator
                    animating={loading}
                    color={colors.primary}
                  />
                ) : (
                  <Ionicons
                    name='checkmark'
                    size={(43 * 2) / 3}
                    color={colors.success}
                  />
                )}
              </Pressable>
            </View>
          )}
        </View>
      </Modal>
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
            We are reviewing your document
          </AppText>
          <AppText
            size='input'
            style={[{ color: colors.light, textAlign: "center" }]}>
            It usuallt take less than a day to complete this process.
          </AppText>
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
export default UploadVehicleInsuranceScreen;
