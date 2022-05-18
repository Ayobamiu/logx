/** @format */

import * as Notifications from "expo-notifications";
import expoPushTokenApi from "../api/expoPushTokens";
import appNavigation from "../routes/rootNavigation";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { useContext, useEffect, useRef, useState } from "react";
import NotificationContext from "../contexts/notifications";
import { get, store } from "../utility/cache";
import ModeContext from "../contexts/mode";
import AuthContext from "../contexts/auth";

import React from "react";
import messaging from "@react-native-firebase/messaging";
// import auth from "@react-native-firebase/auth";
// import firestore from "@react-native-firebase/firestore";

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync({}).catch((error) => {}))
      .data;
    // await expoPushTokenApi.register(token);

    messaging()
      .getToken()
      .then((token) => {
        console.log("token", token);
        // return expoPushTokenApi.register(token);
      });
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}
export async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: "Here is the notification body",
      data: { data: "goes here" },
    },
    trigger: { seconds: 2 },
  });
}

export const notifyMeIAcceptedATrip = (trip) => {
  Notifications.scheduleNotificationAsync({
    content: {
      title:
        "You have accepted the request, please wait for the sender to confirm.",
      body: "Please wait for the sender to confirm.",
      data: {
        type: "trip:status",
        item: trip,
      },
    },
    trigger: {
      seconds: 2,
    },
  });
};
export const notifyAboutNewTrip = () => {
  Notifications.scheduleNotificationAsync({
    content: {
      title:
        "You have one Delivery request in your location you might be interested in.",
      body: "Open App to check details.",
      data: {
        type: "trip:new",
      },
    },
    trigger: {
      seconds: 2,
    },
  });
};
export const aboutMyNewTrip = (name, address, trip) => {
  Notifications.scheduleNotificationAsync({
    content: {
      title: `You just initiated a transaction to deliver package to ${name} at ${address}.`,
      body: "You will be paired with a delivery personnel in a jiffy.",
      data: {
        type: "trip:status",
        item: trip,
      },
    },
    trigger: {
      seconds: 2,
    },
  });
};
export const sendNotification = () => {
  Notifications.scheduleNotificationAsync({
    content: {
      title: "Time's up!",
      body: "Change sides!",
      data: { name: "First name" },
    },
    trigger: {
      seconds: 2,
    },
  });
};

export default useNotification = () => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const { notifications, setNotifications } = useContext(NotificationContext);
  const { mode, setMode } = useContext(ModeContext);
  const { user } = useContext(AuthContext);

  let verified = 0;
  if (user.verificationPhoto) {
    verified += 1;
  }
  if (user.nationalId || user.votersCard || user.internationalPassport) {
    verified += 1;
  }

  const notificationListener = useRef();
  const responseListener = useRef();
  const getNotificationsFromCache = async () => {
    const data = await get("notifications");
    const dataBack = [];
    data?.forEach((item) => {
      if (
        new Date() - new Date(item.timestamp) < 1000 * 60 * 60 * 12 &&
        new Date() - new Date(item.timestamp) >= 0
      ) {
        dataBack.push(item);
      }
    });
    store("notifications", [...dataBack]);
    setNotifications(dataBack);
  };

  const removeAllChatRelated = async (id) => {
    const data = await get("notifications");
    store(
      "notifications",
      data.filter(
        (notification) =>
          !(
            notification.data.request.content.data?.type === "chat:new" &&
            notification.data.request.content.data.trip === id
          )
      )
    );
    setNotifications(
      data.filter(
        (notification) =>
          !(
            notification.data.request.content.data?.type === "chat:new" &&
            notification.data.request.content.data.trip === id
          )
      )
    );
  };
  const markAllAsSeen = async () => {
    const data = await get("notifications");
    store(
      "notifications",
      data.map((i) => {
        return {
          ...i,
          seen: true,
        };
      })
    );
    setNotifications(
      data.map((i) => {
        return {
          ...i,
          seen: true,
        };
      })
    );
  };
  const cacheNotifications = async (notification) => {
    const data = await get("notifications");
    store("notifications", [
      { timestamp: Date.now(), data: notification, seen: false },
      ...data,
    ]);
    setNotifications([
      { timestamp: Date.now(), data: notification, seen: false },
      ...data,
    ]);
  };

  useEffect(() => {
    let mounted = true;
    getNotificationsFromCache();
    registerForPushNotificationsAsync().then((token) => {
      if (mounted) {
        setExpoPushToken(token);
      }
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        cacheNotifications(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        if (response.notification.request.content.data) {
          if (
            response.notification.request.content.data?.type === "trip:code"
          ) {
            appNavigation.navigate(
              "CopyTripCodeScreen",
              response.notification.request.content.data
            );
          }
          if (
            response.notification.request.content.data?.type ===
              "trip:status" ||
            response.notification.request.content.data?.type ===
              "trip:time:request"
          ) {
            if (response.notification.request.content.data.item) {
              appNavigation.navigate(
                "TransactionDetailsScreen",
                response.notification.request.content.data
              );
            } else {
              appNavigation.navigate("NotificationsScreen");
            }
          }
          if (response.notification.request.content.data?.type === "trip:new") {
            setMode("driver");
            appNavigation.navigate(
              verified === 2
                ? "DeliveryMerchantHomepage"
                : "DriverSettingsScreen"
            );
          }
          if (response.notification.request.content.data?.type === "bid:new") {
            appNavigation.navigate("TransactionDetailsScreen", {
              item: response.notification.request.content.data.trip,
            });
          }
          if (
            response.notification.request.content.data?.type ===
            "transaction:update"
          ) {
            appNavigation.navigate(
              "TransactionDetails",
              response.notification.request.content.data.transaction
            );
          }
          if (response.notification.request.content.data?.type === "chat:new") {
            appNavigation.navigate("ChatScreen", {
              tripId: response.notification.request.content.data.trip,
            });
          }
          if (
            response.notification.request.content.data?.type === "trip:invite"
          ) {
            appNavigation.navigate("NotificationsScreen");
          }
        }
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
      mounted = false;
    };
  }, []);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
  return {
    getNotificationsFromCache,
    markAllAsSeen,
    removeAllChatRelated,
  };
};
// sendNotification();
