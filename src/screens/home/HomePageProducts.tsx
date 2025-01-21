import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BaseUrl } from '../../config/Key';
import FastImage from 'react-native-fast-image';
import { useIsFocused } from '@react-navigation/native';
import CommonCard from '../../component/CommonCard';

const HomePageProduct = (props: any) => {
    const { categorieData, navigation } = props;

    const onBannerPress = (category_id: any) => {
        props.navigation.navigate('AllBooks', { link: `https://clikshop.co.in/api/v3/products?sub_category=${category_id}` });
    }

    const onBannerSlidersPress = (link: string) => {
        const product_id = link.split('=')[1].split('&')[0];
        const endPointKey = link.split('?')[1].split('=')[0];
        let endPoint: string = '';
        if (endPointKey === 'subcategory') {
            endPoint = "sub_category";
        } else if (endPointKey === 'subsubcategory') {
            endPoint = 'sub_sub_category'
        } else if (endPointKey === 'sub3category') {
            endPoint = 'sub3_category'
        } else if (endPointKey === 'sub4category') {
            endPoint = 'sub4_category'
        } else if (endPointKey === 'sub5category') {
            endPoint = 'sub5_category'
        }
        const link_to_send = `https://clikshop.co.in/api/v3/products?${endPoint}=${product_id}`
        // const link_to_send2 = `https://clikshop.co.in/api/v3/products?${categoryDetail.type}=${categoryDetail.id}`
        navigation.navigate('AllBooks', { link: link_to_send });
    }

    const renderCategories = ({ item }: { item: any }) => {
        const { id = 0, name = "", image = "", slug = "" } = item;
        return (
            <TouchableOpacity onPress={() => { onBannerPress(id) }} className='flex w-[150px] h-[150px] rounded-[8px] mx-2 my-2 border-[1px] border-borderColor' style={{}}>
                <View className='w-full h-[70%] rounded-t-[8px]'>
                    <FastImage
                        className='w-full h-full rounded-t-[8px]'
                        resizeMode='cover'
                        source={{ uri: BaseUrl.base + 'public/' + image }} />
                </View>
                <View className='px-2 py-2'>
                    <Text numberOfLines={2} className='text-xs text-center text-slate-800 font-LexendRegular'>{name}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    const renderSliders = ({ item }: { item: any }) => {
        const { id = 0, photo = "", link = "" } = item;
        const catID = link.split('=')[1]
        return (
            <TouchableOpacity onPress={() => { onBannerSlidersPress(link) }} className='flex w-[250px] h-[150px] mx-1 my-2' style={{}}>
                <View className='w-full h-full'>
                    <FastImage
                        className='w-full h-full'
                        resizeMode='cover'
                        source={{ uri: BaseUrl.base + 'public/' + photo }} />
                </View>
            </TouchableOpacity>
        )
    }

    const renderAllProducts = ({ item }: { item: any }) => {
        const { name, sliders, sub_categories, products } = item;
        return (
            <View className='flex flex-1'>
                {
                    products.length > 0 ?
                        <View className='mt-6 px-5 py-5 justify-center items-center border-[1px] border-borderColor bg-bgcolor'>
                            <Text className='text-primaryColor text-[20px] font-LexendMedium'>{name}</Text>
                        </View>
                        : null
                }

                {
                    products.length > 0 ?
                        <View className='mt-2'>
                            <FlatList
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                data={[...sub_categories].reverse()}
                                renderItem={renderCategories}
                                keyExtractor={(item: any) => item.id.toString()}
                            />
                        </View>
                        : null
                }

                {
                    products.length ?
                        <View className='mt-2'>
                            <FlatList
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                data={sliders}
                                renderItem={renderSliders}
                                keyExtractor={(item: any) => item.id.toString()}
                            />
                        </View>
                        : null
                }

                {
                    products.length ?
                        <View className='my-5 mx-3'>
                            <FlatList
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                data={products}
                                renderItem={(item) => {
                                    return (
                                        <CommonCard item={item} navigation={navigation} />
                                    )
                                }}
                                keyExtractor={(item: any) => item.id.toString()}
                            />
                        </View>
                        : null
                }
            </View>
        )
    }
    return (
        <View className='flex flex-1'>
            <FlatList
                data={categorieData}
                renderItem={renderAllProducts}
                keyExtractor={(item: any) => item.id.toString()}
            />
        </View>
    )
}

export default HomePageProduct