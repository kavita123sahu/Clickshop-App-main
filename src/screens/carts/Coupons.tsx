import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Dimensions, Platform, ScrollView } from 'react-native'
import React, { useState } from 'react'
import CommonHeader from '../../component/CommonHeader'
import Feather from 'react-native-vector-icons/Feather';


const Coupons = (props: any) => {
    const [coupon, setCoupon] = useState('');
    const [discount, setDiscount] = useState(0);
    const [couponsData, setCouponsData] = useState([
        { id: 0, code: 'NONFICTION5', off_rate: '₹ 50 OFF', expiry_date: '31 December 2024' },
        { id: 1, code: 'NONFICTION5', off_rate: '₹ 50 OFF', expiry_date: '31 December 2024' },
        { id: 2, code: 'NONFICTION5', off_rate: '₹ 50 OFF', expiry_date: '31 December 2024' },
        { id: 3, code: 'NONFICTION5', off_rate: '₹ 50 OFF', expiry_date: '31 December 2024' },
        { id: 4, code: 'NONFICTION5', off_rate: '₹ 50 OFF', expiry_date: '31 December 2024' },
        { id: 5, code: 'NONFICTION5', off_rate: '₹ 50 OFF', expiry_date: '31 December 2024' }
    ])

    const applyCoupon = () => {
        if (coupon === 'DISCOUNT10') {
            setDiscount(10);
        } else {
            setDiscount(0);
        }
    };

    const renderCouponsCard = ({ item }: { item: any }) => {
        return (
            <View className='w-full h-[110px] bg-bgcolor border-[1px] border-borderColor flex px-3 py-3 my-3 rounded-md flex-row justify-between'>
                <View>
                    <View>
                        <Text className='text-[13px] text-newTextColor font-Lexendlight text-center'>Coupon Code</Text>
                    </View>
                    <View className='mt-1'>
                        <Text className='text-[15px] text-newTextColor font-LexendMedium text-center'>{item.code}</Text>
                    </View>
                    <View className='mt-1 flex flex-row items-center justify-center'>
                        <Feather name='info' size={12} color={'blue'} style={{ marginTop: 2 }} />
                        <Text className='text-[12px] text-blue-600 font-LexendMedium text-center ml-1'>{'T & C apply'}</Text>
                    </View>
                </View>

                <View className='w-[1px] h-[80%] bg-slate-900'></View>

                <View>
                    <View>
                        <Text className='text-newTextColor text-[15px] font-LexendMedium text-center'>{item.off_rate}</Text>
                    </View>
                    <View className='mt-1'>
                        <Text className='text-[13px] text-newTextColor font-Lexendlight text-center'>{item.expiry_date}</Text>
                    </View>
                    <TouchableOpacity onPress={applyCoupon} className='px-2 py-2 flex justify-center items-center bg-primaryColor rounded-[30px]  mt-1'>
                        <Text style={styles.applyCouponButtonText} className='font-LexendRegular'>Apply</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    const screenHeight = Dimensions.get('window').height

    return (
        <View className='flex flex-1 bg-whiteColor'>
            <CommonHeader title={'Apply Coupons'} navigation={props.navigation} isCartIcon={false} />
            <View className='px-5'>
                <View style={styles.couponContainer}>
                    <TextInput
                        className='font-LexendRegular'
                        placeholder="Enter coupon code"
                        value={coupon}
                        onChangeText={setCoupon}
                        style={styles.couponInput}
                    />
                    <TouchableOpacity onPress={applyCoupon} style={styles.applyCouponButton}>
                        <Text style={styles.applyCouponButtonText} className='font-LexendRegular'>Apply</Text>
                    </TouchableOpacity>
                </View>

                <View className='mt-3'>
                    <Text className='text-[18px] text-newTextColor font-LexendMedium tracking-wider'>All Coupons</Text>
                </View>

                <View className='flex'>
                    <FlatList
                        style={{ height: screenHeight > 670 ? Platform.OS === 'android' ? screenHeight * 0.66 : screenHeight * 0.65 : screenHeight * 0.64 }}
                        data={couponsData}
                        renderItem={renderCouponsCard}
                        keyExtractor={(i: any) => i.id}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    couponContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 16,
    },
    couponInput: {
        flex: 1,
        padding: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        color: 'black'
    },
    applyCouponButton: {
        marginLeft: 8,
        padding: 8,
        backgroundColor: '#4682b4',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        width: 60
    },
    applyCouponButtonText: {
        color: '#fff',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        marginVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2, // for Android
    },
    cardContent: {
        flex: 1,
    },
    couponCode: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    discount: {
        fontSize: 14,
        color: '#4caf50',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: '#555',
    },
    applyButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#4682b4',
        borderRadius: 4,
    },
    applyButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default Coupons