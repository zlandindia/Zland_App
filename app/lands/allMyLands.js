import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { Card } from "react-native-paper";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EvilIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';


// Main Component
export default function AllMyLandsList() {
  const [allLands, onChangeLands] = React.useState("");
  const [textShow, onChangeTextShow] = React.useState("");

  // Land lenth function
  async function landsLength() {
    if (allLands.length === 0) {
      await onChangeTextShow(true);
    } else {
      await onChangeTextShow(false);
    }
  }
  // End Land Length function

  async function navigation() {
    router.push({
      pathname: "/main/navigation",
    });
  }

  // End Existing cities
  useEffect(() => {
    async function getlands() {
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
            alert("Please Signup/Login to View Your Lands")
            router.push({
              pathname: "/users/signup/mobilereg",
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
            "http://ec2-3-109-5-112.ap-south-1.compute.amazonaws.com:5000/api/landController/allMyLands",
            {},
            { headers: headers }
          )
          .then(async (response) => {
            await onChangeLands(response.data);
            await landsLength();
          })
          .catch((error) => {
            // alert(error.response.data);
            if (error.response.data === "Something went wrong (Token)") {
              alert("Please Signup/Login to View Your Lands")
              router.push({
                pathname: "/users/signup/mobilereg",
              });
            }
          });
      }
      catch (e) {
        alert("! Please check your internet connection")
      }
    }
    getlands();
  }, [textShow]);
  // End check for login token

  const renderItem = ({ item }) => <Item CurrentItem={item} />;
  const router = useRouter();
  async function mylands() {
    router.push({
      pathname: "/lands/landName",
    });
  }
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "My Lands", headerTitleAlign: "center", headerRight: () => (
            <View>
              <TouchableOpacity onPress={navigation}><EvilIcons name="navicon" size={35} color="black" /></TouchableOpacity>
            </View>
          )
        }}
      />
      {/* Text shouls show test */}
      {textShow ? (
        <Text style={styles.noLand}>! Wait ... Currently you have no lands added</Text>
      ) : null}
      {/* End Text shouls show test  */}
      <FlatList
        data={allLands}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
      {/* Your Lands */}
      <TouchableOpacity onPress={mylands} style={styles.floating}>
        <Text style={styles.floatingtext}>  <AntDesign name="pluscircle" size={20} color="white" />   Add My Land  </Text>
      </TouchableOpacity>
      {/* {End Your lands} */}
    </View>
  );
}
// End Main Component

const Item = ({ CurrentItem }) => {
  const router = useRouter();
  return (
    <View style={styles.item}>
      <Card
        style={styles.card}
        onPress={() => {
          router.push({
            pathname: "/main/details/landDetailsView",
            params: { landId: CurrentItem._id },
          });
        }}
      >
        <View style={styles.linecontainer}>
          <Text style={styles.textName}>Name</Text>
          <Text style={styles.text}>{CurrentItem.name}</Text>
        </View>
        <View style={styles.linecontainer}>
          <Text style={styles.textName}>City</Text>
          <Text style={styles.text}>{CurrentItem.city}</Text>
        </View>

        <View style={styles.linecontainer}>
          <Text style={styles.textName}>Street</Text>
          <Text style={styles.text}>{`${CurrentItem.street.substring(
            0,
            13
          )}....`}</Text>
        </View>

        <View style={styles.linecontainer}>
          <Text style={styles.textName}>Square Feet</Text>
          <Text
            style={styles.text}
          >{`${CurrentItem.totalsqfeet} (${CurrentItem.lengthinft} L & ${CurrentItem.widthinft} W) `}</Text>
        </View>

        <View style={styles.linecontainer}>
          <Text style={styles.textName}>Price (Rs)</Text>
          <Text style={styles.text}>₹ {(CurrentItem.price).toLocaleString('en-IN')}</Text>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 2,
    backgroundColor: "white",
    borderRadius: 10,
    height: "100%",
  },
  item: {
    padding: 3,
  },
  nameText: {
    bottom: 10,
    right: 20,
    position: "absolute",
    backgroundColor: "#B9B7BD",
    paddingHorizontal: 10,
    color: "white",
    borderRadius: 10,
  },
  card: {
    padding: 3,
    marginBottom: 5,
  },
  linecontainer: {
    flex: 1,
    flexDirection: "row",
    padding: 10,
    marginLeft: 10,
  },
  cityStrap: {
    flexDirection: "row",
  },
  text: {
    flex: 1,
    fontSize: 15,
    margin: 0,
  },
  textName: { flex: 1, fontSize: 15, margin: 0, fontWeight: "bold" },
  floating: {
    width: 165,
    height: 45,
    borderRadius: 30,
    backgroundColor: "blue",
    position: "absolute",
    bottom: 40,
    right: 20,
  },
  floatingtext: {
    fontSize: 20,
    textAlign: "center",
    justifyContent: "center",
    marginTop: 6,
    color: "white",
    fontWeight: "bold",
  },
  sellername: {
    position: "absolute",
    bottom: 5,
    right: 5,
  },
  dropdown: {
    height: 50,
    borderColor: "white",
    backgroundColor: "white",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 10,
    width: "85%",
    marginRight: 5,
  },
  clearButton: {
    height: 40,
    width: "15%",
    borderRadius: 10,
    backgroundColor: "blue",
    marginTop: 5,
  },
  clearButtonText: {
    color: "white",
    textAlign: "center",
    justifyContent: "center",
    marginTop: "10%",
    fontWeight: "bold",
    textAlign: "center",
  },
  noLand: {
    fontSize: 15,
    textAlign: "center",
    justifyContent: "center",
    marginTop: "50%",
    fontWeight: "bold",
  },
});
