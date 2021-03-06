/** @format */

import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import colors from "../config/colors";
import HomeScreen from "../screens/HomeScreen";
import EnterLocationScreen from "../screens/EnterLocationScreen";
import AddPackageScreen from "../screens/AddPackageScreen";
import PackageSummaryScreen from "../screens/PackageSummaryScreen";
import AvailableDrivers from "../screens/AvailableDrivers";
import DriverProfileScreen from "../screens/DriverProfileScreen";
import PackageSummaryScreenNew from "../screens/PackageSummaryScreenNew";
import TransactionDetailsScreen from "../screens/TransactionDetailsScreen";
import ChatScreen from "../screens/ChatScreen";
import VerificationScreen from "../screens/VerificationScreen";
import UploadPictureScreen from "../screens/UploadPictureScreen";
import UploadDocumentsScreen from "../screens/UploadDocumentsScreen";
import DriverSettingsScreen from "../screens/DriverSettingsScreen";
import UploadLicenseScreen from "../screens/UploadLicenseScreen";
import AddDriverDetailsScreen from "../screens/AddDriverDetailsScreen";
import DeliveryMerchantHomepage from "../screens/DeliveryMerchantHomepage";
import MarketScreen from "../screens/MarketScreen";
import MyEarningsScreen from "../screens/MyEarningsScreen";
import ReviewsScreen from "../screens/ReviewsScreen";
import UploadVehicleInsuranceScreen from "../screens/UploadVehicleInsuranceScreen";
import LegalScreen from "../screens/LegalScreen";
import SafetyAndSecurityScreen from "../screens/SafetyAndSecurityScreen";
import ModeContext from "../contexts/mode";
import CopyTripCodeScreen from "../screens/CopyTripCodeScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import PaymentHistoryScreen from "../screens/PaymentHistoryScreen";
import WithdrawalScreen from "../screens/WithdrawalScreen";
import AddBankRecordScreen from "../screens/AddBankRecordScreen";
import AuthContext from "../contexts/auth";
import SelectJourneyType from "../screens/SelectJourneyType";
import UploadNINScreen from "../screens/UploadNINScreen";
import VerifyLicencse from "../screens/VerifyLicencse";
import VerifyNID from "../screens/VerifyNID";
import VerifyVID from "../screens/VerifyVID";
import TransactionDetails from "../screens/TransactionDetails";
import Tracker from "../screens/TrackerScreen";
import Trackee from "../screens/TestLocation";

const Stack = createStackNavigator();

