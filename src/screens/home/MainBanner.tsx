import { View, Dimensions, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useIsFocused } from '@react-navigation/native';
import * as _HPS_ from '../../services/HomeServices';
import { Colors } from '../../common/Colors';
import FastImage from 'react-native-fast-image';
import { BaseUrl } from '../../config/Key';
import Toast from 'react-native-toast-message';
import { Fonts } from '../../common/Fonts';

const screenWidth = Dimensions.get('screen').width;
const BANNER_HEIGHT = 150;

interface BannerItem {
    photo: string;
    link: string;
    category_detail: any;
}

interface MainBannerProps {
    navigation: any;
}

const MainBanner: React.FC<MainBannerProps> = ({ navigation }) => {
    const isFocused = useIsFocused();
    const [BannerMainData, setBannerMainData] = useState<BannerItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const flatListRef = useRef<FlatList>(null);
    const autoScrollInterval = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isFocused) {
            getBannerData();
            startAutoScroll();
        }
        return () => {
            stopAutoScroll();
        };
    }, [isFocused]);

    const getBannerData = async () => {
        try {
            const response: any = await _HPS_.slidders();
            const { status_code, data, message = "" } = response;
            if (status_code === 200) {
                setBannerMainData(data);
            } else {
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
        }
    };

    const onBannerPress = (link: string, categoryDetail: any) => {
        const product_id = link.split('=')[1];
        const endPointKey = link.split('?')[1].split('=')[0];
        let endPoint: string = '';
        switch (endPointKey) {
            case 'subcategory':
                endPoint = "sub-category";
                break;
            case 'subsubcategory':
                endPoint = 'sub-sub-category';
                break;
            case 'sub3category':
                endPoint = 'sub-3-category';
                break;
            case 'sub4category':
                endPoint = 'sub-4-category';
                break;
            case 'sub5category':
                endPoint = 'sub-5-category';
                break;
        }
        const link_to_send = `https://clikshop.co.in/api/v1/products/${endPoint}/${product_id}`;
        const link_to_send2 = `https://clikshop.co.in/api/v3/products?${categoryDetail.type}=${categoryDetail.id}`;
        navigation.navigate('AllBooks', { link: link_to_send2 });
    };

    const renderCarouselItem = ({ item }: { item: BannerItem }) => {
        return (
            <TouchableOpacity style={styles.imageContainer} onPress={() => onBannerPress(item.link, item.category_detail)}>
                <FastImage
                    source={{ uri: BaseUrl.base + 'public/' + item.photo }}
                    resizeMode={'contain'}
                    style={styles.image}
                />
            </TouchableOpacity>
        );
    };

    const renderPaginationDots = () => {
        return (
            <View style={styles.paginationContainer}>
                {BannerMainData.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.paginationDot,
                            index === currentIndex
                                ? styles.paginationActiveDot
                                : styles.paginationInactiveDot,
                        ]}
                    />
                ))}
            </View>
        );
    };

    const onScrollEnd = (event: any) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / screenWidth);
        setCurrentIndex(index);
    };

    const startAutoScroll = () => {
        if (BannerMainData.length > 1) {
            autoScrollInterval.current = setInterval(() => {
                setCurrentIndex((prevIndex) => {
                    const nextIndex = prevIndex === BannerMainData.length - 1 ? 0 : prevIndex + 1;
                    flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
                    return nextIndex;
                });
            }, 1500);
        }
    };

    const stopAutoScroll = () => {
        if (autoScrollInterval.current) {
            clearInterval(autoScrollInterval.current);
            autoScrollInterval.current = null;
        }
    };

    return (
        <View style={styles.carouselContainer}>
            <FlatList
                ref={flatListRef}
                data={BannerMainData}
                renderItem={renderCarouselItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, index) => index.toString()}
                onMomentumScrollEnd={onScrollEnd}
                scrollEventThrottle={16}
            />
            {renderPaginationDots()}
        </View>
    );
};

const styles = StyleSheet.create({
    carouselContainer: {
        height: BANNER_HEIGHT,
        width: screenWidth,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        width: screenWidth,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 150,
    },
    paginationContainer: {
        position: 'absolute',
        bottom: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 3,
    },
    paginationActiveDot: {
        backgroundColor: Colors.primaryColor,
    },
    paginationInactiveDot: {
        backgroundColor: Colors.bgGrayColor,
    },
});

export default MainBanner;
