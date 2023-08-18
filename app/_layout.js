import { Stack, useRouter } from "expo-router";
import React from "react";
import {
  View,
  TouchableOpacity,
} from "react-native";
import { EvilIcons } from '@expo/vector-icons';



async function mylands() {
  const router = useRouter();
  router.push({
    pathname: "/lands/allMyLands",
  });
  console.log("Hello")
}

export default () => {

  return <Stack screenOptions={{


  }}></Stack>;
};
