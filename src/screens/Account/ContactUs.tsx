import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CommonHeader from '../../component/CommonHeader';
import LinearGradient from 'react-native-linear-gradient';
import { Fonts } from '../../common/Fonts';

const screenWidth = Dimensions.get('window').width

const ContactUs = (props: any) => {
    const { navigation } = props;
    const handleEmailPress = () => {
        Linking.openURL('mailto:clikshopinfo@gmail.com');
    };

    const handlePhonePress = () => {
        Linking.openURL('tel:8109658338');
    };
    const handlePhonePress2 = () => {
        Linking.openURL('tel:7389980438');
    };

    const handleWebsitePress = () => {
        Linking.openURL('https://clikshop.co.in/');
    };

    const onTrackOrder = () => {
        Linking.openURL('https://clikshop.co.in/track_your_order')
    }

    return (
        <View style={styles.container}>
            <CommonHeader navigation={navigation} title='Contact details' isCartIcon={false} />
            <ScrollView>
                <View className='p-5'>
                    <View className='p-4 border border-borderColor rounded-md'>
                        <Text className='text-2xl text-left text-newTextColor font-LexendMedium'>Safety Notice</Text>
                        <Text className='text-sm text-left text-newTextColor font-Lexendlight mt-1 leading-6'>
                            Dear Customers,
                            {'\n'}
                            {'\n'}
                            Beware of scams offering free gifts for payments via unsoliciated calls or SMS.We do not take resposibility for such transactions.Report any suspicious activity to clikshopinfo@gmail.com
                        </Text>
                    </View>
                    <View className='p-4 border border-borderColor rounded-md mt-5'>
                        <Text className='text-2xl text-left text-newTextColor font-LexendMedium'>Track your order</Text>
                        <Text className='text-sm text-left text-newTextColor font-Lexendlight mt-1 leading-6'>
                            Please visit the following website with your order or tracking number :
                        </Text>
                        <Text onPress={onTrackOrder} className='text-base text-left text-primaryColor font-LexendRegular mt-1'>
                            Track Order
                        </Text>

                        <Text className='text-sm text-left text-newTextColor font-Lexendlight mt-1 leading-6'>
                            if no tracking information is available,please wait for few days while the system updates.
                        </Text>
                    </View>


                    <LinearGradient
                        colors={['#FF8C00', '#FF0073']}
                        className='p-4 rounded-md mt-5 space-y-3'
                    >
                        <View>
                            <Text className='text-2xl text-whiteColor text-left font-LexendMedium'>Get in touch</Text>
                        </View>
                        <TouchableOpacity style={styles.contactItem} onPress={handleEmailPress}>
                            <Icon name="email" size={24} color="white" />
                            <Text style={styles.contactText}>clikshopinfo@gmail.com</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.contactItem}>
                            <Icon name="phone" size={24} color="white" />
                            <Text onPress={handlePhonePress} style={styles.contactText}>+91 8109658338</Text>
                            <Text onPress={handlePhonePress2} style={styles.contactText}>+91 7389980438</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.contactItem} onPress={handleWebsitePress}>
                            <Icon name="language" size={24} color="white" />
                            <Text style={styles.contactText}>www.clikshop.co.in</Text>
                        </TouchableOpacity>

                        <View style={styles.addressContainer}>
                            <Icon name="location-on" size={24} color="white" />
                            <Text style={styles.addressText}>
                                Shop No - 53,Ward No - 46,Near Gayatri Temple,Shyam Prasad Mukharjee Nagar,{'\n'}
                                Bilaspur 495001, Chhattisgarh{'\n'}
                                India
                            </Text>
                        </View>
                    </LinearGradient>

                    <View className='mt-5 pb-4'>
                        <Text className='text-sm text-left text-newTextColor font-Lexendlight mt-1 leading-6'>
                            We are committed to providing timely delivery and appreciate your patience.For any questions or assistance, please contact us at
                        </Text>
                        <Text onPress={handleEmailPress} className='text-sm text-left text-primaryColor font-Lexendlight mt-1 leading-6'>
                            contact@clikshop.co.in
                        </Text>
                        <Text className='text-sm text-left text-newTextColor font-Lexendlight mt-1 leading-6'>
                            Please note that our response time may take 24-48 business hours.
                            {'\n'}
                            Thank you for your understanding.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    contactText: {
        marginLeft: 10,
        fontSize: screenWidth <= 360 ? 13 : 16,
        color: 'white',
        fontFamily: Fonts.LexendRegular
    },
    addressContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    addressText: {
        marginLeft: 10,
        fontSize: 16,
        color: 'white',
        fontFamily: Fonts.LexendRegular
    },
});

export default ContactUs;