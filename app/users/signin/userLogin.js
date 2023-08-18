import React, { useEffect } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  TextInput,
  Button,
  Text,
  Image,
} from "react-native";
import { useRouter, Stack, useNavigation } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


const Userlogin = () => {
  const [mobile, onChangemobile] = React.useState();
  const [password, onChangepassword] = React.useState();
  const [disabled, onChangedisabled] = React.useState(false);
  const router = useRouter();
  // Set the login token
  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem("loginkey", JSON.stringify(value));
    } catch (e) {
      console.log(e);
    }
  };
  // End set login token

  // to Signup page
  const Signup = () => {
    router.push({
      pathname: "/users/signup/mobilereg",
    });
  };
  // end To Signup page

  // Onclick event
  const handleClick = async (e) => {
    try {
      if (String(mobile).length == 10) {
        onChangedisabled(true)
        const res = await axios
          .post("http://ec2-3-109-5-112.ap-south-1.compute.amazonaws.com:5000/api/userController/login", {
            mobilenumber: mobile,
            password: password,
          })
          .then(async (response) => {
            await storeData(response.data);
            router.push({
              pathname: "/",
            });
          })
          .catch((error) => {
            // alert(error.response.data);
            onChangemobile("");
            onChangepassword("");
          });
      } else {
        alert("Mobile number should be 10 digit");
      }
    } catch (e) {
      alert(e);
    }
  };
  // end onclick event

  // Navigation
  const navigation = useNavigation();

  // Effect
  useEffect(() => {
    navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
      console.log('onback');
      // Do your stuff here
      navigation.dispatch(e.data.action);
    });
  }, []);


  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <Image style={styles.image} source={require('../../media/images/zland_logo_main.png')} />
        <Text style={styles.text}>Login</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangemobile}
          value={mobile}
          placeholder="Mobile Number(10 digit)"
          keyboardType='phone-pad'
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangepassword}
          value={password}
          placeholder="Password"
          secureTextEntry={true}
        />
        <TouchableOpacity disabled={disabled} style={styles.button} onPress={handleClick}><Text style={styles.buttonText}>Login</Text></TouchableOpacity>
        <TouchableOpacity onPress={Signup}>
          <Text style={styles.signup}>New user? Please signUp</Text>
        </TouchableOpacity>

        <Stack.Screen
          options={{
            title: "Login",
          }}
        />
      </View>
    </KeyboardAwareScrollView>
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
    marginBottom: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 50,
  },
  signup: {
    marginTop: 20,
    color: "blue",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    textDecorationLine: "underline",
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 40,
    marginTop: 20,
    resizeMode: "contain",
    borderRadius: 10,
  },
  button: { backgroundColor: "blue", marginTop: 10, borderRadius: 50 },
  buttonText: { color: "white", paddingLeft: 60, paddingRight: 60, paddingTop: 10, paddingBottom: 10, fontSize: 15, fontWeight: "bold" },
});

export default Userlogin;
