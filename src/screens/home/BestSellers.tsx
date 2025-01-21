import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '../../common/Colors';
import { useIsFocused } from '@react-navigation/native';
import * as _HPS_ from '../../services/HomeServices';
import StarRating from 'react-native-star-rating';
import FastImage from 'react-native-fast-image';
import { BaseUrl } from '../../config/Key';
import CustomStarRating from '../../component/CustomStarRating';



const BestSellers = (props: any) => {
    const [BestSellerData, setBestSellerData] = useState([]);
    const isFocued = useIsFocused();

    useEffect(() => {
        getSellingData();
    }, [isFocued])

    const getSellingData = async () => {
        try {
            let response: any = await _HPS_.selling_product();
            if (response.status == 200) {
                setBestSellerData(response.data)
            } else if (response.status == 201) {
                setBestSellerData([]);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const onCardPress = async (item: any) => {
        props.navigation.navigate('ProductDetails', { productID: item.id })
    }


    const renderBestSellingProduct = ({ item }: { item: any }) => {
        const { thumbnail_image, name, author, base_price, current_stock, discount, rating, base_discounted_price } = item;

        return (
            <TouchableOpacity onPress={() => { onCardPress(item) }} className='flex mx-2 my-2 w-[140px]'>
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
            {
                BestSellerData.length > 0 ?
                    <>
                        <View className='px-5'>
                            <View className='flex flex-row w-full justify-between items-center mt-6'>
                                <View className=''>
                                    <Text className='text-blackColor text-[20px] font-LexendMedium'>Best Selling Products</Text>
                                </View>
                                {/* <View className='flex flex-row items-center'>
                                    onPress={() => { props.navigation.navigate('ViewAll', { title: 'Best selling products', id: 'bestseller' }) }}
                                    <TouchableOpacity className=''>
                                        <Text className='text-primaryColor text-[16px] font-LexendMedium'>View all</Text>
                                    </TouchableOpacity>
                                    <Entypo name='chevron-right' size={20} color={Colors.primaryColor} />
                                </View> */}
                            </View>
                        </View>
                        <View className='mt-2'>
                            <FlatList
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                data={BestSellerData}
                                renderItem={renderBestSellingProduct}
                            // keyExtractor={(item: any) => item.id.toString()}
                            />
                        </View>
                    </>

                    : null
            }
        </View >
    )
}
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

export default BestSellers