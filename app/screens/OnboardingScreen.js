/** @format */

import React, { useRef } from "react";
import { View, StyleSheet } from "react-native";
import colors from "../config/colors";
import PagerView from "react-native-pager-view";
import OnboardingScreenItem from "../components/OnboardingScreenItem";
import Logx_onboardone from "../assets/logx_onboardone.svg";
import Logx_onboardtwo from "../assets/logx_onboardtwo.svg";
import Logx_onboardthree from "../assets/logx_onboardthree.svg";

function OnboardingScreen(props) {
  const pagerRef = useRef(null);
  return (
    <PagerView style={styles.viewPager} initialPage={0} ref={pagerRef}>
      <View key='1'>
        <OnboardingScreenItem
          title={`Send your package with ease \n to anywhere`}
          subTitle={`You can send your package from anywhere \n to any destination of your choice`}
          image={<Logx_onboardone />}
          active
          tag={1}
          navigation={props.navigation}
        />
      </View>
      <View key='2'>
        <OnboardingScreenItem
          title={`Track your package as it \n moves across`}
          subTitle={`You can send your package from anywhere \n to any destination of your choice`}
          image={<Logx_onboardtwo />}
          tag={2}
          navigation={props.navigation}
        />
      </View>
      <View key='3'>
        <OnboardingScreenItem
          title={`Set time limit on \n Delivery`}
          subTitle={`Set a particular time for your package \n to be delivered`}
          tag={3}
          navigation={props.navigation}
          image={<Logx_onboardthree />}
        />
      </View>
    </PagerView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  viewPager: {
    flex: 1,
  },
  page: {
    justifyContent: "center",
    alignItems: "center",
  },
});
export default OnboardingScreen;
