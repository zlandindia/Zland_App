import React, { useEffect } from "react";
import { View, StyleSheet, Text, Button, TouchableOpacity } from "react-native";
import { DataTable } from "react-native-paper";
import { useRouter, Stack, useLocalSearchParams } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EvilIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'



const landDetails = ({ route }) => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { landId } = params;
  const [currentLandName, onChangeCurrentLandName] = React.useState("");
  const [currentUserId, onChangeUserId] = React.useState("");
  const [currentLandSqureFeet, onChangeCurrentLandSqureFeet] =
    React.useState("");
  const [currentLandLength, onChangeCurrentLandLength] = React.useState("");
  const [currentLandWidth, onChangeCurrentLandWidth] = React.useState("");
  const [currentLandPrice, onChangeCurrentLandPrice] = React.useState("");
  const [currentLandStreet, onChangeCurrentLandStreet] = React.useState("");
  const [currentLandCity, onChangeCurrentLandCity] = React.useState("");
  const [currentLandState, onChangeCurrentLandState] = React.useState("");
  const [currentLandNote, onChangeCurrentLandNote] = React.useState("");

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
      // const headers = {
      //   authorizatrion: await loginTokenFunction(),
      // };
      try {
        const lands = await axios
          .post(
            "http://ec2-3-109-5-112.ap-south-1.compute.amazonaws.com:5000/api/landController/landDetails",
            { landId: landId }
            // { headers: headers }
          )
          .then(async (response) => {
            onChangeCurrentLandName(response.data[0].name);
            onChangeUserId(response.data[0].userId);
            onChangeCurrentLandSqureFeet(response.data[0].totalsqfeet);
            onChangeCurrentLandLength(response.data[0].lengthinft);
            onChangeCurrentLandWidth(response.data[0].widthinft);
            onChangeCurrentLandPrice(response.data[0].price);
            onChangeCurrentLandStreet(response.data[0].street);
            onChangeCurrentLandCity(response.data[0].city);
            onChangeCurrentLandState(response.data[0].state);
            onChangeCurrentLandNote(response.data[0].note);
          })
          .catch((error) => {
            // alert(error.response.data);
            if (error.response.data === "Something went wrong (Token)") {
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

  async function navigation() {
    router.push({
      pathname: "/main/navigation",
    });
  }

  async function sellerDetails() {
    router.push({
      pathname: "/main/details/sellerDetails",
      params: { userId: currentUserId },
    });
  }


  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <Text style={styles.text}>LAND DETAILS</Text>
        <Stack.Screen
          options={{
            title: "(Selected) Land Details",
            headerTitleAlign: "center",
            headerRight: () => (
              <View>
                <TouchableOpacity onPress={navigation}><EvilIcons name="navicon" size={35} color="black" /></TouchableOpacity>
              </View>
            )
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
                <Text style={styles.Qcell}>Land Name</Text>
              </DataTable.Cell>
              <DataTable.Cell>{currentLandName}</DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>
                <Text style={styles.Qcell}>Square feet</Text>
              </DataTable.Cell>
              <DataTable.Cell>{currentLandSqureFeet}</DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>
                <Text style={styles.Qcell}>Length & Width (ft)</Text>
              </DataTable.Cell>
              <DataTable.Cell>
                {currentLandLength} & {currentLandWidth}
              </DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>
                <Text style={styles.Qcell}>Price in rupees</Text>
              </DataTable.Cell>
              <DataTable.Cell>{(currentLandPrice).toLocaleString('en-IN')}</DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>
                <Text style={styles.Qcell}>Street Line</Text>
              </DataTable.Cell>
              <DataTable.Cell>{currentLandStreet}</DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>
                <Text style={styles.Qcell}>City</Text>
              </DataTable.Cell>
              <DataTable.Cell>{currentLandCity}</DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>
                <Text style={styles.Qcell}>State</Text>
              </DataTable.Cell>
              <DataTable.Cell>{currentLandState}</DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>
                <Text style={styles.Qcell}>Seller Note</Text>
              </DataTable.Cell>
              <DataTable.Cell>{currentLandNote}</DataTable.Cell>
            </DataTable.Row>
          </DataTable>
        </View>
        <Text style={styles.midText}></Text>
        <TouchableOpacity onPress={sellerDetails} style={styles.button}><Text style={styles.innerText}><AntDesign name="contacts" size={21} color="white" />   CONTACT SELLER</Text></TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
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
  button: {
    marginTop: 10,
    fontSize: 10,
    backgroundColor: "blue",
    borderRadius: 10,
    alignItems: "center",
  },
  innerText: {
    margin: 10,
    color: "white",
    fontWeight: "bold",

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
});

export default landDetails;
