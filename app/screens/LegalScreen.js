import React, { useState } from "react";
import { View, StyleSheet, Pressable, ScrollView } from "react-native";
import AppText from "../components/AppText";
import colors from "../config/colors";

function LegalScreen(props) {
  const [showing, setShowing] = useState("Sender");

  const Para = ({ text }) => {
    return (
      <AppText size="16" style={{ marginVertical: 8 }}>
        {text}
      </AppText>
    );
  };

  const Header = ({ text }) => {
    return (
      <AppText size="header" style={{ fontWeight: "bold", marginVertical: 8 }}>
        {text}
      </AppText>
    );
  };
  const KeyValuePara = ({ keyText, value }) => {
    return (
      <AppText size="16" style={{ marginVertical: 8 }}>
        <AppText size="16" style={{ fontWeight: "bold" }}>
          {keyText}{" "}
        </AppText>
        {value}
      </AppText>
    );
  };

  const termsAndConditions = [
    {
      keyText: "Sender:",
      value:
        "The customer requesting to transmit   package to a known destination.",
    },
    {
      keyText: "Receiver:",
      value:
        "The customer that accept the package at the known destination from the delivery personnel.",
    },
    {
      keyText: "Package:",
      value:
        "Will mean any item(s) of any sort which are or are intended to be, received by us from any one sender at an address for us to carry and deliver to any recipient at any other address.",
    },
    {
      keyText: "Aged Package:",
      value:
        "Will mean a Package that is no longer in the condition in which it was received by us, or which is or becomes a health and safety risk.",
    },
    {
      keyText: "Out of Estimate:",
      value:
        "Will mean a package is outside of the weight and dimensions that we carry on a particular service.",
    },
    {
      keyText: "Prohibited Items:",
      value:
        "Will mean that it cannot be carried on any Service and are contrabands under the laws of the land. ",
    },
    {
      keyText: "Purchased:",
      value: "Will mean when you accept the Service Order. ",
    },
    {
      keyText: "The Collection Point:",
      value: "Will mean when you accept the Service Order. ",
    },
    {
      keyText: "The Delivery Point:",
      value: "Will mean the address to which any Package is delivered by us. ",
    },
    {
      keyText: "Service:",
      value:
        "Will mean the service and carriage of a Package by Delivery Personnel/Rider in accordance with the particulars set out in the Service Order, as per the terms and conditions. ",
    },
  ];
  return (
    <View style={styles.container}>
      <View style={[styles.selectButtons, styles.row]}>
        <Pressable
          style={[
            styles.selectButton,
            showing === "Sender" ? styles.selected : styles.unselected,
          ]}
          onPress={() => setShowing("Sender")}
        >
          <AppText
            style={[
              showing === "Sender"
                ? styles.selectedText
                : styles.unselectedText,
            ]}
          >
            Sender
          </AppText>
        </Pressable>
        <Pressable
          style={[
            styles.selectButton,
            showing === "Delivery Personnel"
              ? styles.selected
              : styles.unselected,
          ]}
          onPress={() => setShowing("Delivery Personnel")}
        >
          <AppText
            style={[
              showing === "Delivery Personnel"
                ? styles.selectedText
                : styles.unselectedText,
            ]}
          >
            Delivery Personnel
          </AppText>
        </Pressable>
      </View>

      {showing === "Sender" && (
        <ScrollView
          contentContainerStyle={styles.p16}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <Para
            text="By accepting the following terms and conditions, you (THE CUSTOMER)
            are agreeing to all the following terms and conditions without
            exception. The Terms of Use stated herein (collectively, the “Terms
            of Use” or this “Agreement”) constitute a legal agreement between
            you, the Rider/delivery personnel and LOG-X Technology Ltd. (the
            “Company”). In order to use the Service defined below, you must
            agree to the Terms of Use that are set out in the following. The
            Company reserves the right to modify, vary and change the Terms of
            Use or its policies relating to the Service at any time as it deems
            fit. Such modifications, variations and or changes to the Terms of
            Use or its policies relating to the Service shall be effective upon
            the posting of an updated version at Log-x. You agree that it shall
            be your responsibility to review the Terms of Use regularly
            whereupon the continued use of the Service after any such changes,
            whether or not reviewed by you, shall constitute your consent and
            acceptance to such changes."
          />
          <Header text="Terms and Conditions" />
          <Para text="In these Terms and Conditions where the following terminology has been used, they shall have the following meanings:" />

          {termsAndConditions.map((i, index) => (
            <KeyValuePara keyText={i.keyText} value={i.value} key={index} />
          ))}

          <Header text="Service" />
          <Para text="The Service(s) will be carried out for you whilst this Agreement is in force, in return for the payment by you to us of the price set out in the Service Order and in accordance with the terms of this Agreement. The Company shall have the right to make any changes to the Service(s) which are necessary to comply with any applicable law or safety requirement or which do not materially affect the nature or quality of the Service(s) and any changes are not liable to be notified to you. ‍" />
          <Header text="Loading and Unloading" />
          <Para text="If collection or delivery of a Package takes place at your premises, the company shall not be under any obligation to provide any equipment or labour which, apart from the Rider/Delivery Personnel collecting the Package, may be required for loading or unloading of a Package. " />
          <Para text="Any Package (or part of a Package ) requiring any special equipment for loading and unloading shall be accepted by us for transportation only on the understanding and condition that such special equipment will be made available at the Collection Point and the Delivery Point as required. Where such equipment is not available and if the Rider/Delivery Personnel agrees to load or unload the Package (or part of the package ) the company shall be under no liability or obligation of any kind to you for any damage caused (however it may be caused) during the loading or unloading of the Package " />
          <Para text="This includes any damage caused whether or not by the Rider/Delivery Personnel negligence and you shall agree to indemnify and hold us harmless against any claim or demand from any person arising out of this agreement to load or unload the Package in these circumstances. " />
          <Header text="Collection and Deliveries" />
          <Para text="The Rider/Delivery Personnel will make one attempt to deliver a Package during normal working hours. If the Rider/Delivery Personnel cannot meet the receiver at the Delivery Point you agree that the Rider/Delivery Personnel shall be authorised to attempt to: deliver the Package to the receiver at an alternative address close to the Delivery Point; or deliver the Package to a safe location at the Delivery Point and (if successful) the Rider/freelancer agrees that he/she will leave at the Delivery Point details of the address or safe location to which he/she have delivered the Package. " />
          <Para text="If the Rider/Delivery Personnel is unable to Personally deliver to the Delivery Point, a nearby address or a safe location, the Rider/Delivery Personnel shall return the Package to the sender. Unless the sender request for the Rider/Delivery Personnel  to deliver the Package to contact the Rider/freelancer to another location. If the receiver does not contact us to arrange the alternative delivery within 24 hours for short distant and 7 days for long distance, we will return the Package to Sender who shall bear the cost (such cost to be discharged before delivery to you). " />
          <Para text="If the Rider/Delivery Personnel considers that the Package has become a Damaged Package and cannot be delivered because it is or in his/her reasonable opinion is likely to be unsafe hazardous or harmful they reserve the right to refuse delivery and/or dispose of the Damaged Package immediately. " />
          <Header text="Terms of Use of the Service" />
          <Header text="Your Obligations" />
          <Para text="You agree to: " />
          <Para text="i. Ensure that the information you supply in the Order Schedule is complete and accurate; co-operate with the Rider and Delivery Personnel and Log-x Technology Ltd in all matters relating to the provision of the Service(s); " />
          <Para text="ii. Provide the Riders/ Delivery Personnel with access to your premises, office accommodation and other facilities as reasonably required, if/when any of these are to be the Collection Point or Delivery Point and be responsible for ensuring that the premises are free of hazardous materials and do not pose a health and safety risk to the Riders/freelancer/Delivery Personnel." />
          <Para text="iii. Provide the company with such information and materials as may be reasonably required in order to supply the Service(s) and ensure that such information is accurate in all material respects. " />
          <Para text="iv. You agree that the Rider/delivery personnel shall not be required, and that you shall not cause them, to carry anything if it would be illegal or unlawful for them to do so under the laws of the Federal Republic of Nigeria. You agree that should you do this, you will indemnify Log-x Technology Ltd on behalf of the Rider/Delivery Personnel against any losses and/or damage that they may suffer as a consequence." />
          <Para text="The Rider/Delivery Personnel shall not, carry: liquids; perishable goods; gasses; pyrotechnics; arms; ammunition; corrosive; toxic; flammable; explosive; oxidising or radioactive materials. In addition, the Rider/Delivery Pesonnel will not carry any items which are prohibited by the laws of the Land. The Rider/Delivery Personnel and the company  reserves the right to refuse to carry any parcels which are neither the property of, nor sent on behalf of, you. " />
          <Header text="It is understood that you agree that:" />
          <Para text="All Packages shall be accepted at the Delivery Point and that the receiver shall indicate through the app that the package have been received, that shall be enough evidence to show that the package was delivered. Unless specifically agreed otherwise, “working days” do not include Friday, Saturday or public holidays. " />
          <Para text="No refund or reduction shall be provided of charges if less than the number of parcels for which you have contracted has been received or the Rider/Delivery Personnel delivered out of time without your permission. That you cannot send a package weighing more than 3 Kilograms and that Rider/Delivery Personnel reserves the right to refuse delivery of products weighing over the set limit. " />
          <Para text="You will be barred from sending contrabands as specified by the laws of the Land. You are liable to disclose all necessary information regarding the product to the Rider/Delivery Personnel. You will not be allowed to send any food items. You are not allowed to send passport, bank cheques or any material pertaining to a cash transaction between two entities. You are encouraged not to transfer extremely expensive items; if they do, they are asked to be cautious. " />
          <Para text="You are to maintain the orders according to the outlined product categories, fully understanding each category description and strictly abiding by any restrictions a product category imposes on the user." />
          <Para text="You are to maintain extreme caution while packing the product, so as to diminish chances of damage as much as possible. You are to make sure that the items do not harm the rider in any way i.e. wrapping flowers and earrings properly." />
          <Para text="You are encouraged to bubble-wrap any electronics you wish to transfer, so as to avoid damaging the item. You have to pay for the delivery upfront. Failure to do so will result in the rider/freelancer/delivery personnel cancelling your request." />
          <Para text="You may not ask riders to receive cash payment from the receiver.  You are to report any damaged/missing/lost items to our support team within 5 hours of dispatch.  Log-x Technology Ltd would not take full liability of any item that is damaged or lost. " />
          <Header text="Liability" />
          <KeyValuePara
            keyText="YOUR ATTENTION IS DRAWN PARTICULARLY TO THIS CLAUSE AND THE LIMITS OF OUR LIABILITY WITHIN IT."
            value=" As a responsible business, the company and the respective Riders/Delivery Personnels shall hopefully perform the Service(s) in a professional manner with the appropriate level of skill and care. The company will not take full liability of any item that is damaged or lost. Damage to a Package may still occur as a consequence of handling of it and in such circumstances, the company and the Riders/Delivery Personnel liability shall be limited as set out in these Terms and Conditions. "
          />
          <Para text="The reasoning behind this limitation of our liability is as follows: The value of a Package and the amount of potential loss to you that could arise if a Package is damaged or lost is not something which can be easily ascertained but is something which is better known to you. And the company only function as a middleman that links you the sender with a Rider/Delivery Personnel, anything that happen after giving the package to the Rider/Delivery Personnel is not our responsibility." />
          <Para text="In many cases it cannot be known to the company or the Rider/Delivery Personnel at all and can only be known to you. The potential amount of loss that might be caused or alleged to be caused to you is likely to be disproportionate to the sum that could reasonably be expected to charge you for providing the Service(s) under this Agreement. " />
          <Para text="It is not possible to obtain cover which would give unlimited compensation for full potential liability to all customers and, even if it were, such cover would be much cheaper if taken out by you and on that basis, it is more reasonable for you to take out such cover from an independent third party. It is imperative to keep the costs of providing the Service(s) to you as low as possible. " />
          <Para text="In these Terms and Conditions, damage to you means any loss of, or damage to, a Packaging. " />
          <Header text="License Grant & Restrictions" />
          <Para text="The Company and its licensors, where applicable, hereby grants you a revocable, non-exclusive, non-transferable, non-assignable, personal, limited license to use the Application and/or the Software, solely for your own personal, non-commercial purposes, subject to the Terms of Use herein. All rights not expressly granted to you are reserved by the Company and its licensors. " />
          <Para text="(a) You shall not license, sublicense, sell, resell, transfer, assign, distribute or otherwise commercially exploit or make available to any third party the Application and/or the Software in any way; modify or make derivative works based on the Application and/or the Software; create internet “links” to the Application or “frame” or “mirror” the Software on any other server or wireless or internet-based device; reverse engineer or access the Software in order to;" />
          <Para text="i. Build a competitive product or service; " />
          <Para text="ii. Build a product using similar ideas, features, functions or graphics of the Application and/or the Software, or ; " />
          <Para text="iii. Copy any ideas, features, functions or graphics of the Application and/or the Software, launch an automated program or script, including, but not limited to, web spiders, web crawlers, web robots, web ants, web indexers, bots, viruses or worms, or any program which may make multiple server requests per second, or unduly burdens or hinders the operation and/or performance of the Application and/or the Software, use any robot, spider, site search/retrieval application, or other manual or automatic device or process to retrieve, index, “data mine”, or in any way reproduce or circumvent the navigational structure or presentation of the Service or its contents; post, distribute or reproduce in any way any copyrighted material, trademarks, or other proprietary information without obtaining the prior consent of the owner of such proprietary rights, remove any copyright, trademark or other proprietary rights notices contained in the Service. " />
          <Para text="(b) You may use the Software and/or the Application only for your personal, non-commercial purposes and shall not use the Software and/or the Application to: send spam or otherwise duplicative or unsolicited messages; send or store infringing, obscene, threatening, libellous, or otherwise unlawful or tortious material, including but not limited to materials harmful to children or violative of third party privacy rights; send material containing software viruses, worms, trojan horses or other harmful computer code, files, scripts, agents or programs; interfere with or disrupt the integrity or performance of the Software and/or the Application or the data contained therein; attempt to gain unauthorized access to the Software and/or the Application or its related systems or networks; or Impersonate any person or entity or otherwise misrepresent your affiliation with a person or entity to abstain from any conduct that could possibly damage the Company’s reputation or amount to being disreputable. " />
          <Header text="Privacy Policy" />
          <Para text="Log-x Technology Ltd built the Log-x app as a Free app. This SERVICE is provided by Log-x Technology Ltd at no cost and is intended for use as is." />
          <Para text="This page is used to inform visitors regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service." />
          <Para text="If you choose to use our Service, then you agree to the collection and use of information in relation to this policy. The Personal Information that we collect is used for providing and improving the Service. We will not use or share your information with anyone except as described in this Privacy Policy." />
          <Para text="If you choose to use our Service, then you agree to the collection and use of information in relation to this policy. The Personal Information that we collect is used for providing and improving the Service. We will not use or share your information with anyone except as described in this Privacy Policy." />
          <Header text="Intellectual Property Ownership" />
          <Para text="The Company and its licensors, where applicable, shall own all right, title and interest, including all related intellectual property rights, in and to the Software and/or the Application and by extension, the Service and any suggestions, ideas, enhancement requests, feedback, recommendations or other information provided by you or any other party relating to the Service." />
          <Para text=" The Terms of Use do not constitute a sale agreement and do not convey to you any rights of ownership in or related to the Service, the Software and/or the Application, or any intellectual property rights owned by the Company and/or its licensors. The Company’s name, the Company’s logo, the Service, the Software and/or the Application and the third party transportation providers’ logos and the product names associated with the Software and/or the Application are trademarks of the Company or third parties, and no right or license is granted to use them. " />
          <Para text="For the avoidance of doubt, the term the Software and the Application herein shall include its respective components, processes and design in its entirety." />
          <Header text="Location Tracking" />
          <Para text="To use or access our app seamlessly, you must permit the Log-x app  to access location services through the permission system used by your mobile operating system (“Platform”) or browser. We may collect the precise location of your device when the Log-x app is running in the foreground or background of your device. We may also derive your approximate location from your IP address. We use your location information to verify that you are present in your preferred region or city when you begin or engage in a delivery through the Log-x app, connect you with delivery opportunities in your zone, and track the progress and completion of your Deliveries. You can enable the location tracking feature through the settings on your device or Platform or when prompted by the Log-x mobile app. If you choose to disable the location feature through the settings on your device or Platform, Log-x app will not receive precise location information from your device, which will prevent you from being able to Trip and receiving delivery opportunities in your area." />
          <Header text="Payment" />
          <Para text="You may choose to pay for the services by cash only where available, by using Log-x app as detailed below. Once you have used the Service, you are required to make payment in full to the rider/delivery personnel and such payment is non-refundable except in exceptional situation. If you have any complaints in relation to the delivery service provided, then that dispute must be taken up with the third-party rider/delivery personnel provider directly. We only promise to refund some percentages of your initial fund where there is unreasonable delay in delivery. " />
          <Para text="You have to pay the riders/delivery personnels upfront. Failure to do so will result in the rider/delivery personnel cancelling your request. You shall not ask riders to receive cash payment directly, you can only make payment through the options provided on the Log-x app." />
          <Para text="Selecting a particular payment method means you are agreeing to the terms of service of the Company’s processing partners and your financial institution. You will bear all fees that may be charged by such processing partners and/or your financial institution (if any) for the payment method you have selected." />
          <Para text="Cash deposited on your dashboard are not redeemable for cash nor are they refundable except in the instant delivery was not carried out or completed. You will not receive interest or other earnings on your cash deposited on the Log-x app. The Company may receive interest on amounts that the Company holds on your behalf. You agree to assign your rights to the Company for any interest derived from your cash. You should ensure that you have sufficient cash to pay for the delivery services. If you have insufficient credit balance to pay for the delivery services, you may deposit additional cash so that you may complete your payment for the delivery services. You may check your dashboard for cash balance in the Application. " />
          <Header text="Taxes" />
          <Para text="You agree that this Agreement shall be subject to all prevailing statutory taxes, duties, fees, charges and/or costs, however denominated, as may be in force in Nigera and in connection with any future taxes that may be introduced at any point of time. You further agree to use your best efforts to do everything necessary and required by the relevant laws to enable, assist and/or defend the Company to claim or verify any input tax credit, set off, rebate or refund in respect of any taxes paid or payable in connection with the Service supplied under this Agreement. " />
          <Header text="Information Collection and Use" />
          <Para text="For a better experience, while using our Service, we may require you to provide us with certain personally identifiable information. The information that we request will be retained by us and used as described in this privacy policy." />
          <Para text="The app does use third party services that may collect information used to identify you." />
          <Para text="Link to privacy policy of third party service providers used by the app." />
          <Header text="Service Providers" />
          <Para text="We may employ third-party companies and individuals due to the following reasons:" />
          <Para text="*To facilitate our Service;" />
          <Para text="*To provide the Service on our behalf;" />
          <Para text="*To perform Service-related services; or" />
          <Para text="*To assist us in analyzing how our Service is used." />
          <Para text="We want to inform users of this Service that these third parties have access to your Personal Information. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose." />
          <Header text="Log Data" />
          <Para text="We want to inform you that whenever you use our Service, in a case of an error in the app we collect data and information (through third party products) on your phone called Log Data. This Log Data may include information such as your device Internet Protocol (“IP”) address, device name, operating system version, the configuration of the app when utilizing our Service, the time and date of your use of the Service, and other statistics." />
          <Header text="Cookies" />
          <Para text="Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers. These are sent to your browser from the websites that you visit and are stored on your device's internal memory." />
          <Para text="This Service does not use these “cookies” explicitly. However, the app may use third party code and libraries that use “cookies” to collect information and improve their services. You have the option to either accept or refuse these cookies and know when a cookie is being sent to your device. If you choose to refuse our cookies, you may not be able to use some portions of this Service." />
          <Header text="Security" />
          <Para text="We value your trust in providing us with your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security." />
          <Header text="Links to Other Sites" />
          <Para text="This Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services." />
        </ScrollView>
      )}
      {showing === "Delivery Personnel" && (
        <ScrollView
          contentContainerStyle={styles.p16}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <Header text="General Terms for Delivery Personnel s" />
          <Para text="These General Terms set forth the main terms and conditions applying to and governing the usage of the Log-x Services. In order to provide Delivery Services via using the Log-x Platform you must agree to the terms and conditions that are set forth below." />
          <Header text="1. DEFINITIONS" />
          <Para
            text={`1.1. log-x (also referred to as "we", "our" or "us") – the Log-x Technology Limited, a private limited company incorporated and registered under the laws of Federation of Nigeria with Rc. No 1831243, registered office at No 13 Unity Estate Akobo Ojurin, Ibadan, Oyo State, Nigeria.`}
          />
          <Para text="1.2. Log-x Services – services that Log-x Technology provides, including provision and maintenance of Log-x App, Log-x Platform, In-app Payment, customer support, communication between the Delivery Personnel and the Sender and Reciever and other similar services." />
          <Para text="1.3. Log-x App – a smartphone application for Delivery Personnel and sender to request and receive Delivery Services." />
          <Para text="1.4. Log-x Platform – technology connecting Senders with Delivery Personnel to help them move goods around more efficiently." />
          <Para text="1.5. Sender – a person requesting Delivery Services by using Log-x Platform." />
          <Para text="1.6. Delivery Personnel (also referred to as „you“) – the person providing Delivery Services via the Log-x Platform. " />
          <Para text="1.7. Agreement – this agreement between Delivery Personnel and Log-x regarding the use of Log-x Services which consists of:" />
          <Para text="1.7.1. these General Terms;" />
          <Para text="1.7.2. special terms displayed in Log-x App, e.g regarding price info or service descriptions;" />
          <Para text="1.7.3. the Delivery personnel guidelines; and" />
          <Para text="1.7.4. other terms referred to in this Agreement as may be amended from time to time." />
          <Para text="1.8. Delivery fee – the fee a Sender is obliged to pay Delivery Personnel for provision of the Delivery Services." />
          <Para text="1.9. Log-x Fee – the fee that Delivery Personnel is obliged to pay to Log-x for using the Log-x Platform." />
          <Para text="1.10. In-app Payment – cards, carrier billing and other payment methods used by the sender via the Log-x App to pay for the Delivery Services." />
          <Para text="1.11. Log-x Delivery Personnel Account – access to a website containing information and documents regarding usage of the Log-x  Services in course of provision of Delivery Services, including accounting documentation." />
          <Para text="1.12 Delivery Services – delivery service a Delivery Personnel is providing to sender whose request Delivery Personnel  has accepted through the Log-x App." />
          <Header text="2. ENTRY INTO THE AGREEMENT" />
          <Para
            text={`2.1. Prior to using the Log-x Services, you must sign up by providing the requested information in the signup application on App and uploading necessary documentation as required by us. You may sign up either as a legal or a natural person. Upon successful completion of the signup application, we will provide you with a personal account accessible via a username and password. By clicking the „Sign up" button located at the end of the signup application, you represent and warrant that:`}
          />
          <Para text="2.1.1. pursuant to valid legal acts, you are entitled to enter into an agreement with us to use the Log-x Platform for providing the DeliveryService;" />
          <Para text="2.1.2. you have carefully studied, fully understand and agree to be bound by these General Terms, including all obligations that arise as provided herein and from Agreement;" />
          <Para text="2.1.3. all the information you have presented to us is accurate, correct and complete;" />
          <Para text="2.1.4. you will keep Log-x Delivery Personnel  Account accurate and profile information updated at all times;" />
          <Para text="2.1.5. you will not authorize other persons to use your Log-x Delivery Personnel  Account nor transfer or assign it to any other person;" />
          <Para text="2.1.6. you will not use the Log-x Services for unauthorized or unlawful purposes and impair the proper operation of the Log-x Services;" />
          <Para text="2.1.7. at all times, you fully comply with all laws and regulations applicable in the state you are providing DeliveryServices in, including (but not limited to) laws regulating sender Deliveryservices;" />
          <Para text="2.2. You are obliged to provide your bank requisites in course of filling the payment details upon registration. In case you are a legal person, you must insert the bank account of the company. We are transferring In-app Payment fees to the bank account that you have provided. We are not liable for any incorrect money transactions in case you have provided wrong bank requisites." />
          <Para text="2.3. After submitting the signup application, you will receive an e-mail with additional conditions that must be met in order to use Log-x Services. These conditions may include providing criminal records, valid driving license, satisfactory technical state of the vehicle, completion of a training course, owning a GPS-supporting mobile device and other conditions as described in the pertinent e-mail. The failure to comply with the provided requirements and conditions may result in termination of the Agreement and right to use the Log-x Services." />
          <Para text="2.4. You agree that in specific cities or countries Log-x Technology Limited may assign any of our obligations arising from the General Terms or Agreement to Log-x Technology Limited and partners. This includes, among else, assigning the rights and obligations regarding reviewing documents related to signup applications, trainings, collection of Log-x Fees, forwarding you the fees due, mediating In-app Payment, licensing the Log-x App, etc." />
          <Para text="2.5. Registering the account as a legal person (i.e. a company). You are considered to be a legal person, if the recipient of the fees is marked as a legal person in payment details (as accessible in the Log-x Delivery Personnel  Account). In such case, the indicated legal person is considered to be the provider of Delivery Services and a party to these General Terms, Agreement and any further agreements. Only the specific natural person indicated in the signup process may factually provide the Delivery Services. Such natural person may use the account of the Delivery Personnel  only if he/she has read and agrees to be bound by these General Terms and any further documentation that is part of the Agreement. THE LEGAL PERSON IN THE PAYMENT DETAILS AND THE NATURAL PERSON FACTUALLY PROVIDING THE DELIVERY SERVICES UNDER LOG-X ACCOUNT SHALL REMAIN JOINTLY AND SEVERALLY LIABLE FOR ANY INFRINGEMENT OF THE GENERAL TERMS AND AGREEMENT CONDUCTED BY THE DELIVERY PESONNEL." />
          <Para text="2.6. Registering Log-x Delivery Personnel  Account as a fleet company. Upon concluding a separate agreement, a fleet company may itself register accounts to its employees and/or service providers. In such case the fleet company shall be required to ensure that its employees and/or service providers conform to the requirements of General Terms, Agreement and any further agreements and agrees to act in accordance and be bound with its conditions and obligations. The fleet company and its employees and/or service providers shall remain jointly and severally liable for any infringement conducted by such employee and/or service provider." />
          <Header text="3. RIGHT TO USE LOG-X APP AND LOG-X DELIVERY PERSONNEL  ACCOUNT" />
          <Para text="3.1. License to use the Log-x App and the Log-x Delivery Personnel  Account. Subject to your compliance with the Agreement, We hereby grant you have a license to use the Log-x App and the Log-x Delivery Personnel  Account. The license does not grant you the right to sublicense or transfer any rights to the third persons. Regardless of the above and if so agreed separately, fleet companies may sub-license the Log-x App and the Log-x Delivery Personnel  Account to the members of its fleet." />
          <Para text="3.2. In course of using the Log-x App and/or Log-x Delivery Personnel  Account you may not:" />
          <Para text="3.2.1. decompile, reverse engineer, or otherwise attempt to obtain the source code of the Log-x App, the Log-x Delivery Personnel  Account or other software of Log-x;" />
          <Para text="3.2.2. modify the Log-x App or the Log-x Delivery Personnel  Account in any manner or form or to use modified versions of the Log-x App or Log-x Delivery Personnel  Account;" />
          <Para text="3.2.3. transmit files that contain viruses, corrupted files, or any other programs that may damage or adversely affect the operations on Log-x Platform;" />
          <Para text="3.2.4. attempt to gain unauthorized access to the Log-x App, Log-x Delivery Personnel  Account or any other Log-x Services." />
          <Para text="3.3. The License granted herein revokes automatically and simultaneously with termination of the Agreement. After termination of the Agreement you must immediately stop using the Log-x App and the Log-x Delivery Personnel  Account and we are entitled to block and delete Delivery Personnel  account without a prior notice." />
          <Para text="3.4. Using tags and labels of Log-x. Additionally, we may give you tags, labels, stickers or other signs that refer to Log-x brand or otherwise indicate you are using the Log-x Platform. We grant you a non-exclusive, non-sublicensable, non-transferable license to use such signs and only for the purpose of indicating you are providing DeliveryServices via the Log-x Platform. After termination of the Agreement you must immediately remove and discard any signs that refer to Log-x brand." />
          <Para text="3.5. All copyrights and trademarks, including source code, databases, logos and visual designs are owned by Log-x and protected by copyright, trademark and/or trade secret laws and international treaty provisions. By using the Log-x Platform or any other Log-x Services you do not acquire any rights of ownership to any intellectual property." />
          <Header text="4. PROVIDING THE DELIVERY SERVICES" />
          <Para text="4.1. The Delivery Personnel ’s Obligations. You hereby guarantee to provide Delivery Services in accordance with the General Terms, Agreement as well as laws and regulations applicable in the state where you are providing Delivery Services. Please note that you are fully liable for any violation of any local laws and regulations as may arise from providing Delivery Services." />
          <Para text="4.2. You must have all licenses (including a valid Delivery Personnel ’s license), permits, car insurance, liability insurance (if applicable), registrations, certifications and other documentation that are required in the applicable jurisdiction for providing the Delivery Services. It is your obligation to maintain the validity of all aforementioned documentation. Log-x reserves the right to require you to present evidence and submit for review all the necessary licenses, permits, approvals, authority, registrations and certifications." />
          <Para text="4.3. You must provide the Delivery Services in a professional manner in accordance with the business ethics applicable to providing such services and endeavour to perform the sender's request in the best interest of the sender. Among else, you (i) must take the route least costly for the sender, unless the sender explicitly requests otherwise; (ii) may not make any unauthorised stops; (iii) may not have any other senders package in the vehicle other than the sender; and (iv) must adhere to any applicable traffic acts and regulations, i.e must not conduct any actions that may disrupt driving or the perception of traffic conditions, including holding a phone in his/her hand while the vehicle is moving." />
          <Para text="4.4. You retain the sole right to determine when you are providing the Delivery Services. You shall accept, decline or ignore Delivery Services requests made by senders at your own choosing." />
          <Para text="4.5. Costs you incur while providing the Delivery Services. You are obliged to provide and maintain all equipment and means that are necessary to perform the Delivery Services at your own expense, including a car, smartphone, etc. You are also responsible for paying all costs you incur in the course of performing the Delivery Services including, but not limited to, fuel, mobile data plan costs, duty fees, amortization of the vehicle, insurance, relevant corporate or payroll taxes etc. Please bear in mind that using the Log-x App may bring about consummation of large amount of data on your mobile data plan. Thus, we suggest you to subscribe for a data plan with unlimited or very high data usage capacity." />
          <Para text="4.6. Delivery fees. You are entitled to charge a Delivery fee for each instance you have accepted a sender on the Log-x Platform and completed the Delivery Service as requested (i.e. Delivery fee). The Delivery fee is calculated based on a default base Delivery fee, the distance of the specific journey as determined by the GPS-based device and the duration of the specific travel. The default base Delivery fee may fluctuate based on the local market situation. In markets with In-app payment, you may negotiate the Delivery fee by sending us a pertinent request that has been either signed digitally or by hand. Additionally, you shall always have the right to charge the sender less than the Delivery fee indicated by the Log-x App. However, charging the sender less than the Log-x App indicates, does not decrease the Log-x Fee." />
          <Para text="4.7. Upfront Delivery fee. ​A sender may be offered to use a Delivery option that allows the sender to agree to a fixed Delivery fee for a given instance of Delivery Service provided by you (i.e Upfront Delivery fee). Upfront Delivery fee is communicated via the Log-x App to a sender before theDeliveryis requested, and to you when the Delivery is accepted or at the end of the ride. The Delivery fee calculated in accordance with section 4.6 shall be applied instead of Upfront Delivery fee if the sender changes the destination during Delivery, the Delivery takes materially longer than estimated due to traffic or other factors, or when other unexpected circumstances impact the characteristics of the Delivery materially (e.g a route is used where tolls apply)." />
          <Para text="4.8. In markets with In-app payment, if you find that there has been an error in the calculation of the Delivery fee and wish to make corrections in the calculation of the Delivery fee, you must submit a petition to the support section  of the Log-x App. If a petition in the support section  of the Log-x App has not been submitted, then Log-x shall not recalculate the Delivery fee or reimburse you for an error made in the calculation of the Delivery fee. This option is not applicable in markets with only cash payment." />
          <Para text="4.9. Log-x may adjust the Delivery fee for a particular order completed, if we detect a violation (such as taking a longer route or not acknowledging completion on the Log-x App after the Delivery Services have been completed) or in case a technical error affecting the final Delivery fee is identified. Log-x may also reduce or cancel the Delivery fee in case we have reasonable cause to suspect a fraud or a complaint by the sender indicates a violation by you. Log-x will only exercise its right to reduce or cancel the Delivery fee in a reasonable and justified ." />
          <Para text="4.10. Receipts. After each successful provision of Delivery Services, Log-x shall create and forward a receipt to the sender consisting of some or all of the following information: the company’s business name, place of business, the first name and surname of the Delivery Personnel , a photo of the Delivery Personnel , service license number (if applicable), the registration number of the vehicle( If applicable), the date-, the time-, the start and end locations-, the duration and length-, the Delivery fee  paid for the provision of the DeliveryServices. The receipt of each provision of Delivery Services is available to you via the Log-x Delivery Personnel  Account." />
          <Para text="4.11. Cancellation fee & wait time fee. sender may cancel a request for Delivery Services that a Delivery Personnel  has accepted via the Log-x App. In some markets, Delivery Personnel  may be entitled to the Delivery fee for cancelled Delivery Services (Cancellation Fee) in the event that a sender cancels accepted request for DeliveryServices after certain time period determined by Log-x App." />
          <Para text="4.12. If, in the course of the provision of the Delivery Services, a sender or its co-senders negligently damage the vehicle or its furnishing (among else, by blemishing or staining the vehicle or causing the vehicle to stink), you shall have the right to request the sender to pay a penalty up to N20,000.00 and request compensation for any damages exceeding the penalty. If the sender does not consent to paying the penalty and/or compensating the damage, you must notify us and we will then try to collect penalty and/or relevant costs on the your behalf from the sender. However, bear in mind that we are not taking any liability for direct or indirect damages in relation to cleaning or maintenance of the damage caused by sender." />
          <Para text="4.13. Your tax obligations. You hereby acknowledges that you are obliged to fully comply with all tax obligations that arise to you from the applicable laws in relation to providing the DeliveryServices, including (i) paying income tax, social security tax or any other tax applicable; and (ii) fulfilling all employee and tax registration obligations for calculations in regard to accounting and transfers to applicable State authorities as required by the applicable law. In case the Tax authority will submit a valid application to us to provide information regarding the activities of you, we may make available to the Tax authority the information regarding the activities of you to the extent set forth in valid legal acts. Additionally, it is your obligation to adhere to all applicable tax regulations that may apply in connection with the provision of DeliveryServices. You hereby agree to compensate Log-x all state fees, claims, payments, fines or other tax obligations that Log-x will incur in connection with the obligations arising from applicable tax regulations not having been met by you (including paying the income tax and social tax)." />
          <Para text="4.14. The Delivery Personnel ’s authorisation to issue invoices. Log-x has a right to issue an invoice on your behalf to the sender in order to compensate you any Delivery fees, contractual penalties or other fees that Log-x mediates to you. In markets where Log-x issues invoices, the invoice will be made available to you via the Log-x Delivery Personnel  Account." />
          <Header text="5. Log-x FEES" />
          <Para text="5.1. In order to use the Log-x Services, you are obliged to pay to a fee (i.e. the Log-x Fee). The Log-x Fee is paid based on the Delivery fee of each Delivery Service order that you have completed. The amount of the Log-x Fee is made available to you via e-mail, Log-x App, Log-x Delivery Personnel  Account or other pertinent means. Please acknowledge that the Log-x Fee may change from time to time. We shall send you a prior notification of each such change." />
          <Para text="5.2. You must pay the Log-x Fee and any other fees due to us for the previous month at latest by the 15th date of the following month. Upon delay with payment of the Log-x Fee, you shall be obliged to pay a penalty of late payment in the amount of 0,04% (zero point zero four percent) of the unpaid amount per day. You are obliged to cover all costs incurred by us, which are related to debt collection activities." />
          <Header text="6. IN-APP PAYMENTS" />
          <Para text="6.1. We may enable senders to pay for the Delivery Service via cards, carrier billing and other payment methods (Log-x Business etc) directly in the Log-x App (i.e. In-app Payment). You hereby authorise us as your commercial agent to receive the Delivery fees or other fees paid by the sender via In-app Payment and to forward relevant funds to you. Any payment obligation made by the sender via the In-app Payment shall be considered fulfilled as of the time that the payment has been made." />
          <Para text="6.2. You may not refuse payment by the sender via the In-app Payment, or influence the sender against the use of the In-app Payment. In case you refuse to accept an In-app Payment without just cause, we shall be entitled to charge you a contractual penalty in the amount of 7,000.00 Naira for every refusal and/or block your right to use the Log-x Services in case of repetitive behaviour." />
          <Para text="6.3. Log-x reserves the right to distribute promo code to delivery personnel at our discretion on a per promotional basis. You are required to accept the use of promo code only when the Delivery Personnel  applies the code in-app to a trip using card payment. Promo codes may not be applied to cash paid trips. If the use of promo codes is suspected as being fraudulent, illegal, used by a Delivery Personnel  in conflict with our Terms and Conditions relating to promo code use, then the promo code may be canceled and the outstanding amount will not be reimbursed by Log-x to the Delivery Personnel ." />
          <Para text="6.4. You are entitled to review In-app Payment reports in the Log-x Delivery Personnel  Account or App. The reports will show the amounts of the In-app Payments brokered in the previous week as well as the withheld amounts of the Log-x Fee. You must notify us of any important circumstances which may affect our obligations to collect and distribute the Delivery fees paid via In-app Payment." />
          <Para text="6.5. We are not obliged to pay you the Delivery fee due from the sender if the In-app Payment failed because sender’s credit card or other payment is cancelled or is unsuccessful for other reasons. In such case we will help you in requesting the Delivery fee due from the sender and shall transmit it to you once the sender has made the requested payment." />
          <Para text="6.6. Before providing Delivery Services, you must verify that the service is being actually provided to the right sender or the sender has expressly confirmed he/she allows other senders toDeliveryunder sender’s account. If you make a mistake in identifying the sender, and the In-app Payment is charged to a person, who has not been provided or has not approved the DeliveryServices for other senders, then we shall reimburse the person for the Delivery fee. In such case you are not entitled to receive the Delivery fee from us. Additionally, for every wrongfully applied In-app Payment, we shall be entitled to charge you a contractual penalty up to 10 Euros." />
          <Para text="6.7. Please note that we will set off any Delivery fees paid via In-app Payment against the amounts that you are obliged to pay to us (i.e. Log-x Fees and contractual penalties). We reserve the right to fulfil any of your financial liabilities to any Log-x Technology Limited, in which case we will acquire the right to submit a claim against you. We may set off any of your financial liabilities against financial liabilities that you may have against us." />
          <Para text="6.8. If we are not able to pay the Fees or Tip to you due to you not including your bank account details in your Delivery Personnel ´s account or if the bank account details have been noted incorrectly, then we will hold such payments for 180 days. If you do not notify us of the correct bank account details within 180 days from the date that the right to claim such payments has been established, your claim regarding the payment of the Delivery fee  not transferred to you shall expire." />
          <Header text="7. CUSTOMER SUPPORT" />
          <Para text="We provide the Delivery Personnels customer support regarding the use of the Log-x Services. We have the right to stop providing the customer support services in case you are in delay with any of the payments for more than 5 (five) calendar days." />
          <Header text="8. RATINGS AND ACTIVITY" />
          <Para text="8.1. In order to guarantee high-quality service and provide additional reassurance to senders, you hereby acknowledge that the senders may provide you a rating and leave feedback regarding the quality of the DeliveryServices that you have provided. Your average rating will be linked to your Delivery Personnel ´s account and will be available to senders at Log-x App. If we find out the rating or comment is not given in good faith, this rating or comment may not be projected in the calculations of your rating." />
          <Para text="8.2. In addition to the rating, we measure your level of activity and provide you with an activity score, which is based on your activity regarding accepting, declining, not responding and completing DeliveryService requests." />
          <Para text="8.3. In order to provide reliable services to senders, we may determine a minimum average rating and a minimum activity score that Delivery Personnel s must establish and maintain. If, after a pertinent notification from us, you do not increase your average rating or activity score to minimum level within the prescribed time period, your Delivery Personnel ´s account will be automatically suspended either temporarily or permanently. We may reverse the suspension of your account if it is merited by any external circumstances or it is detected that the suspension was caused by a system error or false ratings." />
          <Header text="9. MARKET OVERVIEWS AND CAMPAIGNS" />
          <Para text="9.1. Market overviews. We may send you, via the Log-x App, Log-x Delivery Personnel  Account, SMS, e-mail or other means, market overviews, in order to increase your awareness regarding when the demand by the senders is highest. Such market overviews are merely recommendatory and do not constitute any obligations for you. As the market overview estimations are based on previous statistics, we cannot give any guarantees that the actual market situation will correspond to the estimations provided in the market overview." />
          <Para text="9.2. Campaigns promising minimum income. We may also provide campaigns, whereby we will guarantee a minimum income if you provide Delivery Services within a specified timeframe. If the specified minimum is not reached by you, we shall compensate the gap. The specific requirements and conditions will be sent via the Log-x App, Log-x Delivery Personnel  Account, SMS, e-mail or other means. We have full discretion in deciding if, when and to which Delivery Personnel s we provide such campaigns. If we have reasonable cause to suspect any fraudulent activity by you, we may withhold your Delivery fee until the suspicion of fraud has been cleared." />
          <Para text="9.3. Campaigns for senders. We may also occasionally arrange various campaigns to senders in order to promote the Log-x Platform. If the Delivery fee paid by the senders is reduced as part of such campaign, we shall pay you compensation, amounting to the monetary value of the benefit offered to the senders. We may set off the marketing compensation against the Log-x Fee." />
          <Header text="10. RELATIONSHIP BETWEEN YOU, US AND THE SENDERS" />
          <Para text="10.1. You hereby acknowledge and agree that we provide an information society service and do not provide Delivery Services. By providing the Log-x Platform and Log-x Services, we act as marketplace connecting senders with Delivery Personnel s to help them move around cities more efficiently. You acknowledge that you are providing the DeliveryServices on the basis of a contract for carriage of senders and that you provide the DeliveryServices either independently or via a company as an economic and professional activity. Log-x, as the operator of Log-x App acts as the commercial agent of the Delivery Personnel s for the mediation of conclusion of contracts between the Delivery Personnel  and the sender, and thus, among other things, accepts payments from the senders and forwards the payments to the Delivery Personnel ." />
          <Para text="10.2. You acknowledge that no employment agreement nor an employment relationship has been or will be established between you and us. You also acknowledge that no joint venture or partnership exists between you and us. You may not act as an employee, agent or representative of us nor bind any contract on behalf of us. If due to the implication of mandatory laws or otherwise, you shall be deemed an employee of us, you hereby agree to waive any claims against us that may arise as a result of such implied employment relationship." />
          <Para text="10.3. You may not transfer your rights and obligations deriving from the General Terms or Agreement to any third party." />
          <Header text="11. PROCESSING OF PERSONAL DATA, ACCESS TO DATA" />
          <Para text="11.1. Your personal data will be processed in accordance with the Privacy Notice." />
          <Para text="11.2. Log-x has access to all personal data and other data provided or generated in connection with your use of the Log-x Services. Log-x shall take all reasonable steps to ensure confidentiality of such data and comply with all applicable Privacy Policies and laws whenever such data contains personal data. Except where otherwise provided by applicable Privacy Policies and laws, Log-x maintains access to such data also after the Agreement between you and Log-x is terminated." />
          <Para text="11.3. You have access to personal and other data provided by you or generated in connection with your use of the Log-x Services to the extent that is made available to you under your Log-x Delivery Personnel  Account through Log-x App. You shall take all reasonable steps to ensure confidentiality of such data and comply with applicable Privacy Policies and laws as long and to the extent that such data contains personal data of senders." />
          <Header text="12. LIABILITY" />
          <Para
            text={`12.1. The Log-x Platform is provided on an "as is" and “as available” basis. We do not represent, warrant or guarantee that access to Log-x Platform will be uninterrupted or error free. As the usage of Log-x Platform for requesting Delivery services depends on the behavior of senders, we do not guarantee that your usage of the Log-x Platform will result in any DeliveryService requests.`}
          />
          <Para text="12.2. To the maximum extent permitted under the applicable law, we, nor Log-x’s representatives, directors and employees are not liable for any loss or damage that you may incur as a result of using the Log-x Services, including but not limited to:" />
          <Para text="12.2.1. any direct or indirect property damage or monetary loss;" />
          <Para text="12.2.2. loss of profit or anticipated savings;" />
          <Para text="12.2.3. loss of business, contracts, contacts, goodwill, reputation and any loss that may arise from interruption of the business;" />
          <Para text="12.2.4. loss or inaccuracy of data; and" />
          <Para text="12.2.5. any other type of loss or damage." />
          <Para text="12.3. The financial liability of us in connection with violating the General Terms or Agreement will be limited to N200,000.00. You shall have the right to claim for damages only if we have deliberately violated the General Terms or Agreement." />
          <Para text="12.4. We shall not be liable for the actions or non-actions of the sender or co-senders and shall not be liable for any loss or damage that may incur to you or your vehicle as a result of actions or non-actions of the sender or co-senders." />
          <Para text="12.5. You shall be fully liable for breach of the General Terms, Agreement or any other applicable laws or regulations and must stop and remedy such breach immediately after receipt of a respective demand from us or any state authority. You shall indemnify us for any direct and/or indirect loss and/or damage, loss of profits, expense, penalty, fine that we may occur in connection with your breach of the General Terms, Agreement and laws and regulations. If sender presents any claims against us in connection with your provision of DeliveryServices, then you shall compensate such damage to us in full within 7 (seven) days as of your receipt of the respective request from us. In case we are entitled to present any claims against you, then you shall compensate us any legal costs related to evaluation of the damages and submission of claims relating to compensation for such damage." />
          <Header text="13. TERM, SUSPENSION AND TERMINATION" />
          <Para text="13.1. The conditions expressly specified in these General Terms shall enter into force as of submitting the signup application. Agreements and other terms shall enter into force once the specific document or message has been made available to you and you commence or continue providing DeliveryServices on Log-x Platform." />
          <Para text="13.2. You may terminate the Agreement at any time by notifying Log-x at least 7 (seven) days in advance, after which your right to use the Log-x Platform and Log-x Services shall terminate. Log-x may terminate the Agreement at any time and for any reason at the sole discretion of us by notifying you at least 3 (three) days in advance." />
          <Para text="13.3. Log-x is entitled to immediately terminate the Agreement and block your access to the Log-x Platform without giving any advance notice in case you breach the General Terms or Agreement, any applicable laws or regulations, disparage Log-x, or cause harm to Log-x’s brand, reputation or business as determined by Log-x in our sole discretion. In the aforementioned cases we may, at own our discretion, prohibit you from registering a new Delivery Personnel  account." />
          <Para text="13.4. We may also immediately suspend (block) your access to the Log-x Platform and to the Log-x Delivery Personnel  Log-x Delivery Personnel  Account for the period of investigation, if we suspect an infringement of the Agreement or fraudulent activity from your behalf. The block of access will be removed once the investigation disproves such suspicions." />
          <Para text="13.5. We are aiming to provide the highest quality service to all senders therefore we are monitoring the activity of Delivery Personnel s on Log-x Platform. If you fail to meet the minimal service requirements, such as the minimal rating and activity score, we are entitled to immediately terminate the Agreement without giving any advance notice." />
          <Para text="13.6. Additional requirements and safeguards provided in Regulation (EU) 2019/1150 (Regulation) shall apply where the termination of the Agreement or blocking of the access to the Log-x Platform affects the rights of the Delivery Personnel  or fleet company using the Log-x Services for the provision of DeliveryServices in the member state of the European Union or European Economic Area (Member State)." />
          <Para text="13.7. The Delivery Personnel  and fleet company referred to in section 13.6 (Business User Operating in the Member State) has the right to challenge the termination of the Agreement, blocking, and other alleged non-compliance of Log-x with the Regulation, in accordance with the Internal Complaint-Handling System Rules for Business Users of Log-x." />
          <Header text="14. AMENDMENTS" />
          <Para text="14.1. Log-x reserves the right to amend these General Terms anytime by uploading the revised version on its website (https://Log-x.eu/legal/) and notifying you (e.g. via e-mail, Log-x App or Log-x Delivery Personnel  Account) whenever, in the reasonable opinion of Log-x, such amendments are material." />
          <Para text="14.2. Log-x shall provide at least 15 days advance notice (e.g. via e-mail, Log-x App or Log-x Delivery Personnel  Account) about the amendments that affect the rights of Business Users Operating in the Member State, unless:" />
          <Para text="14.2.1. Log-x is subject to a legal or regulatory obligation which requires it to amend the General Terms in a manner which does not allow it to respect the advance notice period;" />
          <Para text="14.2.2. immediate amendment is required to address an unforeseen and imminent danger related to health, safety or cybersecurity risks, or defending the Log-x Services, senders or Delivery Personnel s from fraud, malware, spam or data breaches;" />
          <Para text="14.2.3. you have elected to waive the advance notice period (e.g. you continue to use Log-x Services after receipt of the notice of amendment); or" />
          <Para text="14.2.4. in the reasonable opinion of Log-x, amendments are beneficial for the Delivery Personnel s and do not require technical adjustments from them." />
          <Para text="14.3. If you do not agree to the amendments of the General Terms or other conditions of the Agreement, you have the right to terminate the Agreement by discontinuing the use of the Log-x Services and providing termination notice to Log-x. The termination of the Agreement takes effect on the effective date of the proposed amendment, unless otherwise provided in your termination notice. Your use of the Log-x Services on or after the effective date of the amendment constitutes your consent to be bound by the General Terms or Agreement, as amended." />
          <Header text="15. APPLICABLE LAW AND COURT JURISDICTION" />
          <Para text="15.1. The General Terms and Agreement shall be governed by and construed and enforced in accordance with the laws of Federation of Nigeria. If the respective dispute resulting from General Terms or Agreement could not be settled by negotiations, then the dispute shall be solved in any court of jurisdiction in Nigeria." />
          <Header text="16. NOTICES" />
          <Para text="16.1. You are obliged to immediately notify us of any changes to your contact information." />
          <Para text="16.2. Any notice required to be given under the General Terms and Agreement shall be sufficiently given if:" />
          <Para text="16.2.1. delivered personally," />
          <Para text="16.2.2. sent by courier with proof of delivery," />
          <Para text="16.2.3. sent by registered mail," />
          <Para text="16.2.4. sent by e-mail or" />
          <Para text="16.2.5. made available via the Log-x App or Log-x Delivery Personnel  Account." />
          <Para text="16.3 Any notice which is sent or dispatched in accordance with the previous clause shall be deemed to have been received:" />
          <Para text="16.3.1. if delivered personally, at the time of delivery to the party;" />
          <Para text="16.3.2. if delivered by courier, on the date stated by the courier as being the date on which the envelope containing the notice was delivered to the party;" />
          <Para text="16.3.3. if sent by registered mail, on the 10th day after handing the document over to the post office for delivery to the party;" />
          <Para text="16.3.4. if made available via the Log-x App or Log-x Delivery Personnel  Account, or" />
          <Para text="16.3.5. if sent by e-mail, on the day the party receiving the e-mail confirms receiving the respective e-mail or on the 2nd day following the dispatch of the e-mail provided that the sender has not received an error notice (notifying that the e-mail was not delivered to the party) and has sent the e-mail again on the next calendar day and has not received a similar error notice." />
          <Header text="17. FINAL PROVISIONS" />
          <Para text="If any provision of the General Terms is held to be unenforceable, the parties shall substitute for the affected provision an enforceable provision that approximates the intent and economic effect of the affected provision." />
          <Para text="Date of entry into force of the General Terms: " />
        </ScrollView>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { backgroundColor: colors.white, flex: 1 },
  p16: { padding: 16 },
  row: { flexDirection: "row", alignItems: "center" },
  selected: {
    borderBottomColor: colors.primary,
    borderBottomWidth: 2,
  },
  selectedText: {
    color: colors.primary,
  },
  selectButton: {
    flex: 0.5,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  selectButtons: {
    borderTopWidth: 0.5,
    borderTopColor: colors.light,
    height: 50,
    flexDirection: "row",
  },
  unselected: {
    borderBottomColor: colors.light,
    borderBottomWidth: 2,
  },
  unselectedText: {
    color: colors.light,
  },
});
export default LegalScreen;
