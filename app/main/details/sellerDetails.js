import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Button,
  Linking,
  TouchableOpacity,
} from "react-native";
import { DataTable } from "react-native-paper";
import { useRouter, Stack, useLocalSearchParams } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';


const sellerDetails = ({ route }) => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { userId } = params;

  const [sellerName, onChangeSellerName] = React.useState("");
  const [sellerCity, onChangeSellerCity] = React.useState("");
  const [sellerPhone, onChangeSellerPhone] = React.useState("");

  useEffect(() => {
    async function landDetails() {
      // Get the login token
      async function loginTokenFunction() {
        const key = "loginkey";
        return await AsyncStorage.getItem(key).then((result) => {
          if (result) {
            try {
              result = JSON.parse(result);
            } catch (e) {
              console.log(e);
            }
          }
          if (result == null) {
            console.log("No Token");
            router.push({
              pathname: "/users/signin/userLogin",
            });
          }
          return result;
        });
      }
      // End getting login token
      const headers = {
        authorizatrion: await loginTokenFunction(),
      };
      try {
        const lands = await axios
          .post(
            "http://ec2-3-109-5-112.ap-south-1.compute.amazonaws.com:5000/api/userController/sellerDetails",
            { userId: userId },
            { headers: headers }
          )
          .then(async (response) => {
            onChangeSellerName(response.data[0].name);
            onChangeSellerCity(response.data[0].city);
            onChangeSellerPhone(response.data[0].mobilenumber);
          })
          .catch((error) => {
            // alert(error.response.data);
            // // alert(error.response.data);
            if (error.response.data === "Something went wrong (Token)") {
              alert("Please Signup/Login to View Seller Details")
              router.push({
                pathname: "/users/signup/mobilereg",
              });
            }
          });
      }
      catch (err) {
        alert("! Please check your internet connection");
      }
    }
    landDetails();
  }, []);
  // End check for login token
  // Make Call Function
  async function makeCall() {
    Linking.openURL(`tel:${sellerPhone}`);
  }
  // End Make Call Function

  // Make Whatsapp Function
  async function makeWhatsApp() {
    let msg = "Hi,%20I%20found%20you%20on%20Zland%20India.";
    let phoneWithCountryCode = `+91${sellerPhone}`;
    // let url = "whatsapp://send?text=" + msg + "&phone=" + phoneWithCountryCode;
    let url = `https://wa.me/${phoneWithCountryCode}?text=${msg}`;

    Linking.openURL(url)
      .then(data => {
        console.log("WhatsApp Opened");
      })
      .catch((err) => {
        alert("Make sure WhatsApp installed on your device");
      });
  }
  // End Whatsapp Call Function

  // BAcktoHome
  async function BacktoHome() {
    router.push({
      pathname: "/",
    });
  }

  // End Back to Home

  return (
    <View style={styles.container}>
      <Text style={styles.text}>LAND SELLER DETAILS</Text>
      <Stack.Screen
        options={{
          title: "(Selected) Seller Details",
          headerTitleAlign: "center",
        }}
      />
      <View style={styles.tableTontainer}>
        <DataTable style={styles.dataTable}>
          <DataTable.Header style={styles.header}>
            <DataTable.Title>Title</DataTable.Title>
            <DataTable.Title>Details</DataTable.Title>
          </DataTable.Header>

          <DataTable.Row>
            <DataTable.Cell>
              <Text style={styles.Qcell}>Seller Name</Text>
            </DataTable.Cell>
            <DataTable.Cell>{sellerName}</DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell>
              <Text style={styles.Qcell}>City</Text>
            </DataTable.Cell>
            <DataTable.Cell>{sellerCity}</DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell>
              <Text style={styles.Qcell}>Mobile Number</Text>
            </DataTable.Cell>
            <DataTable.Cell>{sellerPhone}</DataTable.Cell>
          </DataTable.Row>
        </DataTable>
      </View>
      <TouchableOpacity onPress={makeCall} style={styles.buttonCall}><Text style={styles.innerText}><Feather name="phone-call" size={21} color="white" />    CONTACT SELLER</Text></TouchableOpacity>
      <TouchableOpacity onPress={makeWhatsApp} style={styles.buttonWA}><Text style={styles.innerText}><FontAwesome name="whatsapp" size={24} color="white" />    WHATSAPP</Text></TouchableOpacity>
      <TouchableOpacity onPress={BacktoHome} style={styles.buttonHome}><Text style={styles.innerText}><FontAwesome name="home" size={24} color="white" />    BACK TO HOME</Text></TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  text: {
    marginBottom: 20,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  callButton: {
    marginTop: 10,
    fontSize: 10,
    marginBottom: 10,
  },
  homeButton: {
    marginTop: 10,
    fontSize: 10,
  },
  midText: {
    marginTop: 10,
  },
  dataTable: {
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#fff",
    borderBottomColor: "black",
  },
  Qcell: {
    fontWeight: "bold",
  },
  buttonCall: {
    marginTop: 10,
    fontSize: 10,
    backgroundColor: "orange",
    borderRadius: 10,
    alignItems: "center",
  },
  buttonWA: {
    marginTop: 10,
    fontSize: 10,
    backgroundColor: "green",
    borderRadius: 10,
    alignItems: "center",
  },
  buttonHome: {
    marginTop: 10,
    fontSize: 10,
    backgroundColor: "grey",
    borderRadius: 10,
    alignItems: "center",
  },

  innerText: {
    margin: 10,
    color: "white",
    fontWeight: "bold",

  },
});

export default sellerDetails;
