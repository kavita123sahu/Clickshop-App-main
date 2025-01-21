import { View, Text, FlatList, TouchableOpacity, Touchable, ActivityIndicator, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as _ADDRESS_SERVICES from '../services/AddressServices';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import { Colors } from '../common/Colors';
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Fonts } from '../common/Fonts';

const Addresses = (props: any) => {
    const { navigation } = props;
    const isFocused = useIsFocused();
    const [addresses, setAddresses] = useState([]);
    const [defaultID, setDefaultID] = useState();
    const [loader, setLoader] = useState(true);
    const [deleteLoader, setDeleteLoader] = useState(false);
    const [itemId, setItemId] = useState();

    useEffect(() => {
        getAddress();
    }, [isFocused])

    const getAddress = async () => {
        try {
            setLoader(true);
            const result: any = await _ADDRESS_SERVICES.getAddress();
            const { status_code, message = "", data } = result;
            if (status_code === 200) {
                if (data?.length === 1) {
                    setDefaultID(data[0]?.id);
                    setAddresses(data);
                    setLoader(false);
                } else {
                    const d = data?.filter((i: any) => i.set_default === 1)
                    setDefaultID(d[0]?.id)
                    setAddresses(data);
                    setLoader(false);
                }
            } else {
                setLoader(false);
            }
        } catch (error) {
            console.log("ADDRESS ERROR11111:", error);
            setLoader(false);
        }
    }

    const setDefaultAddress = async (id: number) => {
        try {
            const result: any = await _ADDRESS_SERVICES.setDefaultAddress(id);
            const { status_code, message = "", data } = result;
            if (status_code === 200) {
                props.closeModal()
                getAddress()
            } else {

            }
        } catch (error) {
            console.log("ADDRESS ERROR22222:", error);
        }
    }

    const handleDeleteAddress = async (id: number) => {
        try {
            setDeleteLoader(true);
            const result: any = await _ADDRESS_SERVICES.deleteAddress(id);
            const { status_code, message = "" } = result;
            if (status_code === 200) {
                setDeleteLoader(false);
                Toast.show({
                    text2: message,
                    type: 'success',
                    position: 'bottom',
                    text1Style: { fontSize: 16, fontFamily: Fonts.LexendBold, color: 'green' },
                    text2Style: { fontSize: 12, fontFamily: Fonts.LexendMedium, color: 'green' }
                });
                getAddress();
            } else {
                setDeleteLoader(false);
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
            setDeleteLoader(false);
        }
    }

    function capitalizeFirstLetter(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const renderAddresses = ({ item }: { item: any }) => {
        return (
            <TouchableOpacity onPress={() => { setDefaultAddress(item.id) }} className={`${item.id === defaultID ? 'bg-gray-300 border-primaryColor' : 'border-borderColor'} border w-full rounded-lg p-3 mt-5`}>
                <View className='flex flex-row items-center justify-between'>
                    <View className='flex flex-row items-center'>
                        {
                            item?.address_type && (
                                <>
                                    <Octicons name='location' color={Colors.primaryColor} size={20} />
                                    <View className='border px-3 py-1 border-primaryColor rounded-md ml-2'>
                                        <Text className='text-sm text-orangeColor font-LexendRegular'>{capitalizeFirstLetter(item?.address_type)}</Text>
                                    </View>
                                </>
                            )
                        }
                    </View>
                    <View className='flex flex-row gap-5'>
                        <TouchableOpacity onPress={() => { handleDeleteAddress(item?.id); setItemId(item?.id); }}>
                            {(deleteLoader && itemId === item?.id) ?
                                <ActivityIndicator size={'small'} color={Colors.primaryColor} />
                                :
                                <AntDesign name='delete' color={Colors.primaryColor} size={20} />
                            }
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { navigation.navigate('Address', { isEdit: true, addressID: item?.id }); props.closeModal() }}>
                            <AntDesign name='edit' color={Colors.primaryColor} size={20} />
                        </TouchableOpacity>

                    </View>
                </View>

                <View className='mt-3'>
                    <View className=''>
                        <Text className='text-sm text-black font-LexendMedium'>Address</Text>
                        <Text className='text-sm text-black font-Lexendlight'>{item?.address}</Text>
                    </View>
                    <View className='mt-3'>
                        <Text className='text-sm text-black font-LexendMedium'>Contact</Text>
                        <Text className='text-sm text-black font-Lexendlight'>{item?.phone} | {item?.email}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )

    }

    return (
        <SafeAreaView className='flex flex-1 px-5'>
            <View className='flex flex-row justify-between items-center w-full mt-3'>
                <Text className='text-base text-newTextColor font-LexendRegular'>Shipping address</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Address', { isEdit: false })} className='flex flex-row items-center'>
                    <Entypo name='plus' color={Colors.primaryColor} size={20} />
                    <Text className='text-base text-primaryColor font-LexendRegular ml-1'>Add Address</Text>
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
                {loader ? (
                    <View className='flex-1 justify-center items-center'>
                        <ActivityIndicator size={'large'} color={Colors.primaryColor} />
                    </View>
                ) : (
                    <FlatList
                        data={addresses}
                        renderItem={renderAddresses}
                        keyExtractor={(i: any) => i.id.toString()}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        showsVerticalScrollIndicator={false}
                        nestedScrollEnabled={true}
                    />
                )}
            </View>
        </SafeAreaView>

    )
}

export default Addresses