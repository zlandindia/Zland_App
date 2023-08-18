// import { View, Text, TouchableOpacity, TouchableHighlight } from 'react-native'
// import React from 'react'
// import RazorpayCheckout from 'react-native-razorpay';
// import { useRouter, Stack } from "expo-router";






// const router = useRouter();

// const razorpay = () => {

//     async function paymentsSuccess() {
//         console.log("Payment sucessfully completed")
//     }

//     async function paymentsFailed() {
//         console.log("Payment Failed Sorry")
//     }


//     async function payments() {
//         var options = {
//             description: 'Credits towards consultation',
//             image: '',
//             currency: 'INR',
//             key: 'rzp_test_dYIsalPLWmCnjv', // Your api key
//             amount: '49900', //in pisa
//             name: 'Zland',
//             prefill: {
//                 email: 'void@razorpay.com',
//                 contact: '9191919191',
//                 name: 'Razorpay Software'
//             },
//             theme: { color: '#0000FF' }
//         }
//         RazorpayCheckout.open(options).then((data) => {
//             // handle success
//             paymentsSuccess()
//         }).catch((error) => {
//             // handle failure
//             paymentsFailed()
//         });
//     }


//     return (
//         <View>
//             <Text>Razorpay</Text>
//             <TouchableOpacity onPress={payments}>
//                 <Text>Payment Button</Text>
//             </TouchableOpacity>
//         </View>
//     )
// }

// export default razorpay