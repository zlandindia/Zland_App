import React, { useRef, useState, useEffect } from 'react';
import {
    StyleSheet,
    TextInput,
    Button,
    View,
    Text,
    TouchableOpacity,
    Image,
    Alert
} from "react-native";
import { useRouter, Stack, useNavigation } from "expo-router";
import axios from "axios";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { firebaseConfig } from "../../config";
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const mobileReg = () => {
    const [text, onChangeText] = React.useState();
    const [disabled, onChangedisabled] = React.useState(false);
    const recaptchaVerifier = useRef(null);
    const router = useRouter();

    // to SignIn page
    const Signin = () => {
        router.push({
            pathname: "/users/signin/userLogin",
        });
    };
    const User = () => {
        router.push({
            pathname: "/users/signup/userDetails",
        });
    };
    // end To SignIn page

    const handleClick = async (e) => {
        try {
            if (text.trim().length === 10) {
                try {
                    const phoneProvider = new firebase.auth.PhoneAuthProvider();
                    onChangedisabled(true)
                    await phoneProvider.verifyPhoneNumber(`+91${text}`, recaptchaVerifier.current).then(async (id) => {
                        console.log(id);
                        router.push({
                            pathname: "/users/signup/otpValidation",
                            params: { verificationId: id, currentMobile: text },
                        });
                    }).catch((error) => { console.log(error) });

                }
                catch (err) {
                    alert("! Please check your internet connection");
                }
            } else {
                alert("Invalid Mobile Number");
                onChangeText("");
            }
        } catch (e) {
            alert("Please Try Again");
            onChangeText("");
        }
    };

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
                <FirebaseRecaptchaVerifierModal
                    ref={recaptchaVerifier}
                    firebaseConfig={firebaseConfig}
                />
                <Stack.Screen options={{ headerShown: false }} />

                <Image style={styles.image} source={require('../../media/images/zland_logo_main.png')} />

                <Text style={styles.text}>Register (1/3)</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    <Text style={styles.number}>+91</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={onChangeText}
                        value={text}
                        keyboardType='phone-pad'
                        placeholder="Mobile Number Here"
                    />
                </View>
                <TouchableOpacity
                    disabled={disabled}
                    style={styles.button}
                    type="number"
                    onPress={handleClick}
                ><Text style={styles.textInner}>Get Otp</Text></TouchableOpacity>
                <TouchableOpacity onPress={Signin}>
                    <Text style={styles.signin}>Already have account? SignIn</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={User}>
                    <Text style={styles.signin}>User Page</Text>
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
        width: 250,
        marginBottom: 25,
        borderWidth: 1,
        padding: 10,
        borderRadius: 50,
    },
    number: {
        fontSize: 22,
        marginTop: 8,
        paddingRight: 5,
    },
    signin: {
        marginTop: 20,
        color: "blue",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        textDecorationLine: "underline",
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
    button: {
        backgroundColor: "blue", borderRadius: 50
    },
    textInner: { color: "white", paddingLeft: 60, paddingRight: 60, paddingTop: 10, paddingBottom: 10, fontSize: 15, fontWeight: "bold" }
});

export default mobileReg;


// import { Redirect } from 'expo-router';

// export default function Page() {
//     return <Redirect href="/users/signup/FirebaseAuth" />;
// }

// import { Redirect } from 'expo-router';

// export default function Page() {
//     return <Redirect href="/users/signup/FirebaseAuth" />;
// }
