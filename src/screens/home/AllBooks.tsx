import { View, Text, Dimensions, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useIsFocused } from '@react-navigation/native';
import * as _HPS from '../../services/HomeServices';
import { Colors } from '../../common/Colors';
import FastImage from 'react-native-fast-image';
import { BaseUrl } from '../../config/Key';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';
import Modal from 'react-native-modal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Filter from '../../component/Filter';
import CommonHeader from '../../component/CommonHeader';
import SearchBar from '../../component/SearchBar';
import BottomSheet from '@gorhom/bottom-sheet';
import { Fonts } from '../../common/Fonts';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDebouncedValue } from '../../hooks/useDebaunce';
import CustomStarRating from '../../component/CustomStarRating';


const screen_height = Dimensions.get('window').height;

interface Props {
    navigation: any;
    route: {
        params: {
            link: string;
            category_id: number;
        };
    };
}

interface Product {
    id: number;
    rating: number;
    thumbnail_image: string;
    name: string;
    author: string;
    base_price: string;
    base_discounted_price: string;
    discount: string;
    links: any;
}

interface CurrentFilters {
    priceRange?: {
        min: string;
        max: string;
    };
    sortBy?: {
        field: string;
        order: string;
    };
}

const AllBooks = (props: any) => {
    const { link, category_id, categoryDetail } = props.route.params;
    const { navigation } = props;
    const isFocused = useIsFocused();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [searchText, setSearchText] = useState<string>('');
    const [subCategoryData, setSubCategoryData] = useState<Product[]>([]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [filterId, setFilterId] = useState<number>(0);

    const [page, setPage] = useState<number>(1);
    const [lastPage, setLastPage] = useState<number>(1);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
    const [hasMoreData, setHasMoreData] = useState<boolean>(true);
    const [totalData, setTotalData] = useState<number | undefined>(0);
    const [sortBy, setSortBy] = useState('');
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [currentFilters, setCurrentFilters] = useState<CurrentFilters>({});
    const debouncedSearchText = useDebouncedValue(searchText, 200);

    useEffect(() => {
        if (isFocused) {
            setPage(1);
            setSubCategoryData([]);
            setIsInitialLoading(true);
        }
    }, [isFocused]);

    useEffect(() => {
        getAllProducts(1, true);
    }, [sortBy, sortOrder, priceMin, priceMax, debouncedSearchText, isFocused])

    const onChangeText = (e: string) => {
        setSearchText(e);
    };

    const getAllProducts = async (
        currentPage: number,
        isInitial: boolean = false,
        {
            sort_by = sortBy,
            sort_order = sortOrder,
            price_min = priceMin,
            price_max = priceMax,
            search = debouncedSearchText,
            category = '',
            limit = 10
        }: {
            sort_by?: string,
            sort_order?: string,
            price_min?: string | number,
            price_max?: string | number,
            search?: string
            category?: string,
            limit?: number
        } = {}
    ) => {
        if (!isInitial && isLoadingMore) return;
        const loadingState = isInitial ? setIsInitialLoading : setIsLoadingMore;
        loadingState(true);
        try {
            const result: any = await _HPS.get_all_products(link, {
                sort_by,
                sort_order,
                price_min,
                price_max,
                search,
                category,
                page: currentPage,
                limit
            });
            const { status_code, data } = result;
            if (status_code === 200) {
                if (data.products.length > 0) {
                    setSubCategoryData((prevData) =>
                        isInitial ? data.products : [...prevData, ...data.products]
                    );
                    setLastPage(data.pagination.last_page);
                    setHasMoreData(currentPage < data.pagination.last_page);
                    setTotalData(data?.pagination?.total);
                    setIsInitialLoading(false);
                    if (!isInitial) {
                        setPage(currentPage);
                    }
                } else {
                    setSubCategoryData([]);
                    setTotalData(data?.pagination?.total);
                    setHasMoreData(false);
                    setIsInitialLoading(false);
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            loadingState(false);
        }
    };

    const onApplyFilter = (price_min: string, price_max: string) => {
        setCurrentFilters(prev => ({
            ...prev,
            priceRange: { min: price_min, max: price_max }
        }));
        setPriceMin(price_min);
        setPriceMax(price_max);
        closeModal();
        setPage(1);
    };

    const onClearFilter = () => {
        setCurrentFilters(prev => ({ ...prev, priceRange: undefined }));
        setPriceMax('');
        setPriceMin('');
        closeModal();
        setPage(1);
    };

    const onApplySort = (sort_by: string, order: string) => {
        setCurrentFilters(prev => ({
            ...prev,
            sortBy: { field: sort_by, order: order }
        }));
        setSortBy(sort_by);
        setSortOrder(order);
        closeModal();
        setPage(1);
    };

    const onClearSort = () => {
        setCurrentFilters(prev => ({ ...prev, sortBy: undefined }));
        setSortBy('');
        setSortOrder('');
        closeModal();
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const onCardPress = (id: number) => {
        navigation.navigate('ProductDetails', { productID: id });
    };

    const handleLoadMore = () => {
        console.log("page =================> ", page, lastPage);
        if ((hasMoreData && !isLoadingMore) && (page < lastPage)) {
            getAllProducts(page + 1);
        }
    };

    const renderFooter = () => {
        if (!isLoadingMore) return null;
        return (
            <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator size="large" color={Colors.primaryColor} />
            </View>
        );
    };

    const renderCard = ({ item }: { item: any }) => (
        <TouchableOpacity
            onPress={() => onCardPress(item.id)}
            style={{ width: '47%', marginVertical: 20 }}
        >
            <View style={styles.imageContainer}>
                <FastImage
                    style={styles.image}
                    resizeMode='stretch'
                    source={{ uri: BaseUrl.base + 'public/' + item?.thumbnail }}
                />
            </View>
            <View style={{ marginTop: 2 }}>
                <Text numberOfLines={1} style={{ color: Colors.newTextColor, fontSize: 14, fontFamily: Fonts.LexendMedium }}>
                    {item.name}
                </Text>
            </View>
            <View style={{ marginTop: 2 }}>
                <Text numberOfLines={1} style={{ color: Colors.newTextColor, fontSize: 12, fontFamily: Fonts.Lexendlight }}>
                    {item.author}
                </Text>
            </View>
            <View className='flex flex-row items-center mt-1'>
                <CustomStarRating
                    rating={item?.rating}
                    maxRating={5}
                    starSize={15}
                />
            </View>
            <View style={{ marginTop: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, color: Colors.black, fontFamily: Fonts.LexendMedium }}>
                        ₹{item?.discounted_price?.toFixed(2)}
                    </Text>
                    <Text style={{ fontSize: 12, color: Colors.blackColor50, fontFamily: Fonts.Lexendlight, marginLeft: 1, textDecorationLine: 'line-through' }}>
                        {item.price}
                    </Text>
                    <Text style={{ fontSize: 11, color: Colors.green, fontFamily: Fonts.Lexendlight, marginLeft: 1 }}>
                        (-{item.discount}%)
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bgGrayColor }}>
            <Modal
                isVisible={modalVisible}
                onBackButtonPress={closeModal}
                animationIn='slideInUp'
                animationOut='slideOutDown'
                animationInTiming={1}
                animationOutTiming={1}
                onBackdropPress={closeModal}
                coverScreen
                style={{ margin: 0, flex: 1, justifyContent: 'flex-start' }}
            >
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <BottomSheet
                        ref={bottomSheetRef}
                        snapPoints={['25%', '65%']}
                        index={1}
                    >
                        <Filter
                            closeModal={closeModal}
                            filterId={filterId}
                            onApplyFilter={onApplyFilter}
                            onClearFilter={onClearFilter}
                            onApplySort={onApplySort}
                            onResetSort={onClearSort}
                            currentFilters={currentFilters}
                        />
                    </BottomSheet>
                </GestureHandlerRootView>
            </Modal>

            <CommonHeader title='All Books' navigation={navigation} isCartIcon={true} />
            {
                subCategoryData.length > 0 && (
                    <View className='px-4'>
                        <SearchBar searchText={searchText} onChangeText={onChangeText} autoFocus={false} />
                    </View>
                )
            }
            <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <View style={{ height: 30, borderWidth: 0.5, borderColor: Colors.grey1, borderRadius: 6, paddingHorizontal: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.grey1 }}>
                        <Text style={{ fontSize: 12, color: Colors.white, fontFamily: Fonts.LexendRegular, fontWeight: 'bold' }}>Items count: {totalData}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <TouchableOpacity
                            onPress={() => { setModalVisible(true); setFilterId(2); }}
                            style={{ flexDirection: 'row', alignItems: 'center', padding: 4, borderWidth: 0.5, borderColor: Colors.greyBorder, borderRadius: 6 }}
                        >
                            <Octicons name='sort-desc' size={14} color={Colors.greyBorder} />
                            <Text style={{ fontSize: 12, marginLeft: 4, color: Colors.greyBorder, fontFamily: Fonts.LexendRegular }}>Sort</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => { setModalVisible(true); setFilterId(1); }}
                            style={{ flexDirection: 'row', alignItems: 'center', padding: 4, borderWidth: 0.5, borderColor: Colors.greyBorder, borderRadius: 6 }}
                        >
                            <Feather name='filter' size={14} color={Colors.greyBorder} />
                            <Text style={{ fontSize: 12, marginLeft: 4, color: Colors.greyBorder, fontFamily: Fonts.LexendRegular }}>Filter</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={{ marginTop: 20, paddingHorizontal: 12, paddingBottom: 32, height: screen_height - (60 + screen_height * 0.08) - 90 }}>
                {isInitialLoading ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size='large' color={Colors.primaryColor} />
                    </View>
                ) : subCategoryData.length > 0 ? (
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        numColumns={2}
                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                        data={subCategoryData}
                        renderItem={renderCard}
                        keyExtractor={(item: Product, index: any) => index.toString()}
                        contentContainerStyle={{}}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.1}
                        ListFooterComponent={renderFooter}
                    />
                ) : (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: Colors.blackColor50, fontSize: 20, fontWeight: '600' }}>No Products Available</Text>
                    </View>
                )}
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
        backgroundColor: 'white', // Ensure the shadow is visible by adding a background color
    },
    image: {
        width: '100%',
        height: '100%',
    },
});

export default AllBooks