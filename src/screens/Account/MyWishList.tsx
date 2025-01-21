import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import { Colors } from '../../common/Colors';
import * as _WHISHLIST_SERVICE from '../../services/WishlistServices';
import { useIsFocused } from '@react-navigation/native';
import CommonHeader from '../../component/CommonHeader';
import { BaseUrl } from '../../config/Key';
import { Utils } from '../../common/Utils';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Fonts } from '../../common/Fonts';
import * as _CART_SERVICE from '../../services/CartService';
import { useDispatch } from 'react-redux';
import { isAddedToCart } from '../../redux/action/CartActions';
import Toast from 'react-native-toast-message';
import LottieView from 'lottie-react-native';
import { get } from 'lodash';


const MyWishList = (props: any) => {
    const screenWidth = Dimensions.get('window').width;
    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const { navigation } = props;
    const [whislistData, setWhishlistData] = useState<any>([]);
    const [loader, setLoader] = useState(true);
    const [isRemoved, setIsRemoved] = useState(false);
    const [itemId, setItemId] = useState(Number);
    const [isToken, setIsToken] = useState(true);
    const [btnLoader, setBtnLoader] = useState(false);
    const [removeLoader, setRemoveLoader] = useState(false);

    useEffect(() => {
        getWhishlistData();
    }, [isFocused])
    const getWhishlistData = async () => {
        setLoader(true);
        try {
            const token = await Utils.getData('_TOKEN');
            if (token) {
                setIsToken(true);
                const result: any = await _WHISHLIST_SERVICE.get_all_whishlist();
                const { status_code, data } = result;
                if (status_code === 200) {
                    setWhishlistData(data);
                    setLoader(false);
                } else {
                    setLoader(false);
                }
            } else {
                setLoader(false);
                setIsToken(false);
            }
        } catch (error) {
            console.log(error);
            setLoader(false);
        }
    }

    const onCardPress = (id: any) => {
        props.navigation.navigate('ProductDetails', { productID: id })
    }
    const onClickRegister = () => {
        props.navigation.replace('AuthStack', { screen: 'Login' })
    }

    const removeWhishlist = async (id: number) => {
        setIsRemoved(true);
        setItemId(id);
        setRemoveLoader(true);
        try {
            const result: any = await _WHISHLIST_SERVICE.remove_whishlist(id);
            const { status_code, message = "" } = result;
            if (status_code === 200) {
                setIsRemoved(true);
                setIsRemoved(false);
                Toast.show({
                    // text1: 'Success!',
                    text2: message,
                    type: 'success',
                    position: 'bottom',
                    text1Style: { fontSize: 16, fontFamily: Fonts.LexendBold, color: 'green' },
                    text2Style: { fontSize: 12, fontFamily: Fonts.LexendMedium, color: 'green' }
                });
                getWhishlistData();
            } else {
                setRemoveLoader(false);
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
    }


    const addToCart = async (id: any) => {
        try {
            setBtnLoader(true);
            setItemId(id);
            const token = await Utils.getData('_TOKEN');
            if (token) {
                const dataToSend = { product_id: id, quantity: 1 }
                let result: any = await _CART_SERVICE.add_to_cart(dataToSend);
                if (result.status_code === 200) {
                    dispatch(isAddedToCart(true));
                    getWhishlistData();
                    setBtnLoader(false);
                    Toast.show({
                        text1: 'Success!',
                        text2: result.message,
                        type: 'success',
                        position: 'bottom',
                        text1Style: { fontSize: 16, fontFamily: Fonts.LexendBold, color: 'green' },
                        text2Style: { fontSize: 12, fontFamily: Fonts.LexendMedium, color: 'green' }
                    });
                } else {
                    Toast.show({
                        text1: 'Error!',
                        text2: result?.message,
                        type: 'error',
                        position: 'bottom',
                        text1Style: { fontSize: 16, fontFamily: Fonts.LexendBold, color: 'red' },
                        text2Style: { fontSize: 12, fontFamily: Fonts.LexendMedium, color: 'red' }
                    });
                    setBtnLoader(false);
                }
            } else {
                setBtnLoader(false);
            }

        } catch (error) {
            console.log((error));
        }
    };

    const renderWishlistItem = ({ item }: { item: any }) => {

        let { product, product_id, id } = item;

        return (
            <TouchableOpacity onPress={() => onCardPress(product_id)} style={styles.wishlistItem}>
                <Image source={{ uri: BaseUrl.base + 'public/' + product?.thumbnail_img }} style={styles.coverImage} />
                <View style={styles.itemInfo}>
                    <Text numberOfLines={1} style={styles.bookTitle}>{product?.name}</Text>
                    <Text style={styles.bookAuthor}>{product?.author}</Text>
                    <View className='flex flex-row items-center'>
                        <Text className='font-LexendRegular text-sm text-newTextColor'>₹{product?.discounted_price?.toFixed(2)}</Text>
                        <Text className='font-LexendRegular text-xs text-gray-400 ml-1 line-through'>₹{product?.unit_price}</Text>
                        <Text className='font-LexendRegular text-xs text-green-500  ml-1'>{product?.discount}%</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={() => removeWhishlist(product_id)} style={styles.removeButton}>
                            <Text style={styles.removeButtonText}>{removeLoader && (itemId === item.id) ? 'Removing...' : 'Remove'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => addToCart(product_id)} style={styles.addToCartButton}>
                            <Text style={styles.addToCartButtonText}>{btnLoader && (itemId === item.product_id) ? 'Adding...' : 'Add to Cart'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    const emptyList = () => {
        return (
            <View>
                <Text>No book in your whishlist as of now</Text>
            </View>
        )
    }
    return (
        <SafeAreaView style={styles.container}>
            <CommonHeader title='My Wishlist' navigation={navigation} isCartIcon={true} />

            {
                !isToken ?
                    <View className='flex flex-1 justify-center items-center'>
                        <Text className='text-base text-left text-newTextColor font-LexendRegular'>Please login to see your Whishlist</Text>
                        <Text onPress={onClickRegister} className='text-blue-300 text-center font-LexendMedium text-base'>{"Click here to login"}</Text>
                    </View>
                    :
                    loader ?
                        <View className='flex-1 justify-center items-center'>
                            <ActivityIndicator size={'large'} color={Colors.primaryColor} />
                        </View>
                        :
                        whislistData.length > 0 ? (
                            <FlatList
                                data={whislistData}
                                renderItem={renderWishlistItem}
                                keyExtractor={item => item.id}
                                contentContainerStyle={styles.wishlistContainer}
                            />
                        ) : (
                            <View style={[styles.emptyWishlist, { marginBottom: '20%' }]}>
                                <LottieView
                                    source={require('../../assets/animations/empty-whishlist.json')}
                                    autoPlay
                                    loop
                                    style={{ width: screenWidth <= 360 ? 200 : 400, height: screenWidth <= 360 ? 200 : 400 }}
                                />
                                <Text style={styles.emptyWishlistText}>Your wishlist is empty</Text>
                                <TouchableOpacity onPress={() => navigation.replace('HomeStack', { screen: 'TabStack' })} style={styles.browseButton}>
                                    <Text style={styles.browseButtonText}>Browse Books</Text>
                                </TouchableOpacity>
                            </View>
                        )}
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    wishlistContainer: {
        padding: 16,
    },
    wishlistItem: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        borderWidth: 1,
        borderColor: Colors.borderColor
    },
    coverImage: {
        width: 80,
        height: 120,
        borderRadius: 4,
    },
    itemInfo: {
        flex: 1,
        marginLeft: 16,
    },
    bookTitle: {
        fontSize: 18,
        fontFamily: Fonts.LexendMedium,
        color: Colors.newTextColor,
        marginBottom: 4,
    },
    bookAuthor: {
        fontSize: 14,
        fontFamily: Fonts.LexendRegular,
        color: Colors.placeholderColor,
        marginBottom: 4,
    },
    bookPrice: {
        fontSize: 16,
        fontFamily: Fonts.LexendMedium,
        color: Colors.black,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 8,
        marginTop: 10
    },
    removeButton: {
        backgroundColor: Colors.primaryColor,
        padding: 8,
        borderRadius: 4,
        alignItems: 'center',

    },
    removeButtonText: {
        color: 'white',
        fontFamily: Fonts.LexendMedium,
        fontSize: 12,
    },
    addToCartButton: {
        backgroundColor: Colors.primaryColor,
        padding: 8,
        borderRadius: 4,
        alignItems: 'center',
    },
    addToCartButtonText: {
        color: 'white',
        fontFamily: Fonts.LexendMedium,
        fontSize: 12,
    },
    emptyWishlist: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyWishlistText: {
        fontSize: 18,
        fontFamily: Fonts.LexendMedium,
        color: Colors.placeholderColor,
        marginBottom: 16,
    },
    browseButton: {
        backgroundColor: Colors.primaryColor,
        padding: 12,
        borderRadius: 4,
    },
    browseButtonText: {
        color: 'white',
        fontFamily: Fonts.LexendMedium,
        fontSize: 16,
    },
});

export default MyWishList;
