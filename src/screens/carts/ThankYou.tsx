import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, BackHandler, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { Fonts } from '../../common/Fonts';
const screenWidth = Dimensions.get('window').width;

const ThankYou = (props: any) => {
    const { navigation } = props;
    const { orderType } = props.route.params;

    const handleGoHome = () => {
        props.navigation.replace('HomeStack', { screen: 'TabStack' })
    };

    useEffect(() => {
        const backAction = () => {
            handleGoHome();
            return true;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={'#4CAF50'} />
            <LottieView
                source={require('../../assets/animations/thankyou.json')}
                autoPlay
                loop
                style={{ width: screenWidth <= 360 ? 200 : 400, height: screenWidth <= 360 ? 200 : 400 }}
            />
            <Text style={styles.text} className='text-center tracking-wide'>
                {
                    orderType === 'cod' ? `Cash on delivery ${'\n'} Order placed successfully🎉!` : 'Thank You for Your Payment!'
                }
            </Text>
            <Text style={styles.subtext} className='text-center tracking-wide px-3'>
                {
                    orderType === 'cod' ? `Order confirmation call will be made within 24hrs from our customer support team. ${'\n'} Thank you!` : 'Your order has been confirmed.🎉'
                }
            </Text>
            <TouchableOpacity style={styles.button} onPress={handleGoHome}>
                <Text className='text-center' style={styles.buttonText}>Go to Home</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 16,
        marginVertical: 10,
        color: '#333',
        fontFamily: Fonts.LexendSemiBold
    },
    subtext: {
        fontSize: 12,
        color: '#666',
        marginBottom: 30,
        fontFamily: Fonts.LexendRegular
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default ThankYou;
