import React, { useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Button,
  Text,
  View,
} from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { Dropdown } from "react-native-element-dropdown";
import { AntDesign } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'



const country = require("country-state-city").Country;
const state = require("country-state-city").State;
const city = require("country-state-city").City;


const LandLocation = ({ route }) => {
  const [street, onChangeStreet] = React.useState("");
  const router = useRouter();
  const params = useLocalSearchParams();
  const { landName } = params;
  const [isFocus, setIsFocus] = useState(false);
  const [currentCountry, setCountry] = useState("");
  const [currentState, setState] = useState("");
  const [currentCity, setCity] = useState("");

  async function valuepage() {
    if (street.length > 0) {
      if (currentCountry.length > 0) {
        if (currentState.length > 0) {
          if (currentCity.length > 0) {
            router.push({
              pathname: "/lands/LandValue",
              params: {
                landName: landName,
                street: street,
                cityName: currentCity,
                stateName: currentState,
                countryName: currentCountry,
              },
            });
          } else {
            alert("Please select a city");
          }
        } else {
          alert("Please select a state");
        }
      } else {
        alert("Please select a country");
      }
    } else {
      alert("Please provide a valid street line");
    }
  }
  // Fetch country
  function CountriesData() {
    AllCountries = country.getAllCountries();
    var count = Object.keys(AllCountries).length;
    let countryArray = [];
    for (var i = 0; i < count; i++) {
      countryArray.push({
        value: AllCountries[i].isoCode,
        label: AllCountries[i].name,
      });
    }
    return countryArray;
  }
  // fetch state
  function StateData() {
    AllStates = state.getStatesOfCountry(currentCountry);
    var count = Object.keys(AllStates).length;
    let StateArray = [];
    for (var i = 0; i < count; i++) {
      StateArray.push({
        value: AllStates[i].isoCode,
        label: AllStates[i].name,
      });
    }
    return StateArray;
  }
  // fetch city
  function CitiesData() {
    AllStates = city.getCitiesOfState(currentCountry, currentState);
    var count = Object.keys(AllStates).length;
    let StateArray = [];
    for (var i = 0; i < count; i++) {
      StateArray.push({
        value: AllStates[i].name,
        label: AllStates[i].name,
      });
    }
    return StateArray;
  }
  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <Text style={styles.text}>ENTER LAND LOCATION DETAILS</Text>
        <Stack.Screen
          options={{
            title: "Your Land Location",
            headerTitleAlign: "center",
          }}
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangeStreet}
          value={street}
          placeholder="Street Line"
        />
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={CountriesData()}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? "Select Country" : "..."}
          searchPlaceholder="Search..."
          value={currentCountry}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            setCountry(item.value);
            setIsFocus(false);
          }}
        />
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={StateData()}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? "Select State" : "..."}
          searchPlaceholder="Search..."
          value={currentState}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            setState(item.value);
            setIsFocus(false);
          }}
        />
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={CitiesData()}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? "Select City" : "..."}
          searchPlaceholder="Search..."
          value={currentCity}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            setCity(item.value);
            setIsFocus(false);
          }}
        />
        <TouchableOpacity style={styles.button} onPress={valuepage}><Text style={styles.buttonText}>Next    <AntDesign name="rightcircle" size={15} color="white" /></Text></TouchableOpacity>
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
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 50,
    paddingHorizontal: 8,
    marginBottom: 20,
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
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
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

export default LandLocation;
