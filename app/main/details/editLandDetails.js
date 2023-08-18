import React, { useEffect } from "react";
import { View, StyleSheet, Text, Button, TouchableOpacity, TextInput } from "react-native";
import { DataTable } from "react-native-paper";
import { useRouter, Stack, useLocalSearchParams } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EvilIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';



const editLandDetails = ({ route }) => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { landId } = params;
    const [id, onChangeId] = React.useState("");
    const [currentLandName, onChangeCurrentLandName] = React.useState("");
    const [currentUserId, onChangeUserId] = React.useState("");
    const [currentLandSqureFeet, onChangeCurrentLandSqureFeet] =
        React.useState("");
    const [currentLandLength, onChangeCurrentLandLength] = React.useState("");
    const [currentLandWidth, onChangeCurrentLandWidth] = React.useState("");
    const [currentLandPrice, onChangeCurrentLandPrice] = React.useState("");
    const [currentLandStreet, onChangeCurrentLandStreet] = React.useState("");
    // postable states
    const [name, onChangeName] = React.useState("");
    const [squrefeet, onChangeSqurefeet] = React.useState("");
    const [length, onChangeLength] = React.useState("");
    const [width, onChangeWidth] = React.useState("");
    const [price, onChangePrice] = React.useState("");
    const [Sname, onChangeSname] = React.useState("");

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
            try {
                const lands = await axios
                    .post(
                        "http://ec2-3-109-5-112.ap-south-1.compute.amazonaws.com:5000/api/landController/landDetails",
                        { landId: landId }
                        // { headers: headers }
                    )
                    .then(async (response) => {
                        onChangeId(response.data[0]._id);
                        onChangeCurrentLandName(response.data[0].name);
                        onChangeUserId(response.data[0].userId);
                        onChangeCurrentLandSqureFeet(response.data[0].totalsqfeet);
                        onChangeCurrentLandLength(response.data[0].lengthinft);
                        onChangeCurrentLandWidth(response.data[0].widthinft);
                        onChangeCurrentLandPrice(response.data[0].price);
                        onChangeCurrentLandStreet(response.data[0].street);
                        // Declarations

                    })
                    .catch((error) => {
                        // alert(error.response.data);
                        if (error.response.data === "Something went wrong (Token)") {
                            alert("Please Login to Edit Land Details")
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
    async function update() {
        // Validation
        if (squrefeet.length === 0) {
            alert("Squarefeet should not be empty")
            return
        }
        if (length.length === 0) {
            alert("Length should not be empty")
            return
        }
        if (width.length === 0) {
            alert("Width should not be empty")
            return
        }
        if (price.length === 0) {
            alert("Price should not be empty")
            return
        }
        if (Sname.length === 0) {
            alert("Street name should not be empty")
            return
        }

        // Number Validation
        async function toNumber() {
            squrefeetNumber = Number(squrefeet);
            lengthNumber = Number(length);
            widthNumber = Number(width);
            priceNumber = Number(price);
        }
        await toNumber()
        if (squrefeetNumber && lengthNumber && widthNumber && priceNumber > 0) {
            const headers = {
                authorizatrion: await loginTokenFunction(),
            };
            try {
                const landsUpdate = await axios
                    .post(
                        "http://ec2-3-109-5-112.ap-south-1.compute.amazonaws.com:5000/api/landController/update",
                        {
                            landId: id,
                            name: currentLandName,
                            sq: squrefeetNumber,
                            length: lengthNumber,
                            width: widthNumber,
                            price: priceNumber,
                            street: Sname
                        },
                        { headers: headers }
                    )
                    .then(async (response) => {
                        alert(response.data);
                        const Refresh = response.data;
                        router.push({
                            pathname: "/lands/allMyLands",
                        });
                    })
                    .catch((error) => {
                        alert("Something went wrong, Please check and try again")
                    });
            }
            catch {
                alert("Something went wrong, Please check and try again")
            }
        } else {
            alert("Please fill the correct details")
            return
        }
        // End Number Validation
        // End validation



    }

    // Login token
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
    // End Login token

    async function landDelete() {
        console.log("landDelete")
        try {
            const headers = {
                authorizatrion: await loginTokenFunction(),
            };
            const lands = await axios
                .post(
                    "http://ec2-3-109-5-112.ap-south-1.compute.amazonaws.com:5000/api/landController/delete",
                    { landId: landId },
                    { headers: headers }
                )
                .then(async (response) => {
                    alert(response.data)
                    router.push({
                        pathname: "/lands/allMyLands",
                    });
                })
                .catch((error) => {
                    // alert(error.response.data);
                    if (error.response.data === "Something went wrong (Token)") {
                        alert("Please Signup/Login to Continue...");
                        router.push({
                            pathname: "/users/signup/mobilereg",
                        });
                    }
                });
        }
        catch (err) {
            alert("Something went wrong");
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>EDIT LAND</Text>
            <Stack.Screen
                options={{
                    title: "Update Your Land",
                    headerTitleAlign: "center",
                    headerRight: () => (
                        <View>
                            <TouchableOpacity onPress={navigation}><EvilIcons name="navicon" size={35} color="black" /></TouchableOpacity>
                        </View>
                    )
                }}
            />
            {/* View for update */}
            <View>
                <Text>Land name</Text>
                <TextInput
                    style={styles.inputText}
                    value={currentLandName}
                />
                <Text>Land square feet</Text>
                <TextInput
                    style={styles.inputText}
                    onChangeText={onChangeSqurefeet}
                />
                <Text>Land length (ft)</Text>
                <TextInput
                    style={styles.inputText}
                    onChangeText={onChangeLength}
                />
                <Text>Land width (ft)</Text>
                <TextInput
                    style={styles.inputText}
                    onChangeText={onChangeWidth}
                />
                <Text>Land price (In Rs)</Text>
                <TextInput
                    style={styles.inputText}
                    onChangeText={onChangePrice}
                />
                <Text>Street name</Text>
                <TextInput
                    style={styles.inputText}
                    onChangeText={onChangeSname}
                />

            </View>
            {/* End view for update */}

            <TouchableOpacity style={styles.buttonEdit} onPress={update}><Text style={styles.buttonText}><MaterialIcons name="update" size={15} color="white" />   Update now</Text></TouchableOpacity>

            <TouchableOpacity style={styles.buttonHome} onPress={() => {
                router.push({
                    pathname: "/lands/allMyLands",
                    params: { userId: currentUserId },
                });
            }}><Text style={styles.buttonText}><AntDesign name="banckward" size={15} color="white" />  All Your Lands</Text></TouchableOpacity>
        </View>
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
    buttonEdit: {
        marginTop: 5,
        fontSize: 10,
        backgroundColor: "orange",
        alignItems: "center",
        borderRadius: 10
    },
    buttonDelete: {
        marginTop: 5,
        fontSize: 10,
        backgroundColor: "red",
        alignItems: "center",
        borderRadius: 10
    },
    buttonHome: {
        marginTop: 5,
        fontSize: 10,
        backgroundColor: "blue",
        alignItems: "center",
        borderRadius: 10
    },
    buttonText: {
        color: "white",
        margin: 8,
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
    input: {
        height: 50,
        width: 280,
        marginBottom: 25,
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
    },
    inputText: {
        height: 40,
        width: "100%",
        marginBottom: 20,
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
    }
});

export default editLandDetails;
