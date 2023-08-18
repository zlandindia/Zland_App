import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  Button,
  Text,
  View,
  TouchableOpacity,
  Image
} from "react-native";
import { useRouter, Stack, useLocalSearchParams } from "expo-router";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { firebaseConfig } from "../../config";
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const OTPSUBMIT = ({ route }) => {
  const [text, onChangeText] = React.useState();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { verificationId, currentMobile } = params;
  const [disabled, onChangedisabled] = React.useState(false);


  const handleClick = async (e) => {
    try {
      // Check for OTP
      const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId, text
      );
      console.log(verificationId)
      console.log(text)
      console.log(credential)
      onChangedisabled(true)
      firebase.auth().signInWithCredential(credential).then(() => {
        router.push({
          pathname: "/users/signup/userDetails",
          params: { currentMobile: currentMobile },
        });
      }).catch((err) => {
        alert("Invalid OTP");
        onChangeText("");
      })
      // End Check for OTP
    } catch (e) {
      alert(e);
      // alert("Please Try Again");
      onChangeText("");
    }
  };

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
        <Stack.Screen options={{ headerShown: true }} />
        <Image style={styles.image} source={require('../../media/images/zland_logo_main.png')} />

        <Text style={styles.text}>Register (2/3)</Text>
        <Stack.Screen options={{ alignItems: "center", title: "Home" }} />
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={text}
          placeholder="Enter OTP"
          keyboardType='number-pad'
        />
        <TouchableOpacity
          disabled={disabled}
          style={styles.button}
          type="number"
          onPress={handleClick}
        ><Text style={styles.buttonText}>Submit</Text></TouchableOpacity>

        <TouchableOpacity onPress={Signin}>
          <Text style={styles.signin}>Already have account? SignIn</Text>
        </TouchableOpacity>
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
  otp: {
    marginBottom: 10,
    fontSize: 20,
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
  }
});

export default OTPSUBMIT;
