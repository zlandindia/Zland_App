import React from "react";
import { View, StyleSheet, TextInput, Button, Text, Image, TouchableOpacity } from "react-native";
import {
  useRouter,
  Stack,
  useLocalSearchParams,
} from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';



const Userdetails = ({ route }) => {
  const [name, onChangename] = React.useState();
  const [city, onChangecity] = React.useState();
  const [value, onChangeValue] = React.useState("Buyer");
  const [password1, onChangepassword1] = React.useState();
  const [password2, onChangepassword2] = React.useState();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { currentMobile } = params;
  const [disabled, onChangedisabled] = React.useState(false);

  var radio_props = [
    { label: 'Buyer', value: "Buyer" },
    { label: 'Seller', value: "Seller" }
  ];

  // API Request
  const handleClick = async (e) => {
    // Get the login token
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem("loginkey");
        if (value !== null) {
          console.log(value);
        }
      } catch (e) {
        console.log(e);
      }
    };
    // End get login token
    // Set the login token
    const storeData = async (value) => {
      try {
        await AsyncStorage.setItem("loginkey", JSON.stringify(value));
      } catch (e) {
        console.log(e);
      }
    };
    // End set login token
    try {
      if (password1 === password2) {
        if (name.trim().length >= 4) {
          try {
            onChangedisabled(true)
            const res = await axios
              .post(
                "http://ec2-3-109-5-112.ap-south-1.compute.amazonaws.com:5000/api/userController/UserDetails",
                {
                  mobilenumber: currentMobile,
                  name: name,
                  city: city,
                  password: password1,
                  userType: value,
                }
              )
              .then((response) => {
                storeData(response.data);
                router.push({
                  pathname: "/",
                });
                getData();
              })
              .catch((error) => {
                alert(error.response.data);
                if (error.response.data === "user already exist") {
                  router.push({
                    pathname: "/users/signin/userLogin",
                  });
                }
                onChangename("");
                onChangecity("");
                onChangepassword1("");
                onChangepassword2("");
              });
          }
          catch (e) {
            alert("! Please check your internet connection");
          }
        } else {
          alert("Name should be more then 4 charecters");
          onChangename("");
        }
      } else {
        alert("Password & Re-enter password not matching");
        onChangepassword1("");
        onChangepassword2("");
      }
    } catch (e) {
      alert("Something Went Wrong");
      onChangename("");
      onChangecity("");
      onChangepassword1("");
      onChangepassword2("");
    }
  };
  // End Api Request
  // to SignIn page
  const Signin = () => {
    router.push({
      pathname: "/users/signin/userLogin",
    });
  };
  // end To SignIn page
  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <Image style={styles.image} source={require('../../media/images/zland_logo_main.png')} />

        <Text style={styles.text}>Register (3/3)</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangename}
          value={name}
          placeholder="Your Name"
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangecity}
          value={city}
          placeholder="Your City"
        />
        {/* Radio Button */}
        <View style={styles.radioInput}>
          <Text style={styles.landText}>I am a land</Text>
          <View style={styles.landText}>
            <RadioForm
              radio_props={radio_props}
              initial={value}
              onPress={value => {
                onChangeValue(value)
                console.log(value)
              }}
              buttonColor="grey"
              labelColor="black"
              selectedButtonColor="black"
              selectedLabelColor="black"
              labelHorizontal={false}
              formHorizontal={true}

            />
          </View>
        </View>
        {/* End Radio Button */}
        <TextInput
          style={styles.input}
          onChangeText={onChangepassword1}
          value={password1}
          type="password"
          secureTextEntry={true}
          placeholder="Set Password"
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangepassword2}
          value={password2}
          type="password"
          secureTextEntry={true}
          placeholder="Re-enter Password"
        />

        <TouchableOpacity
          disabled={disabled}
          style={styles.button}
          onPress={handleClick}
        >
          <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
        </TouchableOpacity>

      </View>
    </KeyboardAwareScrollView >
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 50,
    width: 280,
    marginBottom: 25,
    borderWidth: 1,
    padding: 10,
    borderRadius: 50,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  signin: {
    marginTop: 20,
    color: "blue",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    textDecorationLine: "underline",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 40,
    marginTop: 20,
    resizeMode: "contain",
    borderRadius: 10,
  },
  button: {
    backgroundColor: "blue", marginTop: 10, borderRadius: 50
  },
  buttonText: {
    color: "white", paddingLeft: 60, paddingRight: 60, paddingTop: 10, paddingBottom: 10, fontSize: 15, fontWeight: "bold"
  },
  landText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10
  },
  radioInput: {
    borderColor: "black"
  }
});
export default Userdetails;
