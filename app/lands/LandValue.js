import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Button,
  Text,
  View,
} from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


const Landvalue = ({ route }) => {
  const router = useRouter();
  const [squrefeet, onChangesqurefeet] = React.useState("");
  const [length, onChangelength] = React.useState("");
  const [width, onChangewidth] = React.useState("");
  const [price, onChangeprice] = React.useState("");
  const [note, onChangenote] = React.useState("");
  const params = useLocalSearchParams();
  const { landName, street, cityName, stateName, countryName } = params;

  async function complete() {
    async function toNumber() {
      try {
        squrefeetNumber = Number(squrefeet);
        lengthNumber = Number(length);
        widthNumber = Number(width);
        priceNumber = Number(price);
        if (squrefeetNumber && lengthNumber && widthNumber && priceNumber > 0) {
          try {
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
            try {
              loginTokenFunction()
              // Pass Data
              router.push({
                pathname: "/main/payments/checkout",
                params: {
                  name: landName,
                  street: street,
                  country: countryName,
                  state: stateName,
                  city: cityName,
                  totalsqfeet: squrefeet,
                  lengthinft: length,
                  widthinft: width,
                  price: price,
                  note: note,
                },
              });
              // End Pass Data
            }
            catch (err) {
              alert("! Please check your internet connection")
            }
          } catch (e) {
            console.log("Please try sometimes later");
            onChangesqurefeet("");
            onChangelength("");
            onChangewidth("");
            onChangeprice("");
          }
        } else {
          alert("Please fill the correct details");
          onChangesqurefeet("");
          onChangelength("");
          onChangewidth("");
          onChangeprice("");
        }
      } catch {
        alert("Please fill the correct details");
        onChangesqurefeet("");
        onChangelength("");
        onChangewidth("");
        onChangeprice("");
      }
    }
    toNumber();
  }

  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <Text style={styles.text}>LAND SIZE & PRICE DETAILS</Text>
        <Stack.Screen
          options={{
            title: "Your Land Size & Price",
            headerTitleAlign: "center",
          }}
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangesqurefeet}
          value={squrefeet}
          placeholder="Total square feets of your land (Ex: 2630)"
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangelength}
          value={length}
          placeholder="Length in Feet (approx)(Ex: 450)"
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangewidth}
          value={width}
          placeholder="Width in Feet (approx)(Ex: 750)"
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangeprice}
          value={price}
          placeholder="Price Of Your Land in rupee(Ex: 300000)"
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangenote}
          value={note}
          placeholder="Seller Note (Optional)"
        />

        <TouchableOpacity style={styles.button} onPress={complete}><Text style={styles.buttonText}>Add Land   <AntDesign name="rightcircle" size={15} color="white" /></Text></TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    justifyContent: "center",
    alignContent: "center",
  },
  input: {
    height: 50,
    marginBottom: 20,
    borderWidth: 1,
    padding: 10,
    borderRadius: 50,
  },
  text: {
    marginBottom: 25,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  button: {
    backgroundColor: "blue",
    alignItems: "center",
    borderRadius: 50
  },
  buttonText: {
    margin: 10,
    color: "white",
    fontWeight: "bold",
    fontSize: 15
  }
});

export default Landvalue;
