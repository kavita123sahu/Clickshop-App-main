import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements';
import CommonHeader from '../../component/CommonHeader';
import Octicons from 'react-native-vector-icons/Octicons';
import { Colors } from '../../common/Colors';
import Fontisto from 'react-native-vector-icons/Fontisto'
import { Fonts } from '../../common/Fonts';
import FastImage from 'react-native-fast-image';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RazorpayCheckout, { CheckoutOptions } from 'react-native-razorpay';
import * as _ADDRESS_SERVICES from '../../services/AddressServices';
import { useIsFocused } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from '@gorhom/bottom-sheet';
import Addresses from '../../component/Addresses';
import * as _CART_SERVICE from '../../services/CartService';
import { BaseUrl } from '../../config/Key';
import { Utils } from '../../common/Utils';
import { isAddedToCart } from '../../redux/action/CartActions';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';

const screenWidth = Dimensions.get('window').width;

const PaymentOptions = (props: any) => {
    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const { navigation } = props;
    const { delivery_type, shippingCharge, deliveryNote, codAvilable } = props.route.params;
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [paymentName, setPaymentName] = useState();
    const [defaultAddress, setDefaultAddress] = useState<any>();
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [cartItems, setCartItems] = useState<any>([]);
    const [loader, setLoader] = useState(true);
    const [btnLoader, setBtnLoader] = useState(false);
    const [totalPrice, setTotalPrice] = useState<any>();
    const [userDetails, setUserDetails] = useState<any>();
    const [totalWeight, setTotalWieght] = useState(0);
    const [paymentMethods, setPaymentMethods] = useState([
        { id: 'credit_debit', label: 'Credit/Debit Card', name: 'creditcard', payment_name: 'card' },
        { id: 'wallet', label: 'Wallet', name: 'wallet', payment_name: 'wallet' },
        { id: 'upi', label: 'UPI ID', name: 'wallet-travel', payment_name: 'upi' },
        { id: 'net_banking', label: 'Net Banking', name: 'home', payment_name: 'netbanking' },
        { id: 'cod', label: 'Cash on Delivery', name: 'account-cash', payment_name: '' },
    ]);

    useEffect(() => {
        let updatedPaymentMethods = [...paymentMethods];

        if (!codAvilable) {
            updatedPaymentMethods = updatedPaymentMethods.filter(payment => payment.id !== 'cod');
        }
        setPaymentMethods(updatedPaymentMethods);
        getAddress();
    }, [isFocused, codAvilable]);


    const getAddress = async () => {
        try {
            const result: any = await _ADDRESS_SERVICES.getAddress();
            const { status_code, message = "", data } = result;
            if (status_code === 200) {
                if (data?.length === 1) {
                    getCartLists(data[0]?.postal_code);
                    setDefaultAddress(data[0]);
                    setModalVisible(false)
                } else {
                    const d = data?.filter((i: any) => i.set_default === 1);
                    getCartLists(d[0]?.postal_code);
                    setDefaultAddress(d[0]);
                    setModalVisible(false)
                }
            } else {

            }
        } catch (error) {
            console.log("ADDRESS ERROR44444:", error);
        }
    }

    const getCartLists = async (postalCode?: any) => {
        setLoader(true);
        try {
            const user = await Utils.getData('_USER_DETAILS');
            setUserDetails(user);
            const result: any = await _CART_SERVICE.get_cart_list(postalCode);
            const { data, message = "", status_code } = result;
            if (status_code === 200) {
                const calculatedTotalWeight = data?.cart_items.reduce((sum: any, item: any) =>
                    sum + (Number(item.product.weight) * item.quantity / 1000), 0);
                setTotalWieght(calculatedTotalWeight);

                setTotalPrice(data?.total_price)
                setCartItems(data?.cart_items);
                setLoader(false);
            } else {
                setLoader(false);
                Toast.show({ text1: 'Error!', text2: message, type: 'error', position: 'bottom' });
            }
        } catch (error) {
            console.log("FETCHING CART LIST ERROR:", error);
            setLoader(false);
        }
    }

    const closeModal = () => {
        setModalVisible(false);
        getAddress();
    };

    const [PurchaseItem, setPurchaseItem] = useState([
        { id: '0', image: '', }, { id: '1', image: '', }, { id: '2', image: '', }
    ]);


    const renderPurchaseItem = ({ item }: { item: any }) => {
        return (
            <View className="flex w-[120px] h-[150px] mx-2 justify-center items-center mt-5 border-[1px] border-borderColor">
                <FastImage
                    source={{ uri: BaseUrl.base + 'public/' + item?.product?.thumbnail_img }}
                    className="w-full h-full"
                // resizeMode="contain"
                />
            </View>
        )
    }


    const onSelectPaymentMethod = (method: any) => {
        setSelectedPayment(method?.id);
        setPaymentName(method.payment_name);
    }

    const verifyPayment = async (paymentId: any, razorpayorderID: any, orderId: any, razorpaySignature: any) => {
        try {
            const dataToSend = {
                order_id: orderId,
                razorpay_order_id: razorpayorderID,
                razorpay_payment_id: paymentId,
                razorpay_signature: razorpaySignature
            }
            console.log("data to send 99999=============>", dataToSend);

            const result: any = await _CART_SERVICE.verify_order(dataToSend);
            console.log("result-================================>", result);

            const { status_code, data, message = "" } = result;
            if (status_code === 200) {
                dispatch(isAddedToCart(true));
                navigation.navigate('ThankYou', { orderType: 'razorpay' });
                setBtnLoader(false);
            } else {
                setBtnLoader(false);
                Toast.show({
                    text1: 'Error!',
                    text2: message,
                    type: 'error',
                    position: 'bottom',
                    text1Style: { fontSize: 16, fontFamily: Fonts.LexendBold, color: 'red' },
                    text2Style: { fontSize: 12, fontFamily: Fonts.LexendMedium, color: 'red' }
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    const razorpaypayment = async (razorpayorderID: any, orderId: any) => {
        try {
            var options: CheckoutOptions = {
                description: 'Clikshop Order Payment',
                image: '',
                currency: 'INR',
                key: 'rzp_live_cfCQqPlMS4zM1s',
                amount: (totalPrice + shippingCharge).toFixed(2),
                name: 'Clikshop',
                order_id: razorpayorderID,
                prefill: {
                    email: defaultAddress?.email,
                    contact: defaultAddress?.phone,
                    name: defaultAddress?.name,
                    method: paymentName
                },
                theme: { color: Colors.primaryColor },
            };
            console.log("options================>", options);

            RazorpayCheckout.open(options)
                .then(data => {
                    console.log("============data==============>", data);
                    verifyPayment(data?.razorpay_payment_id, razorpayorderID, orderId, data?.razorpay_signature)
                    // Alert.alert(`Success: ${data.razorpay_payment_id}`);
                })
                .catch(error => {
                    Alert.alert(`Payment cancelled by you`);
                    setBtnLoader(false);
                });
        } catch (error) {
            console.log("RAZORPAY ERROR:", error);
        }
    }

    const OnPayment = async () => {
        try {
            if (totalWeight >= 10) {
                Toast.show({
                    text1: 'Weight Limit Exceeded',
                    text2: `Total cart weight (${totalWeight.toFixed(2)} kg) cannot exceed 10 kg`,
                    type: 'error',
                    position: 'bottom',
                    text1Style: { fontSize: 16, fontFamily: Fonts.LexendBold, color: 'red' },
                    text2Style: { fontSize: 12, fontFamily: Fonts.LexendMedium, color: 'red' }
                });

            } else {
                setBtnLoader(true);
                const dataToSend = {
                    shipping_address: {
                        name: defaultAddress?.name,
                        email: defaultAddress?.email,
                        address: defaultAddress?.address,
                        locality: defaultAddress?.locality,
                        landmark: defaultAddress?.landmark,
                        country: 'India',
                        city: defaultAddress?.city,
                        postal_code: defaultAddress?.postal_code,
                        phone: defaultAddress?.phone,
                        checkout_type: 'logged',
                        cod: selectedPayment === 'cod' ? 1 : 0,
                        shipping: shippingCharge
                    },
                    // shipping_address: [defaultAddress?.address],
                    payment_type: selectedPayment === 'cod' ? "cash_on_delivery" : 'razorpay',
                    coupon_discount: 0,
                    total_shipping_cost: shippingCharge,
                    grand_total: (totalPrice + shippingCharge).toFixed(2)
                }
                console.log("data to send =============>", dataToSend, selectedPayment);
                const result: any = await _CART_SERVICE.create_order_ID(dataToSend);
                console.log("result================>", result);
                const { status_code, data, message = "" } = result;
                if (status_code === 200) {
                    if (selectedPayment === 'cod') {
                        navigation.navigate('ThankYou', { orderType: 'cod' });
                        dispatch(isAddedToCart(true));
                        setBtnLoader(false);
                    } else {
                        razorpaypayment(data?.razorpay_order_id, data?.order_id);
                    }
                } else {
                    Toast.show({
                        text1: 'Error!',
                        text2: message,
                        type: 'error',
                        position: 'bottom',
                        text1Style: { fontSize: 16, fontFamily: Fonts.LexendBold, color: 'red' },
                        text2Style: { fontSize: 12, fontFamily: Fonts.LexendMedium, color: 'red' }
                    });
                    setBtnLoader(false);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <View className='flex flex-1 bg-bgcolor'>
            <CommonHeader title={'Shopping cart'} navigation={navigation} isCartIcon={false} />
            <Modal
                isVisible={modalVisible}
                onBackButtonPress={closeModal}
                animationIn='slideInUp'
                animationOut='slideOutDown'
                animationInTiming={1}
                animationOutTiming={1}
                onBackdropPress={closeModal}
                coverScreen
                style={{ margin: 0, flex: 1, justifyContent: 'flex-start' }}
            >
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <BottomSheet
                        ref={bottomSheetRef}
                        snapPoints={['25%', '65%']}
                        index={1}
                    >
                        <Addresses navigation={navigation} closeModal={closeModal} />
                    </BottomSheet>
                </GestureHandlerRootView>
            </Modal>
            {
                loader ?
                    <View className='flex flex-1 justify-center items-center'>
                        <ActivityIndicator size={'large'} color={Colors.primaryColor} />
                    </View>
                    :
                    <>
                        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                            <View className='flex w-full bg-bgcolor px-4 py-4'>
                                <View className=''>
                                    <View className='flex flex-row items-center'>
                                        <Octicons name='location' size={20} color={Colors.errorColor} />
                                        <Text className='text-base text-newTextColor font-LexendMedium ml-[5px]'>Delivering To</Text>
                                    </View>
                                    <View className='mt-1 space-y-1.5'>
                                        <View className='flex flex-row items-center'>
                                            <Text className='text-[15px] text-black font-LexendRegular tracking-wider'>Address : </Text>
                                            <Text className='text-sm text-newTextColor font-Lexendlight tracking-wider'>{defaultAddress?.address}</Text>
                                        </View>
                                        <View className='flex flex-row items-center'>
                                            <Text className='text-[15px] text-black font-LexendRegular tracking-wider'>Pincode : </Text>
                                            <Text className='text-sm text-newTextColor font-Lexendlight tracking-wider'>{defaultAddress?.pincode}</Text>
                                        </View>
                                        <View className='flex flex-row items-center'>
                                            <Text className='text-[15px] text-black font-LexendRegular tracking-wider'>City : </Text>
                                            <Text className='text-sm text-newTextColor font-Lexendlight tracking-wider'>{defaultAddress?.city}</Text>
                                        </View>
                                        <View className='flex flex-row items-center'>
                                            <Text className='text-[15px] text-black font-LexendRegular tracking-wider'>Shipping Charge : </Text>
                                            <Text className='text-sm text-newTextColor font-Lexendlight tracking-wider'>₹{shippingCharge}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View className='w-full border border-yellow-500 border-dashed mt-3'></View>

                                <View className='flex items-center justify-center self-center mt-3'>
                                    <Text className='text-[15px] text-black font-LexendRegular tracking-wider text-center'>Delivery Note : </Text>
                                    <Text className='text-sm text-newTextColor font-LexendRegular tracking-wider text-center'>{deliveryNote}</Text>
                                </View>
                            </View>

                            <View className='flex w-full px-4 py-1 bg-gray-300'>
                                <Text className='text-[13px] text-blackColor font-LexendMedium'>Note: Order cannot be cancelled post shipment</Text>
                            </View>
                            <View className='flex flex-1'>
                                <View className='flex w-full bg-whiteColor py-3 px-4'>
                                    <Text className='text-[16px] text-newTextColor font-LexendMedium'>Payment Options</Text>
                                </View>
                                <View className='px-4'>
                                    {paymentMethods.map((method: any) => (
                                        <TouchableOpacity
                                            key={method.id}
                                            style={[styles.paymentOption,]}
                                            onPress={() => { onSelectPaymentMethod(method) }}>
                                            <View className='flex flex-row items-center'>
                                                {
                                                    method.id === 'cod' || method.id === 'upi' ?
                                                        <MaterialCommunityIcons name={method.name} size={25} color={Colors.newTextColor} />
                                                        :
                                                        <AntDesign name={method.name} size={25} color={Colors.newTextColor} />
                                                }
                                                <Text style={styles.paymentText} className='ml-2'>{method.label}</Text>
                                            </View>
                                            {selectedPayment === method.id ?
                                                <Fontisto name="radio-btn-active" size={20} color="green" />
                                                :
                                                <Fontisto name="radio-btn-passive" size={20} color={Colors.newTextColor} />}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                <View className='px-4'>
                                    <FlatList
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        data={cartItems}
                                        renderItem={renderPurchaseItem}
                                        keyExtractor={(item: any) => item?.id?.toString()}
                                    />
                                </View>
                            </View>
                        </ScrollView>


                        <View className='w-full h-[70px] flex px-3 py-4 border-[1px] border-borderColor bg-whiteColor flex-row justify-between'>
                            <View className='flex w-[50%]'>
                                <View>
                                    <Text className='text-[12px] text-newTextColor font-LexendRegular'>Total</Text>
                                </View>
                                <View className='flex flex-row items-center'>
                                    <Text className={`text-newTextColor font-LexendBold ${screenWidth <= 360 ? 'text-sm' : 'text-base'}`}>₹{totalPrice + shippingCharge}</Text>
                                    <Text className='text-[12px] text-newTextColor font-Lexendlight ml-1'>(All inclusive)</Text>
                                </View>
                            </View>
                            {
                                btnLoader ?
                                    <View className='w-[50%] flex justify-center items-center'>
                                        <ActivityIndicator size={'large'} color={Colors.green} />
                                    </View>
                                    :
                                    <TouchableOpacity disabled={btnLoader || !selectedPayment} onPress={OnPayment} className={`px-3 py-2 w-[] bg-green-600 flex justify-center items-center rounded-md ${!selectedPayment ? 'opacity-50' : ''}`}>
                                        <Text className={`text-whiteColor font-LexendMedium ${screenWidth <= 360 ? 'text-[10px]' : 'text-[14px]'}`}>Proceed to payment</Text>
                                    </TouchableOpacity>
                            }
                        </View>
                    </>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    addressHeader: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    paymentOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 20,
        marginVertical: 10,
        backgroundColor: Colors.white,
        borderRadius: 5,
    },
    selectedPaymentOption: {
        borderColor: 'green',
        borderWidth: 2,
    },
    paymentText: {
        fontSize: 16,
        fontFamily: Fonts.LexendMedium,
        color: Colors.newTextColor
    },
    payButton: {
        backgroundColor: Colors.primaryColor,
        borderRadius: 6,
        paddingHorizontal: 8,
        fontSize: 14,
        fontFamily: Fonts.LexendMedium,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 4
    },
});

export default PaymentOptions;
