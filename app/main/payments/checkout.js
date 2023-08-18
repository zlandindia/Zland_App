import { View, Text, TouchableOpacity, TouchableHighlight } from 'react-native'
import React, { useEffect, useState } from 'react'
import RazorpayCheckout from 'react-native-razorpay';
import { useRouter, Stack, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const checkout = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { name, street, country, state, city, totalsqfeet, lengthinft, widthinft, price, note } = params;



    // Payment sucess funcion
    async function paymentsSuccess() {
        console.log("Payment sucessfully completed")

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

        const headers = {
            authorizatrion: await loginTokenFunction(),
        };
        const res = await axios
            .post(
                "http://ec2-3-109-5-112.ap-south-1.compute.amazonaws.com:5000/api/landController/AddLand",
                {
                    name: name,
                    street: street,
                    country: country,
                    state: state,
                    city: city,
                    totalsqfeet: totalsqfeet,
                    lengthinft: lengthinft,
                    widthinft: widthinft,
                    price: price,
                    note: note,
                },
                { headers: headers }
            )
            .then((response) => {
                alert("Posted");
                router.push({
                    pathname: "/",
                });
            })
            .catch((error) => {
                if (error.response.data === "Something went wrong (Token)") {
                    alert("Please Signup/Login to Continue...")
                    router.push({
                        pathname: "/users/signup/mobilereg",
                    });
                }
            });

    }
    // Payment failure funcion
    async function paymentsFailed() {
        alert("Payment failed, try again");
        router.push({
            pathname: "/lands/LandValue",
        });
    }

    // Payment function
    async function payments() {
        waitres = await getDetails()
        var options = {
            description: 'Credits towards consultation',
            image: '',
            currency: 'INR',
            key: waitres.data.ID, // Your api key
            amount: waitres.data.AMOUNT, //in pisa
            name: 'Zland',
            prefill: {
                email: 'void@razorpay.com',
                contact: '9191919191',
                name: 'Razorpay Software'
            },
            theme: { color: '#0000FF' }
        }
        RazorpayCheckout.open(options).then((data) => {
            // handle success
            paymentsSuccess()
        }).catch((error) => {
            // handle failure
            paymentsFailed()
        });
    }

    // Paments Input Fetch

    async function getDetails() {
        return await axios
            .get(
                "http://ec2-3-109-5-112.ap-south-1.compute.amazonaws.com:5000/api/payment/paymentDetails"
            )
            .then((response) => {
                return response;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    // End payment Input

    useEffect(() => {
        payments();
    }, []);

    return (
        <View>
            <TouchableOpacity>
                <Text>Secure payment loading ......</Text>
            </TouchableOpacity>
        </View>
    )
}

export default checkout