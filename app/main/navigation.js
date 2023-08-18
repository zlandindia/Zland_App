import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { Stack, useRouter } from "expo-router";
import { Card } from "react-native-paper";
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';



export default function navigation() {
    const [login, onChangelogin] = React.useState(false);
    const router = useRouter();

    async function logout() {
        const key = "loginkey";
        await AsyncStorage.removeItem(key);
        router.push({
            pathname: "/users/signin/userLogin",
        });
    }

    async function signUp() {
        router.push({
            pathname: "/users/signup/mobilereg",
        });
    }

    async function myLands() {
        router.push({
            pathname: "/lands/allMyLands",
        });
    }

    async function home() {
        router.push({
            pathname: "/",
        });
    }

    async function feedBack() {
        router.push({
            pathname: "/main/feedback",
        });
    }




    useEffect(() => {
        async function loginTokenFunction() {
            const key = "loginkey";
            return await AsyncStorage.getItem(key).then((result) => {
                if (result) {
                    try {
                        result = JSON.parse(result);
                        onChangelogin(true)
                    } catch (e) {
                        console.log(e);
                    }
                }
                return result;
            });
        }
        loginTokenFunction()
    })


    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: "Menu",
                    headerTitleAlign: "center",
                    headerRight: () => (
                        <View>
                            <TouchableOpacity onPress={home}><MaterialCommunityIcons name="menu-down-outline" size={40} color="black" /></TouchableOpacity>
                        </View>
                    ),
                }}

            />
            <Card style={styles.card}>
                <TouchableOpacity onPress={home}><Text style={styles.text}><Entypo name="home" size={24} color="black" />  Home </Text></TouchableOpacity>
            </Card>
            <Card style={styles.card}>
                <TouchableOpacity onPress={myLands}><Text style={styles.text}><AntDesign name="pluscircleo" size={24} color="black" />  My Lands</Text></TouchableOpacity>
            </Card>
            <Card style={styles.card}>
                {login ? (
                    <TouchableOpacity onPress={logout} ><Text style={styles.text}> <Entypo name="login" size={24} color="black" />  Logout</Text></TouchableOpacity>
                ) : <TouchableOpacity onPress={signUp}><Text style={styles.text}><Entypo name="login" size={24} color="black" />  Sign Up</Text></TouchableOpacity>
                }
            </Card>
            <Card style={styles.card}>
                <TouchableOpacity onPress={feedBack}><Text style={styles.text}><MaterialIcons name="connect-without-contact" size={24} color="black" />  Feedback / Contact Us</Text></TouchableOpacity>
            </Card>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        padding: 3,
        marginBottom: 5,
        alignItems: "center",
        marginTop: 10,
        marginRight: 10,
        marginLeft: 10,
        borderRadius: 1
    },
    text: {
        fontSize: 20,
        margin: 5
    },
    container: {
        justifyContent: 'center',
        backgroundColor: "#d4d8d8",
        borderRadius: 10,
        height: "100%",
    },
})