import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Pressable,
  Modal,
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

function UploadPictureScreen(props) {
  const [image, setImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const camera = useRef(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useContext(AuthContext);
  const { saveUser } = useAuth();

  const handleUpdateProfileMedia = async (data) => {
    setLoading(true);
    const result = await authApi.updateProfileMedia(data);

    setLoading(false);
    if (result.data && result.data.error) {
      return showToast(result.data.message);
    }
    if (result.error) {
      return showToast(result.message);
    }
    if (result.data) {
      await saveUser(result.data);
      showToast("Profile Updated. We will verify soon!");
      return props.navigation.goBack();
    } else {
      return showToast("Couldn't Update Profile!");
    }
  };

  const snap = async () => {
    let photo = await camera.current.takePictureAsync();
    setImage(photo);
    setShowModal(false);
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
    <View style={styles.container}>
      <AppText size="input" style={{ color: colors.light }}>
        Take a selfie to verify yourself. Don’t worry this photo will not appear
        on your profile.
      </AppText>
      <Modal visible={showModal}>
        <View style={{ flex: 1, backgroundColor: colors.greyBg }}>
          <Pressable
            onPress={() => {
              setShowModal(false);
            }}
            style={styles.closeIcon}
          >
            <Ionicons name="close" size={25} />
          </Pressable>
          <Camera
            style={StyleSheet.absoluteFillObject}
            type={type}
            ref={camera}
            // onCameraReady={() => {}}
          >
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.flipCamera}
                onPress={() => {
                  setType(
                    type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  );
                }}
              >
                <Ionicons
                  name="ios-camera-reverse"
                  size={(50 * 2) / 3}
                  color={colors.white}
                />
              </TouchableOpacity>
            </View>
          </Camera>
          <Pressable
            style={[styles.avatarCamera, styles.floatCameraButton]}
            onPress={() => {
              snap();
            }}
          >
            <Ionicons name="camera" size={(50 * 2) / 3} color={colors.white} />
          </Pressable>
        </View>
      </Modal>

      <ImageBackground
        borderRadius={(229 * 2) / 3}
        style={styles.avatar}
        source={image && image.uri ? image : { uri: image }}
      >
        {!image && (
          <Ionicons name="camera" size={(229 * 2) / 3} color={colors.white} />
        )}
        {image && (
          <View style={[styles.avatarSmall, styles.floatBottom, { zIndex: 3 }]}>
            <Ionicons
              name="checkmark"
              size={(43 * 2) / 3}
              color={colors.white}
            />
          </View>
        )}
      </ImageBackground>

      <View style={{ width: "100%" }}>
        {image ? (
          <View>
            <AppButton
              title={
                loading ? <ActivityIndicator animating={loading} /> : "Continue"
              }
              disabled={loading}
              onPress={() => {
                const formData = new FormData();
                formData.append("verificationPhoto", {
                  ...image,
                  name: `image${Math.random() * 10000}.jpg`,
                });
                handleUpdateProfileMedia(formData);
              }}
            />
            <AppButton
              title="Retake photo"
              secondary
              onPress={() => setShowModal(true)}
            />
          </View>
        ) : (
          <AppButton title="Take photo " onPress={() => setShowModal(true)} />
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  avatar: {
    width: 229,
    height: 229,
    backgroundColor: colors.greyBg,
    borderRadius: 229 / 2,
    alignItems: "center",
    justifyContent: "center",
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
  camera: { flex: 1 },
  cameraBox: { width: "100%", height: 300, position: "relative" },
  closeIcon: {
    position: "absolute",
    right: 16,
    top: 16,
    width: 30,
    height: 30,
    backgroundColor: colors.white,
    borderRadius: 30 / 2,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  flipCamera: {
    position: "absolute",
    left: 16,
    top: 16,
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  container: {
    padding: 16,
    backgroundColor: colors.white,
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  floatCameraButton: {
    position: "absolute",
    bottom: 50 / 2,
    alignSelf: "center",
    zIndex: 2,
  },
  floatBottom: {
    position: "absolute",
    bottom: 43 / 2,
    right: 229 / 8 - 43 / 2,
  },
});
export default UploadPictureScreen;
