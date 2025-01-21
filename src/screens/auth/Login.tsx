import { View, Text, TextInput, KeyboardAvoidingView, ScrollView, TouchableOpacity, StatusBar, StyleSheet, Keyboard, Image, ActivityIndicator, BackHandler, Dimensions } from 'react-native'
import React, { createRef, useRef, useState } from 'react'
import { Colors } from '../../common/Colors'
import * as _AUTH_SERVICE from '../../services/AuthService';
import { Utils } from '../../common/Utils'
import { Images } from '../../assets/Images'
import LinearGradient from 'react-native-linear-gradient';
import * as _CART_SERVICE from '../../services/CartService';
import { Fonts } from '../../common/Fonts';
import Toast from 'react-native-toast-message';
import Entypo from 'react-native-vector-icons/Entypo';
import { useFocusEffect } from '@react-navigation/native';
const screenWidth = Dimensions.get('window').width;

const Login = (props: any) => {
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [loginStep, setLoginStep] = useState(true);
    const passwordInputRef: any = createRef();
    const [errortext, setErrortext] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                props.navigation.replace('HomeStack', { screen: 'TabStack' });
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => {
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
            };
        }, [])
    );

    const getCartData = async () => {
        try {
            const result: any = await _CART_SERVICE.get_cart_list();
            const { data, message = "", status_code } = result;
            if (status_code === 200) {
                Utils.storeData('cart_items', data?.cart_items);
                setLoading(false);
                props.navigation.replace('HomeStack', { screen: 'TabStack' });
            }
        } catch (error) {
            console.log("GET CART LIST ERROR:", error);
        }
    }


    const onLogin = async () => {
        setLoading(true);
        try {
            let send_data = { phone: mobileNumber, password: password, login_type: loginStep ? 'password' : 'otp' }
            let response: any = await _AUTH_SERVICE.login(send_data);
            const { status_code, data, message = "" } = response;
            if (status_code === 200) {
                if (loginStep) {
                    Utils.storeData('_USER_DETAILS', data?.user);
                    Utils.storeData('_TOKEN', data?.token);
                    getCartData();
                } else {
                    props.navigation.navigate('Otp', { mobileNumber: mobileNumber, userID: data?.user_id });
                }
                setLoading(false);
                Toast.show({
                    // text1: 'Success!',
                    text2: message,
                    type: 'success',
                    position: 'bottom',
                    text1Style: { fontSize: 16, fontFamily: Fonts.LexendBold, color: 'green' },
                    text2Style: { fontSize: 12, fontFamily: Fonts.LexendMedium, color: 'green' }
                });
            } else {
                Toast.show({
                    text1: 'Error!',
                    text2: message,
                    type: 'error',
                    position: 'bottom',
                    text1Style: { fontSize: 16, fontFamily: Fonts.LexendBold, color: 'red' },
                    text2Style: { fontSize: 12, fontFamily: Fonts.LexendMedium, color: 'red' }
                });
                setLoading(false)
            }
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    const setBtnDisable = () => {
        if (loginStep) {
            return !(mobileNumber && password);
        } else {
            return !mobileNumber;
        }
    }


    return (
        <LinearGradient colors={['#ffa500', '#ff4500']} style={styles.mainBody}>
            <StatusBar backgroundColor={'#ffa500'} barStyle={'light-content'} />
            {/* <Loader loading={loading} /> */}
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    flex: 1,
                    justifyContent: 'center',
                    alignContent: 'center',
                }}>
                <View className=''>
                    <KeyboardAvoidingView enabled>
                        <View style={{ alignItems: 'center', marginTop: 0 }}>
                            <Image
                                source={Images.mainlogo2}
                                style={{
                                    width: '50%',
                                    height: 50,
                                    resizeMode: 'contain',
                                    margin: 30,
                                }}
                            />
                        </View>
                        <View>
                            <Text className='text-whiteColor font-LexendMedium text-center text-xl'>Login or Signup</Text>
                        </View>
                        <View style={styles.SectionStyle}>
                            <TextInput
                                style={styles.inputStyle}
                                onChangeText={(e) => setMobileNumber(e)}
                                value={mobileNumber}
                                placeholder="Enter Mobile Number"
                                placeholderTextColor={Colors.white}
                                autoCapitalize="none"
                                keyboardType="number-pad"
                                maxLength={10}
                                returnKeyType="next"
                                onSubmitEditing={() => passwordInputRef.current && passwordInputRef.current.focus()}
                                underlineColorAndroid="#f000"
                                blurOnSubmit={false}
                            />
                        </View>

                        {loginStep && (
                            <View style={styles.SectionStyle}>
                                <TextInput
                                    style={styles.inputStyle}
                                    onChangeText={(UserPassword) => setPassword(UserPassword)}
                                    value={password}
                                    placeholder="Enter Password"
                                    placeholderTextColor={Colors.white}
                                    keyboardType="default"
                                    ref={passwordInputRef}
                                    onSubmitEditing={Keyboard.dismiss}
                                    blurOnSubmit={false}
                                    secureTextEntry={!showPassword}
                                    underlineColorAndroid="#f000"
                                    returnKeyType="next"
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: 10, top: '30%' }}>
                                    <Entypo name={showPassword ? 'eye' : 'eye-with-line'} size={20} color={'#fff'} />
                                </TouchableOpacity>
                            </View>
                        )}

                        {errortext != '' ? (
                            <Text style={styles.errorTextStyle}>
                                {errortext}
                            </Text>
                        ) : null}

                        {setBtnDisable() ? (
                            <TouchableOpacity
                                disabled
                                className='opacity-50'
                                style={[styles.buttonStyle, {}]}
                                activeOpacity={0.5}>
                                <Text style={styles.buttonTextStyle} className={`${screenWidth <= 360 ? 'text-base' : 'text-sm'}`}>{loginStep ? 'LOGIN' : 'Send OTP'}</Text>
                            </TouchableOpacity>
                        ) : loading ? (
                            <ActivityIndicator size={'large'} color={'#000080'} />
                        ) : (
                            <TouchableOpacity
                                onPress={onLogin}
                                style={styles.buttonStyle}
                                activeOpacity={0.5}>
                                <Text style={styles.buttonTextStyle} className={`${screenWidth <= 360 ? 'text-base' : 'text-sm'}`}>{loginStep ? 'LOGIN' : 'Send OTP'}</Text>
                            </TouchableOpacity>
                        )}

                        <Text className='text-whiteColor font-LexendMedium text-center text-base'>OR</Text>
                        <Text
                            style={styles.registerTextStyle}
                            onPress={() => setLoginStep(!loginStep)}>
                            Click here to login with {loginStep ? 'OTP' : 'Password'}
                        </Text>

                        <Text
                            style={styles.registerTextStyle}
                            onPress={() => props.navigation.navigate('Signup')}>
                            New User ? Register Here
                        </Text>

                        {/* Forgot Password link */}
                        <Text
                            style={styles.forgotPasswordTextStyle}
                            onPress={() => props.navigation.navigate('ForgotPassword')}>
                            Forgot Password?
                        </Text>

                    </KeyboardAvoidingView>
                </View>
            </ScrollView>
        </LinearGradient>

    )
}

const styles = StyleSheet.create({
    mainBody: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ffa500',
        alignContent: 'center',
    },
    SectionStyle: {
        flexDirection: 'row',
        height: 50,
        marginTop: 20,
        marginLeft: 35,
        marginRight: 35,
        margin: 10,
        position: 'relative'
    },
    buttonStyle: {
        backgroundColor: '#000080',
        borderWidth: 0,
        color: '#000080',
        borderColor: 'blue',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 20,
        marginBottom: 25,
    },
    buttonTextStyle: {
        color: '#FFFFFF',
    },
    inputStyle: {
        flex: 1,
        color: 'white',
        paddingLeft: 15,
        paddingRight: 15,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'white',
    },
    registerTextStyle: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 14,
        alignSelf: 'center',
        padding: 10,
    },
    errorTextStyle: {
        color: 'red',
        textAlign: 'center',
        fontSize: 14,
    },
    forgotPasswordTextStyle: {
        color: '#fff',
        textAlign: 'center',
        marginTop: 15,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});

export default Login