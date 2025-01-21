import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import FastImage from 'react-native-fast-image';
import * as _HPS_ from '../../services/HomeServices';
import { BaseUrl } from '../../config/Key';

const NewArrival = (props: any) => {
    const [newArrival, setNewArrival] = useState([]);

    useEffect(() => {
        getNewArrivalData();
    }, []);

    const getNewArrivalData = async () => {
        try {
            let result: any = await _HPS_.new_arrival();
            const { data, status } = result;
            if (status == 200) {
                setNewArrival(data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const onCardPress = async (id: any) => {
        props.navigation.navigate('ProductDetails', { productID: id })
    }

    const renderUpcomingExam = ({ item }: { item: any }) => {
        const { thumbnail_image, name, author, base_price, current_stock, discount, rating, links, id, base_discounted_price } = item;
        return (
            <TouchableOpacity onPress={() => { onCardPress(id) }} className='flex mx-2 my-2 w-[140px]'>
                <View style={styles.imageContainer}>
                    <FastImage
                        style={styles.image}
                        resizeMode='stretch'
                        source={{ uri: BaseUrl.base + 'public/' + thumbnail_image }}
                    />
                </View>
                <View className='mt-2'>
                    <Text numberOfLines={1} className='text-newTextColor text-sm font-LexendMedium'>
                        {name}
                    </Text>
                </View>
                <View className='mt-2'>
                    <Text numberOfLines={1} className='text-newTextColor text-xs font-Lexendlight'>
                        {author}
                    </Text>
                </View>
                <View className='mt-[5px] flex flex-row items-center justify-between w-full'>
                    <View className='flex flex-row justify-between items-center'>
                        <Text className='text-sm text-blackColor font-LexendMedium'>
                            ₹{base_discounted_price}
                        </Text>
                        <Text className='text-[12px] text-blackColor50 font-Lexendlight ml-1 line-through'>
                            {base_price}
                        </Text>
                        <Text className='text-[11px] text-onlineColor font-Lexendlight ml-1'>
                            (-{discount}%)
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View>
            <View className='mt-6 px-5'>
                <Text className='text-blackColor text-[22px] font-LexendMedium'>New Arrival</Text>
            </View>
            <View className='mt-2'>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={newArrival}
                    renderItem={renderUpcomingExam}
                    keyExtractor={(item: any, index: any) => index.toString()}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        width: '100%',
        height: 180,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        backgroundColor: 'white', // Ensure the shadow is visible by adding a background color
    },
    image: {
        width: '100%',
        height: '100%',
    },
});

export default NewArrival;
