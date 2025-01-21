import React, { useState, useEffect, createRef } from 'react';
import {
    StyleSheet,
    TextInput,
    View,
    Text,
    Image,
    KeyboardAvoidingView,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import Loader from '../../component/Loader';
import { Images } from '../../assets/Images';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../common/Colors';
import { Fonts } from '../../common/Fonts';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons for the eye icon
import LinearGradient from 'react-native-linear-gradient';
import * as _AUTH_SERVICES from '../../services/AuthService';
import Toast from 'react-native-toast-message';


const Signup = (props: any) => {
    const { navigation } = props;
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errortext, setErrortext] = useState('');
    const [isRegistraionSuccess, setIsRegistraionSuccess] = useState(false);
    const [isFormValid, setIsFormValid] = useState<any>(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State for password visibility

    const emailInputRef: any = createRef();
    const ageInputRef: any = createRef();
    const passwordInputRef: any = createRef();

    useEffect(() => {
        validateForm();
    }, [userName, userEmail, , userPassword]);

    const validateEmail = (email: any) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validatePassword = (password: any) => {
        return password.length >= 8;
    };

    const validateForm = () => {
        const isValid =
            userName &&
            validateEmail(userEmail) &&
            mobileNumber &&
            validatePassword(userPassword);
        setIsFormValid(isValid);
    };

    const handleSubmitButton = async () => {
        setErrortext('');
        if (!userName) {
            Alert.alert('Please fill Name');
            return;
        }
        if (!validateEmail(userEmail)) {
            Alert.alert('Please enter a valid Email');
            return;
        }
        if (!mobileNumber) {
            Alert.alert('Please fill Mobile Number');
            return;
        }
        if (!validatePassword(userPassword)) {
            Alert.alert('Password must be at least 6 characters long');
            return;
        }
        setLoading(true);
        var dataToSend = {
            name: userName,
            email: userEmail,
            password: userPassword,
            phone: mobileNumber
        };

        const result: any = await _AUTH_SERVICES.signup(dataToSend);
        console.log(result);

        const { status_code, message = "", data, errors } = result;
        if (status_code === 200) {
            navigation.navigate('Otp', { mobileNumber: mobileNumber, userID: data?.user_id });
            Toast.show({
                // text1: 'Success!',
                text2: message,
                type: 'success',
                position: 'bottom',
                text1Style: { fontSize: 16, fontFamily: Fonts.LexendBold, color: 'green' },
                text2Style: { fontSize: 12, fontFamily: Fonts.LexendMedium, color: 'green' }
            });
            setIsRegistraionSuccess(true);
            setLoading(false);
        } else if (status_code === 422) {
            let errorMsg = ""
            if (errors.email) {
                errorMsg = errors.email[0];
            }
            if (errors.phone) {
                errorMsg = errors.phone[0];
            }

            Toast.show({
                text1: 'Error!',
                text2: errorMsg,
                type: 'error',
                position: 'bottom',
                text1Style: { fontSize: 16, fontFamily: Fonts.LexendBold, color: 'red' },
                text2Style: { fontSize: 12, fontFamily: Fonts.LexendMedium, color: 'red' }
            });
            setLoading(false);
        } else {
            Toast.show({
                text1: 'Error!',
                text2: message,
                type: 'error',
                position: 'bottom',
                text1Style: { fontSize: 16, fontFamily: Fonts.LexendBold, color: 'red' },
                text2Style: { fontSize: 12, fontFamily: Fonts.LexendMedium, color: 'red' }
            });
            setLoading(false);
        }

    };

    return (
        <LinearGradient colors={['#ffa500', '#ff4500']} style={{ flex: 1 }}>
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    justifyContent: 'center',
                    alignContent: 'center',
                }}>
                <View style={{ alignItems: 'center' }}>
                    <Image
                        source={Images.mainlogo2}
                        style={{
                            width: '50%',
                            height: 100,
                            resizeMode: 'contain',
                            margin: 30,
                        }}
                    />
                </View>
                <KeyboardAvoidingView enabled>
                    <View style={styles.SectionStyle}>
                        <TextInput
                            style={styles.inputStyle}
                            onChangeText={(UserName) => setUserName(UserName)}
                            underlineColorAndroid="#f000"
                            placeholder="Enter Name"
                            placeholderTextColor="white"
                            autoCapitalize="sentences"
                            returnKeyType="next"
                            onSubmitEditing={() =>
                                emailInputRef.current && emailInputRef.current.focus()
                            }
                            blurOnSubmit={false}
                        />
                    </View>
                    <View style={styles.SectionStyle}>
                        <TextInput
                            style={styles.inputStyle}
                            onChangeText={(UserEmail) => setUserEmail(UserEmail)}
                            underlineColorAndroid="#f000"
                            placeholder="Enter Email"
                            placeholderTextColor="white"
                            keyboardType="email-address"
                            ref={emailInputRef}
                            returnKeyType="next"
                            onSubmitEditing={() =>
                                passwordInputRef.current &&
                                passwordInputRef.current.focus()
                            }
                            blurOnSubmit={false}
                        />
                    </View>

                    <View style={styles.SectionStyle}>
                        <TextInput
                            style={styles.inputStyle}
                            onChangeText={(mobile) => setMobileNumber(mobile)}
                            underlineColorAndroid="#f000"
                            placeholder="Enter Mobile Number"
                            placeholderTextColor="white"
                            keyboardType="number-pad"
                            ref={emailInputRef}
                            returnKeyType="next"
                            onSubmitEditing={() =>
                                passwordInputRef.current &&
                                passwordInputRef.current.focus()
                            }
                            blurOnSubmit={false}
                            maxLength={10}
                        />
                    </View>
                    <View style={styles.SectionStyle}>
                        <TextInput
                            style={styles.inputStyle}
                            onChangeText={(UserPassword) =>
                                setUserPassword(UserPassword)
                            }
                            underlineColorAndroid="#f000"
                            placeholder="Enter Password"
                            placeholderTextColor="white"
                            ref={passwordInputRef}
                            returnKeyType="next"
                            secureTextEntry={!isPasswordVisible}
                            onSubmitEditing={() =>
                                ageInputRef.current &&
                                ageInputRef.current.focus()
                            }
                            blurOnSubmit={false}
                        />
                        <TouchableOpacity className='absolute right-3' onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                            <Ionicons
                                name={isPasswordVisible ? "eye-off" : "eye"}
                                size={24}
                                color="white"
                            />
                        </TouchableOpacity>
                    </View>
                    <View className='px-8'>
                        <Text className='text-xs text-whiteColor font-LexendRegular'>Password should be at least 8 characters</Text>
                    </View>
                    {errortext != '' ? (
                        <Text style={styles.errorTextStyle}>
                            {errortext}
                        </Text>
                    ) : null}
                    {
                        loading ?
                            <ActivityIndicator size={'large'} color={Colors.white} />
                            :
                            <TouchableOpacity
                                style={[styles.buttonStyle, isFormValid ? {} : { backgroundColor: 'gray' }]}
                                activeOpacity={0.5}
                                onPress={handleSubmitButton}
                                disabled={!isFormValid}>
                                <Text style={styles.buttonTextStyle}>REGISTER</Text>
                            </TouchableOpacity>

                    }

                    <Text className='text-whiteColor font-LexendMedium text-center text-base'>OR</Text>
                    <Text
                        style={styles.registerTextStyle}
                        onPress={() => props.navigation.navigate('Login')}>
                        Already have an account ? Login Here
                    </Text>
                </KeyboardAvoidingView>
            </ScrollView>
        </LinearGradient>
    );
};

export default Signup;

const styles = StyleSheet.create({
    SectionStyle: {
        flexDirection: 'row',
        alignItems: 'center', // Center items vertically
        marginTop: 20,
        marginLeft: 35,
        marginRight: 35,
        margin: 10,
        position: 'relative'
    },
    buttonStyle: {
        backgroundColor: '#000080',
        borderWidth: 0,
        color: '#FFFFFF',
        borderColor: '#000080',
        height: 50,
        alignItems: 'center',
        borderRadius: 30,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 20,
        marginBottom: 20,
        justifyContent: 'center',
    },
    buttonTextStyle: {
        color: '#FFFFFF',
        paddingVertical: 10,
        fontSize: 16,
        fontFamily: Fonts.LexendMedium
    },
    inputStyle: {
        flex: 1,
        color: 'white',
        paddingLeft: 15,
        paddingRight: 15,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'white',
        fontFamily: Fonts.LexendRegular
    },
    errorTextStyle: {
        color: 'red',
        textAlign: 'center',
        fontSize: 14,
    },
    successTextStyle: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
        padding: 30,
    },
    registerTextStyle: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 14,
        alignSelf: 'center',
        padding: 10,
    },
});
