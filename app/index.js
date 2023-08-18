import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
  Linking
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { Card } from "react-native-paper";
import axios from "axios";
import { Dropdown } from "react-native-element-dropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EvilIcons } from '@expo/vector-icons';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { color } from "react-native-reanimated";
import { AntDesign } from '@expo/vector-icons';
import useGenerateRandomColor from "./supports/colorGenerator";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

function sendingTokenBackend(newToken) {
  console.log(newToken)
  try {
    const res = axios
      .post("http://ec2-3-109-5-112.ap-south-1.compute.amazonaws.com:5000/api/notifications/AddToken", {
        token: newToken,
      }).then(async (response) => {
        console.log(response.data)
      }).catch((error) => {
        console.log(error.data)
      });
  }
  catch {
    console.log("catch error")
  }
}




async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;

    // Sending Token to Backend
    sendingTokenBackend(token)
    // End Sending token to backend
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

// Main Component
export default function Page() {
  const [city, onChangecity] = React.useState("Select City");
  const [allLands, onChangeLands] = React.useState("");
  const [isFocus, setIsFocus] = React.useState(false);
  const renderItem = ({ item }) => <Item CurrentItem={item} />;
  const router = useRouter();
  const [CitiesData, onChangeCitiesData] = React.useState([
    { label: "Select City", data: "Select City" },
  ]);
  const [clearButton, onChangeClearButton] = React.useState(false);
  const [loading, onChangeLoading] = React.useState(true);
  const [expoPushToken, setExpoPushToken] = React.useState('');
  const [notification, setNotification] = React.useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  // Remove duplicates from array
  function removeDuplicates(arr) {
    return arr.filter((item, index) => arr.indexOf(item) === index);
  }
  // end remove duplicates

  async function mylands() {
    router.push({
      pathname: "/lands/allMyLands",
    });
  }

  // Land lenth function
  async function landsLength() {
    if (allLands.length === 0) {
      await onChangeLoading(true);
    } else {
      await onChangeLoading(false);
    }
  }
  // End Land Length function

  async function navigation() {
    router.push({
      pathname: "/main/navigation",
    });
  }

  async function checkout() {
    router.push({
      pathname: "/main/payments/checkout",
    });
  }


  async function citiesFunction(allCities) {
    var count = allCities.length;
    let allCitiesArray = [];
    for (let i = 0; i < count; i++) {
      allCitiesArray.push(allCities[i].city);
    }
    uniqueCities = removeDuplicates(allCitiesArray);
    uniqueCitiesCount = uniqueCities.length;
    uniqueCitiesList = [];
    for (let j = 0; j < uniqueCitiesCount; j++) {
      uniqueCitiesList.push({
        value: uniqueCities[j],
        label: uniqueCities[j],
      });
    }
    onChangeCitiesData(uniqueCitiesList);
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

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
            router.push({
              pathname: "/users/signin/userLogin",
            })
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
            "http://ec2-3-109-5-112.ap-south-1.compute.amazonaws.com:5000/api/landController/allLands",
            {
              city: city,
            }
            // { headers: headers }
          )
          .then(async (response) => {
            onChangeLands(response.data);
            citiesFunction(response.data);
          })
          .catch((error) => {
            if (error.response.data === "Something went wrong (Token)") {
              alert("Please /SignupLogin to Continue...")
              router.push({
                pathname: "/users/signup/mobilereg",
              });
            }
          })
      }
      catch (e) {
        alert("! Please check your internet connection")
      }
    }
    getlands();
  }, [city]);
  // End check for login token

  useEffect(() => {
    landsLength();
  }, [allLands])


  // logout

  // Clear Cities
  async function clearCities() {
    onChangecity("Select City");
    onChangeClearButton(false);
  }
  // End Clear Cities

  const { color, generateColor }
    = useGenerateRandomColor();

  return (
    <View style={styles.container}>
      {/* City Drop down */}
      <View style={styles.cityStrap}>

        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={CitiesData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? "Select City" : "..."}
          searchPlaceholder="Search..."
          value={city}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            onChangecity(item.value);
            onChangeClearButton(true);
            setIsFocus(false);
          }}
        />
        {/* style={styles.clearButton} */}
        {clearButton ? (
          <TouchableOpacity onPress={clearCities} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={clearCities}
            style={styles.clearButtonGrey}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
      {/* End drop down */}
      <Stack.Screen
        options={{
          title: "Top Lands",
          headerTitleAlign: "center",
          headerRight: () => (
            <View>
              <TouchableOpacity onPress={navigation}><EvilIcons name="navicon" size={35} color="black" /></TouchableOpacity>
            </View>
          ),
          headerLeft: () => (
            <View>
              {/* <Text style={styles.zland}>ZLAND</Text> */}
              <Image source={require('./media/images/zlandlogo.png')} style={styles.zlandImage} />
              <Text style={styles.zlandText}>ZLAND</Text>
            </View>
          )
        }}
      />
      {loading ? (
        <Image
          style={styles.loading}
          source={require('./media/images/loading.gif')} />
      ) : null}
      <FlatList
        data={allLands}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
      {/* Your Lands */}
      <TouchableOpacity onPress={mylands} style={styles.floating}>
        <Text style={styles.floatingtext}>  <AntDesign name="pluscircle" size={20} color="white" />   Sell My Land  </Text>
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
            pathname: "/main/details/landDetails",
            params: { landId: CurrentItem._id },
          });
        }}
      >
        <View style={{
          backgroundColor: "#00DEFF",
          borderRadius: 20
        }}>
          <Text style={styles.landtitle}>{`${CurrentItem.name.substring(0, 12)}..`}</Text>
        </View>
        <View style={styles.linecontainer}>
          <Text style={styles.textName}>City & State</Text>
          <Text style={styles.text}>
            {CurrentItem.city} - {CurrentItem.state}
          </Text>
        </View>

        <View style={styles.linecontainer}>
          <Text style={styles.textName}>Street</Text>
          <Text style={styles.text}>{`${CurrentItem.street.substring(
            0,
            30
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

        <Text style={styles.nameText}>{CurrentItem.name.substring(0, 3)}</Text>
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
    right: 10,
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
    borderColor: "black"
  },
  clearButtonGrey: {
    height: 40,
    width: "15%",
    borderRadius: 10,
    marginTop: 5,
  },
  clearButton: {
    height: 40,
    width: "15%",
    borderRadius: 10,
    backgroundColor: "yellow",
    marginTop: 5,
  },
  clearButtonText: {
    color: "black",
    textAlign: "center",
    justifyContent: "center",
    marginTop: "10%",
    fontWeight: "bold",
    textAlign: "center",
    borderColor: "black",
  },
  loading: {
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "20%",
    marginLeft: "15%",
    width: 300,
    height: 300,
  },
  zlandImage: {
    height: 40,
    width: 40,
  },
  zlandText: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: 15,
    color: "black",
  },
  landtitle: {
    paddingBottom: 5,
    paddingTop: 5,
    paddingLeft: "30%",
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 15,
    textTransform: 'uppercase',
    color: "white",
  },
  titleView: {
    backgroundColor: "#00DEFF",
    borderRadius: 20
  },
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
});
