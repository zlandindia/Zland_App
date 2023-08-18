import React, { useState } from "react";
import { StyleSheet, TextInput, Button, Text, View, TouchableOpacity } from "react-native";
import { useRouter, Stack } from "expo-router";
import { AntDesign } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


const Landregister = () => {
  const [text, onChangeText] = React.useState("");
  const router = useRouter();

  async function locationpage() {
    if (text.length >= 8) {
      router.push({
        pathname: "/lands/landLocation",
        params: { landName: text },
      });
    } else {
      alert("Land name should be at least 8 characters");
      onChangeText("");
    }
  }

  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <Text style={styles.text}>ENTER YOUR LAND NAME</Text>
        <Stack.Screen
          options={{
            title: "Your Land Name",
            headerTitleAlign: "center",
          }}
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={text}
          placeholder="Your Land Name (Ex: Sky Lands)"
        />
        <TouchableOpacity style={styles.button} onPress={locationpage}><Text style={styles.buttonText}>Next    <AntDesign name="rightcircle" size={15} color="white" /></Text></TouchableOpacity>
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
    borderWidth: 0.5,
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

export default Landregister;
