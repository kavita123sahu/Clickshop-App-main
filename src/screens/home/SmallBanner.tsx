import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import * as _HPS_ from '../../services/HomeServices';
import FastImage from 'react-native-fast-image';
import { BaseUrl } from '../../config/Key';

interface BannerItem {
    photo: string;
    url: string;
    position: number;
    banner_id: number
}

interface SmallBannerProps {
    navigation: any;
    position: number;
    margin?: number;
}

const SmallBanner: React.FC<SmallBannerProps> = ({ navigation, position, margin = 0 }) => {
    const isFocused = useIsFocused();
    const [bannerMainData, setBannerMainData] = useState<BannerItem[]>([]);

    useEffect(() => {
        getBannerData();
    }, [isFocused]);

    const getBannerData = async () => {
        try {
            const response: any = await _HPS_.small_banner_data();
            if (response.status_code === 200) {
                const filteredData = response.data.filter((item: BannerItem) => item.position === position);
                setBannerMainData(filteredData);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const onBannerPress = (link: string, categoryDetail: any) => {
        // const product_id = link.split('=')[1]
        // const endPointKey = link.split('?')[1].split('=')[0];
        // let endPoint: string = '';
        // if (endPointKey === 'subcategory') {
        //     endPoint = "sub-category";
        // } else if (endPointKey === 'subsubcategory') {
        //     endPoint = 'sub-sub-category'
        // } else if (endPointKey === 'sub3category') {
        //     endPoint = 'sub-3-category'
        // } else if (endPointKey === 'sub4category') {
        //     endPoint = 'sub-4-category'
        // } else if (endPointKey === 'sub5category') {
        //     endPoint = 'sub-5-category'
        // }
        // const link_to_send = `https://clikshop.co.in/api/v1/products/${endPoint}/${product_id}`
        const link_to_send2 = `https://clikshop.co.in/api/v3/products?${categoryDetail.type}=${categoryDetail.id}`
        navigation.navigate('AllBooks', { link: link_to_send2 });
    };

    const renderBannerData = ({ item }: { item: any }) => {
        return (
            <TouchableOpacity style={styles.bannerContainer} onPress={() => onBannerPress(item.url, item.category_detail)}>
                <FastImage
                    style={styles.bannerImage}
                    resizeMode='stretch'
                    source={{ uri: BaseUrl.base + "public/" + item.banner }}
                />
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { marginTop: margin }]}>
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={bannerMainData}
                renderItem={renderBannerData}
                keyExtractor={(item: any) => item?.id.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bannerContainer: {
        width: 300,
        height: 180,
        borderRadius: 8,
        marginHorizontal: 4,
        marginVertical: 4,
    },
    bannerImage: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
});

export default SmallBanner;
