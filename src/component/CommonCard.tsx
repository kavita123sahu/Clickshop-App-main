import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import FastImage from 'react-native-fast-image'
import { BaseUrl } from '../config/Key';
import CustomStarRating from './CustomStarRating';

const CommonCard = (props: any) => {
    const onCardPress = async (id: any) => {
        props.navigation.navigate('ProductDetails', { productID: id })
    }

    function calculateDiscountPrice(unitPrice: number, discountPercent: number): number {
        if (typeof unitPrice !== 'number' || typeof discountPercent !== 'number') {
            throw new Error("Both unitPrice and discountPercent should be numbers.");
        }

        if (unitPrice < 0 || discountPercent < 0 || discountPercent > 100) {
            throw new Error("unitPrice should be non-negative and discountPercent should be between 0 and 100.");
        }

        const discountAmount = (unitPrice * discountPercent) / 100;
        const discountPrice = unitPrice - discountAmount;

        return parseFloat(discountPrice.toFixed(2));
    }

    let { id, rating, thumbnail_img, name, author, base_price, unit_price, discount } = props.item.item

    return (
        <TouchableOpacity onPress={() => { onCardPress(id) }} className='flex mx-2 my-2 w-[140px]'>
            <View style={styles.imageContainer}>
                <FastImage
                    style={styles.image}
                    resizeMode='stretch'
                    source={{ uri: BaseUrl.base + 'public/' + thumbnail_img }}
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
            <View className='flex flex-row items-center mt-1'>
                <CustomStarRating
                    rating={rating}
                    maxRating={5}
                    starSize={15}
                />
            </View>
            <View className='mt-[5px] flex flex-row items-center justify-between w-full'>
                <View className='flex flex-row justify-between items-center'>
                    <Text className='text-sm text-blackColor font-LexendMedium'>
                        ₹{calculateDiscountPrice(parseInt(base_price ? base_price : unit_price), parseInt(discount))}
                    </Text>
                    <Text className='text-[12px] text-blackColor50 font-Lexendlight ml-1 line-through'>
                        {base_price ? base_price : unit_price}
                    </Text>
                    <Text className='text-[11px] text-onlineColor font-Lexendlight ml-1'>
                        (-{discount}%)
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    textStroke: {
        textShadowColor: 'black',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 1,
        color: 'white' // Text color inside the stroke
    },
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

export default CommonCard