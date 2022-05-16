// /** @format */

// import "react-native-gesture-handler";
// import React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import AuthNavigator from "./app/routes/AuthNavigator";
// import AuthContext from "./app/contexts/auth";
// import DrawerNavigator from "./app/routes/DrawerNavigator";
// import { RootSiblingParent } from "react-native-root-siblings";
// import AppLoading from "expo-app-loading";
// import authStorage from "./app/auth/storage";
// import ModeContext from "./app/contexts/mode";
// import PackageContext from "./app/contexts/package";
// import TripContext from "./app/contexts/trip";
// import TripsContext from "./app/contexts/trips";
// import TripRequestsContext from "./app/contexts/tripRequests";
// import { navigationRef } from "./app/routes/rootNavigation";
// import { get } from "./app/utility/cache";
// import OnlineStatusContext from "./app/contexts/onlineStatus";
// import NotificationContext from "./app/contexts/notifications";
// import TransactionContext from "./app/contexts/transactions";
// import socket from "./app/api/socket";
// import useLocation from "./app/hooks/useLocation";
// import Constants from "expo-constants";
// import { PubNubProvider } from "pubnub-react";
// import PubNub from "pubnub";

// export default function App() {
//   // Prevent native splash screen from autohiding before App component declaration
//   // SplashScreen.preventAutoHideAsync()
//   //   .then((result) => {})
//   //   .catch(console.warn); // it's good to explicitly catch and inspect any error
//   const { location } = useLocation();

//   const [user, setUser] = React.useState(null);
//   const [mode, setMode] = React.useState("sender");
//   const [isReady, setIsReady] = React.useState(false);
//   const [isOnline, setIsOnline] = React.useState(false);
//   const [packages, setPackages] = React.useState([]);
//   const [transactions, setTransactions] = React.useState([]);
//   const [trips, setTrips] = React.useState([]);
//   const [tripRequests, setTripRequests] = React.useState([]);
//   const [trip, setTrip] = React.useState(null);
//   const [notifications, setNotifications] = React.useState([]);

//   const restoreUser = async () => {
//     const user = await authStorage.getUser().catch((error) => {});
//     if (user) setUser(user);

//     const mode = await get("user:mode");
//     if (mode) setMode(mode);
//     const isOnline = await get("user:onlineStatus");
//     if (isOnline) setIsOnline(isOnline);
//   };

//   if (user) {
//     socket.emit("login:user", {
//       userId: user._id,
//       email: user.email,
//       ratings: user.ratings,
//       trips: user.trips,
//       profilePhoto: user.profilePhoto,
//       name: user.firstName + " " + user.lastName,
//       latitude: location?.coords?.latitude,
//       longitude: location?.coords?.longitude,
//     });
//   }

//   const pubnub = new PubNub({
//     publishKey: "pub-c-1d5192c2-4eb4-4472-92cf-42e1f6b34967",
//     subscribeKey: "sub-c-2b80b93e-82d2-11ec-9f2b-a2cedba671e8",
//     uuid: Constants.sessionId,
//   });

//   const [show, setShow] = React.useState(false);
//   if (!isReady)
//     return (
//       <AppLoading
//         startAsync={restoreUser}
//         onFinish={() => setIsReady(true)}
//         onError={(error) => {
//           console.warn("Error Authenticating");
//         }}
//       />
//     );

//   return (
//     <RootSiblingParent>
//       <PubNubProvider client={pubnub}>
//         <TransactionContext.Provider value={{ transactions, setTransactions }}>
//           <NotificationContext.Provider
//             value={{ notifications, setNotifications }}
//           >
//             <OnlineStatusContext.Provider value={{ isOnline, setIsOnline }}>
//               <TripRequestsContext.Provider
//                 value={{ tripRequests, setTripRequests }}
//               >
//                 <TripsContext.Provider value={{ trips, setTrips }}>
//                   <TripContext.Provider value={{ trip, setTrip }}>
//                     <PackageContext.Provider value={{ packages, setPackages }}>
//                       <ModeContext.Provider value={{ mode, setMode }}>
//                         <AuthContext.Provider value={{ user, setUser }}>
//                           <NavigationContainer ref={navigationRef}>
//                             {user ? <DrawerNavigator /> : <AuthNavigator />}
//                           </NavigationContainer>
//                         </AuthContext.Provider>
//                       </ModeContext.Provider>
//                     </PackageContext.Provider>
//                   </TripContext.Provider>
//                 </TripsContext.Provider>
//               </TripRequestsContext.Provider>
//             </OnlineStatusContext.Provider>
//           </NotificationContext.Provider>
//         </TransactionContext.Provider>
//       </PubNubProvider>
//     </RootSiblingParent>
//   );
// }
// import { StatusBar } from "expo-status-bar";
// import { StyleSheet, Text, View } from "react-native";

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>LogX app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import React, { useState, useEffect, useRef } from "react";
import { Text, View, Button, Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "space-around",
      }}
    >
      <Text>Your expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text>
          Title: {notification && notification.request.content.title}{" "}
        </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>
          Data:{" "}
          {notification && JSON.stringify(notification.request.content.data)}
        </Text>
      </View>
      <Button
        title="Press to schedule a notification"
        onPress={async () => {
          await schedulePushNotification();
        }}
      />
    </View>
  );
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail usman! 📬",
      body: "Here is the notification body",
      data: { data: "goes here" },
    },
    trigger: { seconds: 2 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
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
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
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
