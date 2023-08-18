import { View, Text, TextInput, TouchableOpacity, StyleSheet, } from 'react-native'
import React, { useEffect } from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, Stack } from "expo-router";
import { EvilIcons } from '@expo/vector-icons';
import axios from "axios";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'





const feedback = () => {
    const [token, onChangeToken] = React.useState(false);
    const [feedback, onChangeFeedback] = React.useState("");
    const router = useRouter();

    useEffect(() => {
        async function loginTokenFunction() {
            const key = "loginkey";
            return await AsyncStorage.getItem(key).then((result) => {
                if (result) {
                    try {
                        result = JSON.parse(result);
                        onChangeToken(result)
                    } catch (e) {
                        console.log(e);
                    }
                }
                if (result == null) {
                    alert("Please Signup/Login to Give Feedback")
                    router.push({
                        pathname: "/users/signup/mobilereg",
                    });
                }
                return result;
            });
        }
        loginTokenFunction()
    })

    async function navigation() {
        router.push({
            pathname: "/main/navigation",
        });
    }

    async function submit() {
        if (feedback.length > 20) {
            if (feedback.length < 101) {
                const headers = {
                    authorizatrion: token,
                };
                try {
                    const res = await axios
                        .post("http://ec2-3-109-5-112.ap-south-1.compute.amazonaws.com:5000/api/userController/feedBack", {
                            message: feedback,
                        }, {
                            headers: headers
                        })
                        .then(async (response) => {
                            alert(response.data);
                            router.push({
                                pathname: "/",
                            });
                        })
                        .catch((error) => {
                            alert("Something went wrong 1")
                        });
                }
                catch {
                    alert("Something went wrong 2")
                }
            }
            else {
                alert("Feedback should not exceed 100 characters")
            }
        }
        else {
            alert("Feedback must be at least 20 characters")
        }
    }

    return (
        <KeyboardAwareScrollView>
            <View style={styles.container}>
                <Stack.Screen
                    options={{
                        title: "Contact Us", headerTitleAlign: "center", headerRight: () => (
                            <View>
                                <TouchableOpacity onPress={navigation}><EvilIcons name="navicon" size={35} color="black" /></TouchableOpacity>
                            </View>
                        )
                    }}
                />
                <MaterialIcons style={styles.icon} name="connect-without-contact" size={50} color="black" />
                <Text style={styles.text}>Feedback / Contact Us</Text>
                <TextInput
                    multiline={true}
                    numberOfLines={7}
                    style={styles.input}
                    placeholder="Type Here ...."
                    value={feedback}
                    onChangeText={onChangeFeedback}
                />
                <TouchableOpacity onPress={submit} style={styles.button}><Text style={styles.buttonText}>Submit  <Ionicons name="send-outline" size={24} color="white" /></Text></TouchableOpacity>
            </View>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: "center",
        borderRadius: 10,
        height: "100%",
    },
    icon: {
        marginBottom: 20,
    },
    text: {
        fontSize: 25,
        fontWeight: "bold",
        marginBottom: 20
    },
    input: {
        height: 150,
        width: 280,
        marginBottom: 20,
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
    },
    button: {
        backgroundColor: 'blue',
        borderRadius: 10
    },
    buttonText: {
        margin: 10,
        marginRight: 30,
        marginLeft: 30,
        color: 'white',
        fontSize: 20,
        fontWeight: "bold",
    },
})

export default feedback;