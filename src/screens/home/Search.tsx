import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import SearchBar from '../../component/SearchBar';
import FastImage from 'react-native-fast-image';
import { Colors } from '../../common/Colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { BaseUrl } from '../../config/Key';
import { useDebouncedValue } from '../../hooks/useDebaunce';
import * as _SEARCH_SERVICE from '../../services/SearchService';
import CustomStarRating from '../../component/CustomStarRating';
import Toast from 'react-native-toast-message';
import { Fonts } from '../../common/Fonts';
import { SafeAreaView } from 'react-native-safe-area-context';

const Search = (props: any) => {
    const { navigation } = props;
    const [searchText, setSearchText] = useState<string>('');
    const [searchData, setSearchData] = useState([]);
    const [loader, setLoader] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const debouncedSearchText = useDebouncedValue(searchText, 200);

    useEffect(() => {
        getSearchData(1, false);
    }, [debouncedSearchText]);

    const getSearchData = async (page = 1, loadMore = false) => {
        setLoader(true);
        try {
            const result: any = await _SEARCH_SERVICE.get_all_products(debouncedSearchText, page);
            const { status_code, data } = result;
            if (status_code === 200) {
                setSearchData(loadMore ? [...searchData, ...data.products] : data.products);
                setCurrentPage(data.pagination.page);
                setTotalPages(data.pagination.total_pages);
                setLoader(false);
            } else {
                setLoader(false);
                Toast.show({
                    text1: 'Information!',
                    text2: "Something went wrong please try again later",
                    type: 'info',
                    position: 'bottom',
                    text1Style: { fontSize: 16, fontFamily: Fonts.LexendBold, color: 'yellow' },
                    text2Style: { fontSize: 12, fontFamily: Fonts.LexendMedium, color: 'black' }
                });
            }
        } catch (error) {
            console.log("SEARCH ERROR:", error);
            setLoader(false);
        }
    };

    const onChangeText = (e: string) => {
        setSearchText(e);
        setCurrentPage(1);
    };

    const onCardPress = async (id: any) => {
        props.navigation.navigate('ProductDetails', { productID: id });
    };

    const loadMore = () => {
        if (currentPage < totalPages) {
            getSearchData(currentPage + 1, true);
        }
    };

    const renderItem = ({ item }: { item: any }) => {
        let { id, thumbnail, name, price, discounted_price, rating, discount } = item;
        return (
            <TouchableOpacity onPress={() => { onCardPress(id) }} style={{ width: '47%', marginVertical: 20 }}>
                <View style={styles.imageContainer}>
                    <FastImage
                        style={styles.image}
                        resizeMode='stretch'
                        source={{ uri: BaseUrl.base + 'public/' + thumbnail }}
                    />
                </View>
                <View className='mt-2'>
                    <Text numberOfLines={1} className='text-newTextColor text-sm font-LexendMedium'>
                        {name}
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
                        <Text className='text-[15px] text-blackColor font-LexendMedium'>
                            ₹{discounted_price}
                        </Text>
                        <Text className='text-[11px] text-blackColor50 font-Lexendlight ml-1 line-through'>
                            {price}
                        </Text>
                        <Text className='text-[11px] text-onlineColor font-Lexendlight ml-1'>
                            (-{discount}%)
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const listEmptyComponent = () => {
        return (
            <View className='flex flex-1 justify-center items-center'>
                <Text>No Books available for this search.</Text>
            </View>
        );
    };

    const renderFooter = () => {
        if (!loader) return null;
        return (
            <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator size="large" color={Colors.primaryColor} />
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bgGrayColor }}>
            {/* <View className='flex flex-1 bg-whiteColor'> */}
            <View className='flex flex-row items-center w-full px-4'>
                <TouchableOpacity className='mt-2' onPress={() => { navigation.goBack() }}>
                    <MaterialIcons name='arrow-back' size={25} color={Colors.black} />
                </TouchableOpacity>
                <View className='ml-2 w-[90%]'>
                    <SearchBar searchText={searchText} onChangeText={onChangeText} autoFocus={true} />
                </View>
            </View>
            <View className='px-4 mt-2'>
                <FlatList
                    numColumns={2}
                    data={searchData}
                    renderItem={renderItem}
                    keyExtractor={(item: any, index: any) => index.toString()}
                    ListEmptyComponent={listEmptyComponent}
                    onEndReached={loadMore}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={renderFooter}
                    showsVerticalScrollIndicator={false}
                />
            </View>
            {/* </View> */}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    textStroke: {
        textShadowColor: 'black',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 1,
        color: 'white'
    },
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

export default Search;