import { View, Text, Image, StyleSheet, StatusBar } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Images } from '../../assets/Images';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { Fonts } from '../../common/Fonts';
import * as _PROFILE_SERVICES from '../../services/ProfileServices';
import { setUserInfo } from '../../redux/action/UserInfoAction';
import { Utils } from '../../common/Utils';
import Toast from 'react-native-toast-message';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

const Splash = (props: any) => {
    const isFocused = useIsFocused();
    const [animating, setAnimating] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        getUser();
    }, [isFocused]);

    const getUser = async () => {
        try {
            const token = await Utils.getData('_TOKEN');
            if (token) {
                const result: any = await _PROFILE_SERVICES.get_user();
                const { status_code, data, message = "" } = result;
                console.log(result);

                if (status_code === 200) {
                    dispatch(setUserInfo(data));
                    props.navigation.replace('HomeStack', { screeen: 'Home' })
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
            } else {
                setTimeout(() => {
                    setAnimating(false);
                    props.navigation.replace('HomeStack', { screeen: 'Home' })
                }, 2000);
            }
        } catch (error) {
            console.log(error);
        }
    }



    return (
        <LinearGradient
            colors={['#ffa500', '#ff4500']}
            style={styles.container}
        >
            <StatusBar backgroundColor={'#ffa500'} barStyle={'light-content'} />

            {/* Animated Logo */}
            <Animatable.View
                animation={'slideInDown'}
                duration={2000}
                useNativeDriver={true}
                style={styles.logoContainer}
            >
                <Image
                    source={Images.splashlogo}
                    style={styles.logo}
                    resizeMode='center'
                />
            </Animatable.View>

            <View style={styles.textContainer}>
                <Text style={styles.welcomeText}>WELCOME TO CLIKSHOP</Text>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffa500',
    },
    logoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    logo: {
        width: '70%',
        height: '20%',
    },
    textContainer: {
        position: 'absolute',
        bottom: 60,
    },
    welcomeText: {
        color: 'white',
        fontSize: 24,
        fontFamily: Fonts.LexendRegular,
    },
});

export default Splash;