function HomeNavigator() {
  const { user } = useContext(AuthContext);

  const { mode } = useContext(ModeContext);
  const aboutMeVerified =
    user.firstName && user.lastName && user.phoneNumber && user.deliveryType;

  const idVerified =
    user.driversLicenseVerificationStatus === "success" ||
    user.ninSlipVerificationStatus === "success" ||
    user.internationalPassportVerificationStatus === "success" ||
    user.nationalIdVerificationStatus === "success" ||
    user.votersCardVerificationStatus === "success";
  let verified = 0;
  if (aboutMeVerified) {
    verified += 1;
  }
  if (idVerified) {
    verified += 1;
  }
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.greyBg,
          elevation: 0,
        },
        tabBarStyle: { display: false },
      }}
      // initialRouteName="CopyTripCodeScreen"
    >
      <Stack.Screen
        name='Home'
        component={
          mode === "sender"
            ? HomeScreen
            : verified === 2
            ? DeliveryMerchantHomepage
            : DriverSettingsScreen
        }
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: colors.white,
            elevation: 0,
          },
        }}
      />
      <Stack.Screen
        name='Trackee'
        component={Trackee}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='Tracker'
        component={Tracker}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='DeliveryMerchantHomepage'
        component={DeliveryMerchantHomepage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='SelectJourneyType'
        component={SelectJourneyType}
        options={{ headerShown: false, title: "Select Journey Type" }}
      />
      <Stack.Screen
        name='EnterLocationScreen'
        component={EnterLocationScreen}
        options={{ title: "" }}
      />
      <Stack.Screen
        name='AddPackageScreen'
        component={AddPackageScreen}
        options={{
          title: "",
          headerStyle: {
            backgroundColor: colors.white,
            elevation: 0,
          },
        }}
      />
      <Stack.Screen
        name='AddDriverDetailsScreen'
        component={AddDriverDetailsScreen}
        options={{
          title: "",
          headerStyle: {
            backgroundColor: colors.white,
            elevation: 0,
          },
        }}
      />
      <Stack.Screen name='ChatScreen' component={ChatScreen} />
      <Stack.Screen
        name='PackageSummaryScreen'
        component={PackageSummaryScreen}
        options={{
          title: "",
          headerStyle: {
            backgroundColor: colors.white,
            elevation: 0,
          },
        }}
      />
      <Stack.Screen
        name='MyEarningsScreen'
        component={MyEarningsScreen}
        options={{
          title: "",
          headerStyle: {
            backgroundColor: colors.white,
            elevation: 0,
          },
        }}
      />
      <Stack.Screen
        name='ReviewsScreen'
        component={ReviewsScreen}
        options={{
          title: "",
          headerStyle: {
            backgroundColor: colors.white,
            elevation: 0,
          },
        }}
      />
      <Stack.Screen
        name='LegalScreen'
        component={LegalScreen}
        options={{
          title: "Legal",
          headerStyle: {
            backgroundColor: colors.white,
            elevation: 0,
          },
        }}
      />
      <Stack.Screen
        name='SafetyAndSecurityScreen'
        component={SafetyAndSecurityScreen}
        options={{
          title: "Safety And Security",
          headerStyle: {
            backgroundColor: colors.white,
            elevation: 0,
          },
        }}
      />
      <Stack.Screen
        name='MarketScreen'
        component={MarketScreen}
        options={{
          title: "",
          headerStyle: {
            backgroundColor: colors.white,
            elevation: 0,
          },
        }}
      />
      <Stack.Screen
        name='VerificationScreen'
        component={VerificationScreen}
        options={{
          title: "Verification",
          headerStyle: {
            backgroundColor: colors.white,
            elevation: 0,
          },
        }}
      />
      <Stack.Screen
        name='UploadDocumentsScreen'
        component={UploadDocumentsScreen}
        options={{
          title: "Choose  available  document",
          headerStyle: {
            backgroundColor: colors.white,
            elevation: 0,
          },
        }}
      />
      <Stack.Screen
        name='UploadNINScreen'
        component={UploadNINScreen}
        options={{
          title: "",
          headerStyle: {
            backgroundColor: colors.white,
            elevation: 0,
          },
        }}
      />
      <Stack.Screen
        name='VerifyVID'
        component={VerifyVID}
        options={{
          title: "",
          headerStyle: {
            backgroundColor: colors.white,
            elevation: 0,
          },
        }}
      />
      <Stack.Screen
        name='VerifyNID'
        component={VerifyNID}
        options={{
          title: "",
          headerStyle: {
            backgroundColor: colors.white,
            elevation: 0,
          },
        }}
      />
      <Stack.Screen
        name='VerifyLicencse'
        component={VerifyLicencse}
        options={{
          title: "",
          headerStyle: {
            backgroundColor: colors.white,
            elevation: 0,
          },
        }}
      />
      <Stack.Screen
        name='UploadLicenseScreen'
        component={UploadLicenseScreen}
        options={{
          title: "",
          headerStyle: {
            backgroundColor: colors.white,
            elevation: 0,
          },
        }}
      />
      <Stack.Screen
        name='UploadVehicleInsuranceScreen'
        component={UploadVehicleInsuranceScreen}
        options={{
          title: "",
          headerStyle: {
            backgroundColor: colors.white,
            elevation: 0,
          },
        }}
      />
      <Stack.Screen
        name='DriverSettingsScreen'
        component={DriverSettingsScreen}
        options={{
          headerStyle: {
            backgroundColor: colors.white,
            elevation: 0,
          },
          title: "",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='UploadPictureScreen'
        component={UploadPictureScreen}
        options={{
          title: "Upload your picture",
          headerStyle: {
            backgroundColor: colors.white,
            elevation: 0,
          },
        }}
      />
      <Stack.Screen
        name='PackageSummaryScreenNew'
        component={PackageSummaryScreenNew}
        options={{
          title: "",
          headerStyle: {
            backgroundColor: colors.white,
            elevation: 0,
          },
        }}
      />
      <Stack.Screen
        name='AvailableDrivers'
        component={AvailableDrivers}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='DriverProfileScreen'
        component={DriverProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='TransactionDetailsScreen'
        component={TransactionDetailsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='TransactionDetails'
        component={TransactionDetails}
        options={{
          title: "Transaction Details",
        }}
      />
      <Stack.Screen
        name='CopyTripCodeScreen'
        component={CopyTripCodeScreen}
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name='NotificationsScreen'
        component={NotificationsScreen}
        options={{
          title: "",
        }}
      />

      <Stack.Screen
        name='PaymentHistoryScreen'
        component={PaymentHistoryScreen}
        options={{
          title: "Payment History",
        }}
      />
      <Stack.Screen
        name='WithdrawalScreen'
        component={WithdrawalScreen}
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name='AddBankRecordScreen'
        component={AddBankRecordScreen}
        options={{
          title: "",
        }}
      />
    </Stack.Navigator>
  );
}
export default HomeNavigator;
