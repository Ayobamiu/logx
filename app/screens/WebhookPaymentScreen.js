// import React, { useState } from "react";
// import {
//   Alert,
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
//   Switch,
//   ActivityIndicator,
// } from "react-native";
// import {
//   CardField,
//   useConfirmPayment,
//   StripeProvider,
// } from "@stripe/stripe-react-native";
// import AppButton from "../components/AppButton";
// import colors from "../config/colors";

// export default function WebhookPaymentScreen() {
//   const [email, setEmail] = useState("");
//   const [saveCard, setSaveCard] = useState(false);

//   const { confirmPayment, loading } = useConfirmPayment();
//   console.log("loading", loading);

//   const fetchPaymentIntentClientSecret = async () => {
//     const response = await fetch(
//       `https://expo-stripe-server-example.glitch.me/create-payment-intent`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email,
//           currency: "usd",
//           items: [{ id: "id" }],
//           stripeAccount: "acct_1H3PVGID7R5WXzrn",

//           // request_three_d_secure: 'any',
//         }),
//       }
//     );
//     const { clientSecret } = await response.json();

//     return clientSecret;
//   };

//   const handlePayPress = async () => {
//     // 1. fetch Intent Client Secret from backend
//     const clientSecret = await fetchPaymentIntentClientSecret();

//     // 2. Gather customer billing information (ex. email)
//     const billingDetails = {
//       email: "email@stripe.com",
//       phone: "+48888000888",
//       addressCity: "Houston",
//       addressCountry: "US",
//       addressLine1: "1459  Circle Drive",
//       addressLine2: "Texas",
//       addressPostalCode: "77063",
//     }; // mocked data for tests

//     // 3. Confirm payment with card details
//     // The rest will be done automatically using webhooks
//     const { error, paymentIntent } = await confirmPayment(clientSecret, {
//       type: "Card",
//       billingDetails,
//       setupFutureUsage: saveCard ? "OffSession" : undefined,
//     });

//     if (error) {
//       Alert.alert(`Error code: ${error.code}`, error.message);
//       console.log("Payment confirmation error", error.message);
//     } else if (paymentIntent) {
//       Alert.alert(
//         "Success",
//         `The payment was confirmed successfully! currency: ${paymentIntent.currency}`
//       );
//       console.log("Success from promise", paymentIntent);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <StripeProvider
//         publishableKey="pk_test_51H3PVGID7R5WXzrnt8BvnHnloG5voXu6FAsa20yLUJlyxClKKtAKQ7zEGSNLqpWEG5ijKDwN3NMQVXAVFR7vyqjn00Nlsr5qmR"
//         // urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
//         // merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}" // required for Apple Pay
//       >
//         <TextInput
//           autoCapitalize="none"
//           placeholder="E-mail"
//           keyboardType="email-address"
//           onChange={(value) => setEmail(value.nativeEvent.text)}
//           style={styles.input}
//         />
//         <CardField
//           postalCodeEnabled={false}
//           autofocus
//           placeholder={{
//             number: "4242 4242 4242 4242",
//             postalCode: "12345",
//             cvc: "CVC",
//             expiration: "MM|YY",
//           }}
//           onCardChange={(cardDetails) => {
//             console.log("cardDetails", cardDetails);
//           }}
//           onFocus={(focusedField) => {
//             console.log("focusField", focusedField);
//           }}
//           cardStyle={inputStyles}
//           style={styles.cardField}
//         />
//         <View style={styles.row}>
//           <Switch
//             onValueChange={(value) => setSaveCard(value)}
//             value={saveCard}
//           />
//           <Text style={styles.text}>Save card during payment</Text>
//         </View>
//         <AppButton
//           variant="primary"
//           onPress={handlePayPress}
//           title={loading ? <ActivityIndicator /> : "Pay"}
//           disabled={loading}
//         />
//       </StripeProvider>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   cardField: {
//     width: "100%",
//     height: 50,
//     marginVertical: 30,
//   },
//   container: { padding: 16 },
//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   text: {
//     marginLeft: 12,
//   },
//   input: {
//     height: 44,
//     borderBottomColor: colors.slate,
//     borderBottomWidth: 1.5,
//   },
// });

// const inputStyles = {
//   borderWidth: 1,
//   backgroundColor: "#FFFFFF",
//   borderColor: "#000000",
//   borderRadius: 8,
//   fontSize: 14,
//   placeholderColor: "#999999",
// };
import React from "react";
import { View, StyleSheet } from "react-native";

function WebhookPaymentScreen(props) {
  return <View style={styles.container}></View>;
}
const styles = StyleSheet.create({
  container: {},
});
export default WebhookPaymentScreen;
