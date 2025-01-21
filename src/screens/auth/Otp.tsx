import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import FastImage from 'react-native-fast-image'
import { Colors } from '../../common/Colors'
import { Utils } from '../../common/Utils'
import { OtpInput } from 'react-native-otp-entry'
import * as _AUTH_SERVICE from '../../services/AuthService';
import * as _CART_SERVICE from '../../services/CartService';
import { Fonts } from '../../common/Fonts'
import { Images } from '../../assets/Images'
import LinearGradient from 'react-native-linear-gradient'
import Toast from 'react-native-toast-message'


const Otp = (props: any) => {
    let otpInput: any = useRef(null);
    const phoneNumber = props.route.params.mobileNumber;
    const userID = props.route.params.userID;
    const [otpCode, setOtpCode] = useState('');
    const [wrongOtp, setWrongOtp] = useState(false);
    const [mobileNumber, setMobileNumber] = useState(null)
    const [count, setCount] = useState(60);
    const [hasErr, setHasErr] = useState(false);
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const scrollViewRef: any = useRef<ScrollView>(null);

    useEffect(() => {
        setCountInterval();
        setContactNumber();
    });

    useEffect(() => {
        if (otpCode.length < 4 && wrongOtp) {
            setWrongOtp(false);
        }
    }, [otpCode]);

    const setContactNumber = async () => {
        let mobile_number = await Utils.getData('mobilenumber');
        setMobileNumber(mobile_number)
    }

    const setCountInterval = async () => {
        let value = count;
        setTimeout(() => {
            if (count <= 0) {
                clearInterval(value);
            } else {
                setCount((value - 1));
            }
        }, 1000);
    };


    const changeMobileNumber = () => {
        props.navigation.goBack();
    }

    const getCartData = async () => {
        try {
            const result: any = await _CART_SERVICE.get_cart_list();
            const { data, message = "", status_code } = result;
            if (status_code === 200) {
                Utils.storeData('cart_items', data?.cart_items);
                setIsLoading(false);
                setHasErr(false);
                props.navigation.replace('HomeStack', { screen: 'TabStack' });
            }
        } catch (error) {
            console.log("GET CART LIST ERROR:", error);
        }
    }


    const onChangeOtp = async (e: any) => {
        let user = await Utils.getData('_USER_DETAILS');
        setIsLoading(true)
        setOtpCode(e);
        let send_data = {
            user_id: userID,
            otp: e
        }
        try {
            let response: any = await _AUTH_SERVICE.verify_otp(send_data);
            const { data, message = "", status_code } = response;
            if (status_code === 200) {
                Utils.storeData('_USER_DETAILS', data.user);
                Utils.storeData('_TOKEN', data.token);
                getCartData()
            } else {
                setHasErr(true);
                setIsLoading(false);
            }
        } catch (error) {
            console.log("OTP:ERROR:", error)
            setIsLoading(false);
        }
    }

    const onResendPress = async () => {
        setHasErr(false)
        setOtpCode('')
        otpInput.current.clear()
        setResendLoading(true);
        let send_data = { phoneno: phoneNumber, login_type: 'otp' }
        try {
            await _AUTH_SERVICE.login(send_data).then((res: any) => {
                console.log(res)
                if (res.success === 'true') {
                    setResendLoading(false);
                    setCount(60);
                    setCountInterval();
                } else {
                    setResendLoading(false);
                    Toast.show({
                        text1: 'Error!',
                        text2: res?.message,
                        type: 'error',
                        position: 'bottom',
                        text1Style: { fontSize: 16, fontFamily: Fonts.LexendBold, color: 'red' },
                        text2Style: { fontSize: 12, fontFamily: Fonts.LexendMedium, color: 'red' }
                    });
                }
            })
        } catch (error) {
            console.log(error);
            setResendLoading(false)
        }
    }

    return (
        <LinearGradient colors={['#ffa500', '#ff4500']} style={OtpStyle.mainBody} className='flex flex-1'>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always' >
                <View className='flex w-full justify-center items-center'>
                    <View className='w-[200px] h-[133px] mt-10'>
                        <FastImage source={Images.mainlogo2} resizeMode='contain' className='w-full h-full' />
                    </View>
                </View>
                <View className='px-5 flex flex-auto'>
                    <View className='mt-5'>
                        <Text className='text-white text-[34px]  font-LexendMedium'>Enter OTP</Text>
                    </View>
                    <View className='mt-3 flex-col relative'>
                        <Text className='text-white text-[16px] tracking-[0.44px] leading-6 font-LexendRegular'>Please enter the OTP we’ve sent you on {phoneNumber}</Text>
                    </View>
                    <View style={OtpStyle.container} >
                        <View className='mt-7 h-[100px] w-[100%]'>
                            <OtpInput
                                ref={otpInput}
                                focusColor={Colors.white}
                                onTextChange={(e) => {
                                    if ((e + "") !== 'NaN') {
                                        if (
                                            (e + "").indexOf(" ") !== -1 ||
                                            (e + "").indexOf(",") !== -1 ||
                                            (e + "").indexOf(".") !== -1 ||
                                            (e + "").indexOf("-") !== -1
                                        ) {
                                            otpInput.current.setValue(parseInt(e + "") + "")
                                        } else {
                                        }
                                    } else {
                                        otpInput.current.clear()
                                    }
                                    if (e.length !== 4) {
                                        setHasErr(false)
                                        setOtpCode('')
                                    }
                                }}
                                onFilled={(e) => {
                                    if (hasErr == false) {
                                        onChangeOtp(e)
                                    }
                                    setOtpCode(e)
                                }}
                                numberOfDigits={4}
                                theme={{
                                    pinCodeContainerStyle: {
                                        width: 55,
                                        height: 55,
                                        borderRadius: 4,
                                        backgroundColor: '#ffa500',
                                        borderColor: hasErr ? Colors.errorColor : Colors.white
                                    },
                                    focusedPinCodeContainerStyle: { borderColor: hasErr ? Colors.errorColor : Colors.white },
                                    pinCodeTextStyle: { color: hasErr ? Colors.errorColor : Colors.textColor, fontWeight: '500', fontSize: 20, fontFamily: Fonts.LexendMedium }
                                }}
                            />
                            <View className={`${hasErr ? 'justify-between' : 'justify-end items-end'} items-center py-3  flex-row px-1`}>

                                {hasErr ? (
                                    <Text className={`${hasErr ? 'text-red-800' : 'text-fieldTextColor'} text-[12px] tracking-[0.44px] leading-5 font-LexendBold`}>Incorrect OTP entered</Text>
                                ) : null}
                                <View className='' style={{}}>
                                    {
                                        count == 0 ?
                                            resendLoading ?
                                                <ActivityIndicator size={'small'} color={Colors.textColor} />
                                                :
                                                <TouchableOpacity onPress={onResendPress}>
                                                    <Text className='text-textColor text-[14px] tracking-[0.44px] leading-5 font-InterMedium'>
                                                        Resend
                                                    </Text>
                                                </TouchableOpacity>
                                            :
                                            <Text className='text-white text-[14px] tracking-[0.44px] leading-5 font-InterMedium'>
                                                {' '}
                                                00:{count < 10 ? '0' + count : count}
                                            </Text>
                                    }
                                </View>
                            </View>
                        </View>

                        <View className='flex flex-row items-center'>
                            <Text onPress={changeMobileNumber} className='text-blue-950 text-sm tracking-[0.44px] leading-6 font-LexendRegular'>Click Here</Text>
                            <Text className='text-white text-sm tracking-[0.44px] leading-6 font-LexendRegular ml-1'>To change mobile number</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View className='flex px-5 pb-3'>
                {
                    isLoading ?
                        <ActivityIndicator size={'large'} style={{}} color={Colors.textColor} />
                        :
                        (otpCode === '' || otpCode === null)
                            ?
                            <TouchableOpacity
                                disabled
                                className='opacity-50'
                                style={[OtpStyle.buttonStyle, {}]}
                                activeOpacity={0.5}
                            >
                                <Text style={OtpStyle.buttonTextStyle}>Verify OTP</Text>
                            </TouchableOpacity>
                            :

                            <TouchableOpacity
                                onPress={onChangeOtp}
                                style={OtpStyle.buttonStyle}
                                activeOpacity={0.5}
                            >
                                <Text style={OtpStyle.buttonTextStyle}>Verify OTP</Text>
                            </TouchableOpacity>
                }
            </View>
        </LinearGradient>
    )
}

const OtpStyle = StyleSheet.create({
    keyCode: {
        backgroundColor: 'white',
        borderRadius: 4,
        paddingHorizontal: 15,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 14,
        color: 'rgba(0,0,0,1)',
        alignSelf: 'center',
    },
    mainBody: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ffa500',
        alignContent: 'center',
    },
    container: {
        // alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        // marginHorizontal:10
    },
    box: {
        width: 62,
        height: 60,
        marginHorizontal: 5,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    roundedTextInput: {
        borderRadius: 4,
        height: 60,
        width: 62,
        backgroundColor: Colors.fieldGrayColor,
        borderBottomWidth: 0
    },
    buttonStyle: {
        backgroundColor: '#000080',
        borderWidth: 0,
        color: '#000080',
        borderColor: 'blue',
        height: 40,
        alignItems: 'center',
        borderRadius: 30,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 20,
        marginBottom: 25,
    },
    buttonTextStyle: {
        color: '#FFFFFF',
        paddingVertical: 10,
        fontSize: 16,
    },
});

export default Otp