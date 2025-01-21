import { View, Text, TextInput, TouchableOpacity, StatusBar, StyleSheet, ActivityIndicator, ScrollView, BackHandler, Dimensions, Image } from 'react-native';
import React, { useState } from 'react';
import { Colors } from '../../common/Colors';
import * as _AUTH_SERVICE from '../../services/AuthService';
import { Utils } from '../../common/Utils';
import { Fonts } from '../../common/Fonts';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { Images } from '../../assets/Images';

const screenWidth = Dimensions.get('window').width;

const ForgotPassword = (props: any) => {
    const [mobileNumber, setMobileNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [errortext, setErrortext] = useState('');

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

    const onSendOtp = async () => {
        console.log('sendoptooooo')
        // setShowOtpInput(true)
        // // props.navigation.navigate('Otpverify')
        // return 0;

        if (!mobileNumber) {
            setErrortext('Please enter your mobile number.');
            return;
        }

        setLoading(true);
        try {
            // Call the API to send OTP (replace with your actual API call)
            const response = await _AUTH_SERVICE.sendOtp({ phone: mobileNumber });

            console.log('response otpp-->', response)

            if (response.status_code === 200) {
                // Show OTP input after OTP is sent
                setShowOtpInput(true);
                Toast.show({
                    text2: 'OTP sent successfully',
                    type: 'success',
                    position: 'bottom',
                });
            } else {
                setErrortext(response.message || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            setErrortext('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    const onForgotPassword = async () => {
        setLoading(true);
        try {
            let send_data = { otp: otp, password: '12345678' };
            let response: any = await _AUTH_SERVICE.forgot_password(send_data);
            console.log('responsedataa', response)
            const { status_code, message = "" } = response;
            setLoading(false);

            if (status_code === 200) {
                Toast.show({
                    text2: message,
                    type: 'success',
                    position: 'bottom',
                    text1Style: { fontSize: 16, fontFamily: Fonts.LexendBold, color: 'green' },
                    text2Style: { fontSize: 12, fontFamily: Fonts.LexendMedium, color: 'green' }
                });
                props.navigation.navigate('Login'); // Navigate to OTP screen for password reset
            } else {
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
            setLoading(false);
            console.log(error);
            Toast.show({
                text1: 'Error!',
                text2: 'Something went wrong. Please try again later.',
                type: 'error',
                position: 'bottom',
                text1Style: { fontSize: 16, fontFamily: Fonts.LexendBold, color: 'red' },
                text2Style: { fontSize: 12, fontFamily: Fonts.LexendMedium, color: 'red' }
            });
        }
    };

    const setBtnDisable = () => {
        return !mobileNumber;
    };

    return (
        <LinearGradient colors={['#ffa500', '#ff4500']} style={styles.mainBody}>
            <StatusBar backgroundColor={'#ffa500'} barStyle={'light-content'} />
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    flex: 1,
                    justifyContent: 'center',
                    alignContent: 'center',
                    paddingHorizontal: 35,
                }}
            >
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
                <Text style={styles.headerText}>Forgot Password</Text>

                {/* Mobile Number Input */}
                {!showOtpInput && (
                    <View style={styles.SectionStyle}>
                        <TextInput
                            style={styles.inputStyle}
                            onChangeText={setMobileNumber}
                            value={mobileNumber}
                            placeholder="Enter Mobile Number"
                            placeholderTextColor={Colors.white}
                            keyboardType="number-pad"
                            maxLength={10}
                            returnKeyType="done"
                            blurOnSubmit={false}
                        />
                    </View>
                )}

                {/* OTP Input */}
                {showOtpInput && (
                    <View style={styles.SectionStyle}>
                        <TextInput
                            style={styles.inputStyle}
                            onChangeText={setOtp}
                            value={otp}
                            placeholder="Enter OTP"
                            placeholderTextColor={Colors.white}
                            keyboardType="number-pad"
                            maxLength={6}
                            returnKeyType="done"
                            blurOnSubmit={false}
                        />
                    </View>
                )}

                {errortext ? <Text style={styles.errorTextStyle}>{errortext}</Text> : null}

                {/* Send OTP Button */}
                {!showOtpInput && (
                    <TouchableOpacity
                        onPress={onSendOtp}
                        disabled={loading || !mobileNumber}
                        style={[styles.buttonStyle, (loading || !mobileNumber) && { opacity: 0.5 }]}
                    >
                        {loading ? (
                            <ActivityIndicator size="large" color="#fff" />
                        ) : (
                            <Text style={styles.buttonTextStyle}>Send OTP</Text>
                        )}
                    </TouchableOpacity>
                )}

                {/* Submit OTP Button */}
                {showOtpInput && (
                    <TouchableOpacity
                        onPress={onForgotPassword}
                        disabled={loading || !otp}
                        style={[styles.buttonStyle, (loading || !otp) && { opacity: 0.5 }]}
                    >
                        {loading ? (
                            <ActivityIndicator size="large" color="#fff" />
                        ) : (
                            <Text style={styles.buttonTextStyle}>Verify OTP</Text>
                        )}
                    </TouchableOpacity>
                )}

                {showOtpInput ?
                    <TouchableOpacity
                        style={styles.backToLoginTextStyle}
                        onPress={() => setShowOtpInput(false)}
                    >
                        <Text style={styles.backToLoginText}>resend</Text>
                    </TouchableOpacity> :

                    <TouchableOpacity
                        style={styles.backToLoginTextStyle}
                        onPress={() => props.navigation.replace('Login')}
                    >
                        <Text style={styles.backToLoginText}>Back to Login</Text>
                    </TouchableOpacity>}
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    mainBody: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ffa500',
        alignContent: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffa500',
        paddingHorizontal: 35,
    },
    headerText: {
        fontSize: 22,
        color: '#fff',
        fontFamily: Fonts.LexendBold,
        textAlign: 'center',
        marginBottom: 20,
    },
    SectionStyle: {
        flexDirection: 'row',
        height: 50,
        marginTop: 20,
        width: '100%',
        marginBottom: 20,
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
    buttonStyle: {
        backgroundColor: '#000080',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        marginTop: 20,
        width: '100%',
    },
    buttonTextStyle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: Fonts.LexendMedium,
    },
    backToLoginTextStyle: {
        marginTop: 20,
    },
    backToLoginText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    errorTextStyle: {
        color: 'red',
        textAlign: 'center',
        fontSize: 14,
    },
});

export default ForgotPassword;
