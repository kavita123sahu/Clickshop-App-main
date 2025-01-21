import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import CommonHeader from './CommonHeader'
import FastImage from 'react-native-fast-image'
import { BaseUrl } from '../config/Key'
import { useIsFocused } from '@react-navigation/native'
import * as _SELLER_SERVICE from '../services/ProductDetailService';
import { Colors } from '../common/Colors'
import CustomStarRating from './CustomStarRating'
import { SafeAreaView } from 'react-native-safe-area-context'

const headerData = [
    { id: 0, title: 'ALL' },
    { id: 1, title: 'TOP' },
    { id: 2, title: 'NEW' },
    // { id: 3, title: 'BRANDS' },
    { id: 4, title: 'FEATURED' },
]

const SellerDetails = (props: any) => {
    const { navigation } = props;
    const { shop_id } = props.route.params;
    const isFocused = useIsFocused();
    const [headerId, setHeaderId] = useState(0);
    const [commonData, setCommonData] = useState([]);
    const [topUrl, setTopUrl] = useState();
    const [allUrl, setAllUrl] = useState();
    const [newUrl, setNewUrl] = useState();
    const [brandsUrl, setBrandsUrl] = useState();
    const [featuredUrl, setFeaturedUrl] = useState();
    const [loader, setLoader] = useState(true);
    const [shopData, setShopData] = useState<any>();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoadingMore, setIsLoadingMore] = useState(false);


    useEffect(() => {
        getSellerDetails();
    }, [isFocused])

    const getSellerDetails = async () => {
        try {
            const result: any = await _SELLER_SERVICE.getDataForSeller(shop_id);
            const { user, links } = result.data[0];
            if (result?.status === 200) {
                if (headerId === 0) {
                    getDataForCards(links?.all)
                }
                setShopData(result?.data[0])
                setAllUrl(links?.all);
                setTopUrl(links?.top);
                setBrandsUrl(links?.brands);
                setFeaturedUrl(links.featured);
                setNewUrl(links?.new);
            }
        } catch (error) {
            console.log("SELLER ERROR:", error);
        }
    }

    const getDataForCards = async (link: any, page = 1) => {
        try {
            page === 1 ? setLoader(true) : setIsLoadingMore(true);

            const paginatedLink = `${link}?page=${page}`;

            const result: any = await _SELLER_SERVICE.getDataFromLink(paginatedLink);

            const { status, data, meta } = result;
            if (status === 200) {
                setCommonData(prevData =>
                    page === 1 ? data : [...prevData, ...data]
                );
                setCurrentPage(meta.current_page);
                setTotalPages(meta.last_page);

                setLoader(false);
                setIsLoadingMore(false);
            } else {
                setLoader(false);
                setIsLoadingMore(false);
            }
        } catch (error) {
            console.log("error:", error);
            setLoader(false);
            setIsLoadingMore(false);
        }
    }

    const loadMoreData = () => {
        if (currentPage < totalPages && !isLoadingMore) {
            let urlToUse;
            switch (headerId) {
                case 0: urlToUse = allUrl; break;
                case 1: urlToUse = topUrl; break;
                case 2: urlToUse = newUrl; break;
                case 4: urlToUse = featuredUrl; break;
                default: return;
            }
            getDataForCards(urlToUse, currentPage + 1);
        }
    }

    const onHeaderPress = (item: any) => {
        setHeaderId(item.id);
        setCurrentPage(1);
        setCommonData([]);
        switch (item.id) {
            case 0:
                getDataForCards(allUrl);
                break;
            case 1:
                getDataForCards(topUrl);
                break;
            case 2:
                getDataForCards(newUrl);
                break;
            case 3:
                getDataForCards(brandsUrl);
                break;
            case 4:
                getDataForCards(featuredUrl);
                break;
            default:
                break;
        }
    };

    const renderHeader = ({ item, index }: { item: any, index: any }) => {
        return (
            <View className={`h-[29px] border-b-fieldGrayColor`}>
                <TouchableOpacity className={`flex flex-1 mx-3 h-[35px] ${item.id == headerId ? 'border-b-[3px]' : 'border-b-0'} rounded-b-sm border-b-orangeColor`} onPress={() => { onHeaderPress(item) }}>
                    <Text className={`${item.id == headerId ? 'text-textColor font-LexendMedium' : 'text-greyColor font-LexendRegular'} text-base tracking-wide`}>{item.title}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const renderRelatedProduct = ({ item }: { item: any }) => {
        const { thumbnail_image, name, author, base_price, current_stock, discount, rating, links, id, base_discounted_price } = item;
        return (
            <TouchableOpacity onPress={() => { navigation.navigate('ProductDetails', { productID: id }) }} className='flex mx-5 my-5 w-[140px]'>
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
                        <Text className='text-[16px] text-blackColor font-LexendMedium'>
                            ₹{base_discounted_price}
                        </Text>
                        <Text className='text-[12px] text-blackColor50 font-Lexendlight ml-1 line-through'>
                            {base_price}
                        </Text>
                        <Text className='text-[12px] text-onlineColor font-Lexendlight ml-1'>
                            (-{discount}%)
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView className="flex flex-1 bg-whiteColor">
            <CommonHeader title={"Shop Details"} navigation={navigation} isCartIcon={false} />
            <View className=''>
                <View className='flex justify-center items-center py-4 bg-yellow-400 '>
                    <View className=''>
                        <Text className='text-base text-center text-blackColor font-LexendMedium'>{shopData?.name}</Text>
                    </View>
                    {/* <View className='mt-2'>
                        <Text numberOfLines={2} className='text-sm text-center text-white font-LexendRegular'>{shopData?.user?.email}</Text>
                    </View>
                    <View className='flex flex-row items-center mt-2 w-[80%]'>
                        <Text numberOfLines={2} className='text-sm text-center text-white font-LexendRegular'>{shopData?.address}</Text>
                    </View> */}
                </View>
            </View>


            <View className="mt-5 px-5 pb-3 flex justify-center items-center">
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={headerData}
                    renderItem={renderHeader}
                    keyExtractor={(item: any) => item.id.toString()}
                />
            </View>
            <View className='mt-2'>
                {
                    loader ?
                        <View className='flex flex-1 justify-center items-center'>
                            <ActivityIndicator size={'large'} color={Colors.primaryColor} />
                        </View>
                        :
                        <View className="flex justify-center items-center pb-[20%]">
                            <FlatList
                                numColumns={2}
                                data={commonData}
                                renderItem={renderRelatedProduct}
                                showsVerticalScrollIndicator={false}
                                onEndReached={loadMoreData}
                                onEndReachedThreshold={0.5}
                                ListFooterComponent={
                                    isLoadingMore ? (
                                        <ActivityIndicator size="large" color={Colors.primaryColor} />
                                    ) : null
                                }
                            />
                        </View>
                }
            </View>
        </SafeAreaView>
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
        backgroundColor: 'white',
    },
    image: {
        width: '100%',
        height: '100%',
    },
});

export default SellerDetails