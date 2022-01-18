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

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const {
      status: existingStatus,
    } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync().catch((error) => {}))
      .data;
    await expoPushTokenApi.register(token);
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

export const notifyAboutNewTrip = () => {
  Notifications.scheduleNotificationAsync({
    content: {
      title: "New Trip Available",
      body: "Open App to check New Trip.",
      data: {
        type: "trip:new",
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
    data.forEach((item) => {
      if (new Date(item.timestamp) - new Date() < 1000 * 60 * 60 * 24) {
        dataBack.push(item);
      }
    });
    store("notifications", [...dataBack]);
    setNotifications(dataBack);
  };
  const cacheNotifications = (notification) => {
    store("notifications", [
      { timestamp: Date.now(), data: notification },
      ...notifications,
    ]);
  };
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        cacheNotifications(notification);
      }
    );

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        if (response.notification.request.content.data.type === "trip:code") {
          appNavigation.navigate(
            "CopyTripCodeScreen",
            response.notification.request.content.data
          );
        }
        if (response.notification.request.content.data.type === "trip:status") {
          appNavigation.navigate(
            "TransactionDetailsScreen",
            response.notification.request.content.data
          );
        }
        if (response.notification.request.content.data.type === "trip:new") {
          setMode("driver");
          appNavigation.navigate(
            verified === 2 ? "DeliveryMerchantHomepage" : "DriverSettingsScreen"
          );
        }
      }
    );

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
  return {
    getNotificationsFromCache,
  };
};
// sendNotification();
