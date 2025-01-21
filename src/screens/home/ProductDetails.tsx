import { View, Text, TouchableOpacity, ScrollView, FlatList, StyleSheet, ActivityIndicator, Dimensions, Share, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import CommonHeader from '../../component/CommonHeader';
import FastImage from 'react-native-fast-image';
import { BaseUrl } from '../../config/Key';
import { Colors } from '../../common/Colors';
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';
import Entypo from 'react-native-vector-icons/Entypo';
import * as _P_DETAIL_S from '../../services/ProductDetailService';
import { useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as _CART_SERVICE from '../../services/CartService';
import * as _WHISHLIST_SERVICE from '../../services/WishlistServices';
import { useDispatch } from 'react-redux';
import { isAddedToCart } from '../../redux/action/CartActions';
import { Utils } from '../../common/Utils';
import Description from '../../component/Description';
import RatingPage from '../../component/Rating';
import { Fonts } from '../../common/Fonts';
import CheckPinCode from '../../component/CheckPinCode';
import Carousel from 'react-native-reanimated-carousel';
import CustomStarRating from '../../component/CustomStarRating';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import { Linking } from 'react-native';

const screenWidth = Dimensions.get('window').width

const ProductDetails = (props: any) => {
    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const productID = props.route.params.productID;
    const { navigation } = props;
    const [headerId, setHeaderId] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [modalVisible, setModalVisible] = useState(false)
    const [productDetails, setProductDetails] = useState<any>();
    const [loader, setLoader] = useState(true);
    const [relatedProduct, setRelatedProduct] = useState([]);
    const [reviewData, setReviewData] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [isAddToCart, setIsAddTCart] = useState(false);
    const [topFromSellerData, setTopFromSellerData] = useState([]);
    const [isCardPress, setIsCardPress] = useState(false);
    const [cardId, setCardId] = useState<number>();
    const [btnLoader, setBtnLoader] = useState(false);
    const [otherSellers, setOtherSellers] = useState([]);
    const [totalAmount, setTotalAmount] = useState<any>();
    const [whishLoader, setWhishLoader] = useState(false);

    const [headerData, setHeaderData] = useState([
        { id: 0, title: 'DETAILS' },
        { id: 1, title: 'DESCRIPTION' },
        { id: 2, title: 'AUTHOR' },
        { id: 3, title: 'RATINGS & REVIEWS' }
    ]);


    useEffect(() => {
        getProductDetails();
    }, [isCardPress, cardId, isFocused])

    const getProductDetails = async () => {
        setLoader(true);
        try {
            let result: any = await _P_DETAIL_S.get_product_details(isCardPress ? cardId : productID, !isCardPress);
            const { status_code, data } = result;
            if (status_code === 200) {
                setProductDetails(data);
                setRelatedProduct(data?.related_products);
                setTotalAmount(data?.seller?.prices?.discounted_price)
                setReviewData(data?.reviews);
                setTopFromSellerData(data?.top_products_from_seller);
                setOtherSellers(data?.other_sellers);
                setLoader(false);
            }
        } catch (error) {
            console.log(error);

        }
    }

    const onHeaderPress = (item: any) => {
        setHeaderId(item.id);
    };

    const navigateToLogin = () => {
        props.navigation.replace('AuthStack', { screen: 'Login' })
    }

    function gramToKg(grams: any) {
        const kilograms = grams / 1000;
        return kilograms;
    }

    const addToCart = async (buyNow?: string) => {
        try {
            if (buyNow === 'BUY_NOW') {
                setBtnLoader(false)
            } else {
                setBtnLoader(true);
            }
            const token = await Utils.getData('_TOKEN');
            if (token) {
                if (gramToKg(productDetails?.weight) <= 10) {
                    setIsLoggedIn(true);
                    const dataToSend = { product_id: productDetails?.id, quantity: quantity }
                    let result: any = await _CART_SERVICE.add_to_cart(dataToSend);
                    if (result.status_code === 200) {
                        dispatch(isAddedToCart(true));
                        setBtnLoader(false);
                        if (buyNow === 'BUY_NOW') {
                            navigation.navigate('Cart');
                            setBtnLoader(false);
                        } else {
                            setIsAddTCart(true);
                            Alert.alert('Congratulations!!', 'Product Added to cart Successfully🎉', [
                                {
                                    text: 'Continue shopping',
                                    onPress: () => console.log('Cancel Pressed'),
                                    style: 'cancel',
                                },
                                {
                                    text: 'Go to cart',
                                    onPress: () => navigation.navigate('Cart'),
                                },
                            ]);
                            setBtnLoader(false);
                        }
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
                    Alert.alert('Alert dude !!', 'Product weight should be less than 10', [
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ]);
                    setBtnLoader(false);
                }
            } else {
                setIsLoggedIn(false);
                setBtnLoader(false);
            }

        } catch (error) {
            console.log((error));
        }
    }

    const add_whishlist = async () => {
        const token = await Utils.getData('_TOKEN');
        try {
            setWhishLoader(true);
            if (token) {
                setProductDetails((prevDetails: any) => ({
                    ...prevDetails,
                    added_in_wishlist: true
                }));

                const dataToSend = {
                    product_id: productDetails?.id,
                }
                setIsLoggedIn(true);
                const result: any = await _WHISHLIST_SERVICE.add_whishlist(dataToSend);
                const { status_code, message = "" } = result
                if (status_code === 201) {
                    Toast.show({
                        // text1: 'Success!',
                        text2: message,
                        type: 'success',
                        position: 'bottom',
                        text1Style: { fontSize: 16, fontFamily: Fonts.LexendBold, color: 'green' },
                        text2Style: { fontSize: 12, fontFamily: Fonts.LexendMedium, color: 'green' }
                    });
                } else {
                    setProductDetails((prevDetails: any) => ({
                        ...prevDetails,
                        added_in_wishlist: false
                    }));
                    Toast.show({
                        text1: 'Error!',
                        text2: message,
                        type: 'error',
                        position: 'bottom',
                        text1Style: { fontSize: 16, fontFamily: Fonts.LexendBold, color: 'red' },
                        text2Style: { fontSize: 12, fontFamily: Fonts.LexendMedium, color: 'red' }
                    });
                }
            } else {
                setIsLoggedIn(false);
            }
        } catch (error) {
            console.log(error);
            // Revert the optimistic update if there's an error
            setProductDetails((prevDetails: any) => ({
                ...prevDetails,
                added_in_wishlist: false
            }));
        } finally {
            setWhishLoader(false);
        }
    }


    const removeWhishlist = async (id: number) => {
        try {
            setWhishLoader(true);
            setProductDetails((prevDetails: any) => ({
                ...prevDetails,
                added_in_wishlist: false
            }));

            const result: any = await _WHISHLIST_SERVICE.remove_whishlist(id);
            const { status_code, message = "" } = result;
            if (status_code === 200) {
                Toast.show({
                    // text1: 'Success!',
                    text2: message,
                    type: 'success',
                    position: 'bottom',
                    text1Style: { fontSize: 16, fontFamily: Fonts.LexendBold, color: 'green' },
                    text2Style: { fontSize: 12, fontFamily: Fonts.LexendMedium, color: 'green' }
                });
            } else {
                setProductDetails((prevDetails: any) => ({
                    ...prevDetails,
                    added_in_wishlist: true
                }));
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
            setProductDetails((prevDetails: any) => ({
                ...prevDetails,
                added_in_wishlist: true
            }));
        } finally {
            setWhishLoader(false);
        }
    }

    const onImagePress = async () => {
        try {
            setModalVisible(true)
        } catch (error) {
            console.log(error);
        }
    }

    const renderHeader = ({ item, index }: { item: any, index: any }) => {
        return (
            <View className={`h-[29px] border-b-fieldGrayColor`}>
                <TouchableOpacity className={`flex flex-1 mx-3 h-[35px] ${item.id == headerId ? 'border-b-[3px]' : 'border-b-0'} rounded-b-sm border-b-orangeColor`} onPress={() => { onHeaderPress(item) }}>
                    <Text className={`${item.id == headerId ? 'text-textColor font-LexendMedium' : 'text-greyColor font-LexendRegular'} text-[13px] tracking-wide`}>{item.title}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const onPolicyClick = () => {
        navigation.navigate('ReplacementAndReturn');
    }

    const onPressSeller = (shop_id: number) => {
        const url = productDetails?.user?.shop_link
        const title = productDetails?.user?.shop_name;
        navigation.navigate('SellerDetails', { shop_id })
    }

    const CommonView = ({ title, subTitle, id }: { title: any, subTitle: any, id: any }) => {
        return (
            <View className='flex flex-row items-center mt-2'>
                <View className='w-1/4'>
                    <Text className='text-[14px] text-newTextColor font-Lexendlight'>{title}</Text>
                </View>
                <Text className='text-[14px] text-newTextColor font-Lexendlight'>:</Text>
                <View className='w-3/4'>
                    {
                        id === 9 ?
                            <TouchableOpacity className='w-full ml-5 flex-wrap' onPress={onPolicyClick}>
                                <Text className={`text-[14px] text-blue-600 font-LexendMedium underline`}>{subTitle}</Text>
                            </TouchableOpacity>
                            :
                            <Text onPress={() => { id === 1 ? onPressSeller(productDetails?.seller?.shop_id) : console.log("other id", id) }} className={`text-[14px] ${id == 9 ? 'text-blue-600 underline' : 'text-newTextColor'} font-LexendMedium ml-5`}>{id != 9 ? subTitle : null}</Text>
                    }
                </View>
            </View>
        )
    }
    const switchCase = () => {
        switch (headerId) {
            case 0:
                return (
                    <View className='flex px-4 mt-1'>
                        {/* <CommonView title={'Sold by'} subTitle={productDetails?.seller?.shop_name} id={1} /> */}
                        <CommonView title={'Edition'} subTitle={productDetails?.edition} id={2} />
                        <CommonView title={'Pages'} subTitle={productDetails?.pages} id={3} />
                        <CommonView title={'ISBN'} subTitle={productDetails?.isbn ? productDetails?.isbn : 'NA'} id={4} />
                        <CommonView title={'Binding'} subTitle={productDetails?.binding} id={5} />
                        <CommonView title={'Weight'} subTitle={productDetails?.weight} id={6} />
                        <CommonView title={'Author'} subTitle={productDetails?.author} id={7} />
                        <CommonView title={'Language'} subTitle={productDetails?.language} id={8} />
                        <CommonView title={'Return Policy'} subTitle={'Return policy'} id={9} />
                    </View>
                )
            case 1:
                return <Description navigation={props.navigation} description={productDetails?.description} />;
            case 2:
                return (
                    <View className='px-5 flex flex-row mt-1 items-center'>
                        <View className='flex justify-center items-center w-8 h-8 border border-borderColor rounded-full'>
                            <Ionicons name='pencil' size={18} color={Colors.newTextColor} />
                        </View>
                        <Text className='text-[14px] text-left text-newTextColor font-LexendMedium ml-4'>{productDetails?.author}</Text>
                    </View>
                )
            case 3:
                return <RatingPage navigation={props.navigation} reviewData={reviewData} productID={productDetails?.id} />;
            default:
                return null;
        }
    };

    const incrementQuantity = () => {
        setQuantity(prevQuantity => {
            const newQuantity = prevQuantity + 1;
            setTotalAmount(productDetails?.seller?.prices?.discounted_price * newQuantity);
            return newQuantity;
        });
    };

    const decrementQuantity = () => {
        setQuantity(prevQuantity => {
            if (prevQuantity > 1) {
                const newQuantity = prevQuantity - 1;
                setTotalAmount(productDetails?.seller?.prices?.discounted_price * newQuantity);
                return newQuantity;
            }
            return prevQuantity;
        });
    };

    const onProductCardPress = (id: number) => {
        setIsCardPress(true);
        setCardId(id);
    }

    const renderRelatedProduct = ({ item }: { item: any }) => {
        const { thumbnail, name, author, discounted_price, price, discount, rating, id } = item;
        return (
            <TouchableOpacity onPress={() => { onProductCardPress(id) }} className='flex mx-5 my-5 w-[140px]'>
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
                            ₹{discounted_price}
                        </Text>
                        <Text className='text-[12px] text-blackColor50 font-Lexendlight ml-1 line-through'>
                            {price}
                        </Text>
                        <Text className='text-[12px] text-onlineColor font-Lexendlight ml-1'>
                            (-{discount}%)
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    const viewPdf = async () => {
        try {
            const url = BaseUrl.base + "public/" + productDetails?.pdf;
            if (productDetails?.pdf) {
                Linking.openURL(url)
                // navigation.navigate('ViewPdf', { pdf_url: url })
            } else {
                Toast.show({
                    text1: 'Information!',
                    text2: "Pdf sample not available",
                    type: 'info',
                    position: 'bottom',
                    text1Style: { fontSize: 16, fontFamily: Fonts.LexendBold, color: 'blue' },
                    text2Style: { fontSize: 12, fontFamily: Fonts.LexendMedium, color: 'blue' }
                });
            }
        } catch (error) {
            console.log("VIEW PDF ERROR:", error);
        }
    }

    const SellerCard = ({ item }: { item: any }) => {
        return (
            <LinearGradient
                colors={['#fdffab', '#ffd3b6']}
                className='border border-borderColor rounded-lg px-4 mx-4 py-3 my-2'
                style={{ width: screenWidth <= 360 ? screenWidth - 50 : screenWidth - 50 }}
            >
                <Text className='text-newTextColor font-LexendMedium text-sm text-center'>
                    {item?.shop_name}
                </Text>
                <Text className='text-newTextColor font-Lexendregular text-xs text-center'>
                    {productDetails?.name}
                </Text>
                <View className='border-b border-borderColor border-dashed mt-5'></View>
                <View className='flex flex-row items-center justify-between  w-[100%] mt-2'>
                    <View className='flex flex-row items-center'>
                        <View className='flex flex-row justify-center items-center bg-[#240747] rounded-l-md px-1 h-10'>
                            <Text className={`${screenWidth <= 360 ? 'text-xs  font-LexendRegular' : 'text-sm font-LexendMedium'} text-white`}>
                                MRP ₹{item?.prices?.discounted_price}
                            </Text>
                            <Text className={`${screenWidth <= 360 ? 'text-xs  font-LexendRegular' : 'text-sm font-LexendMedium'} text-white line-through ml-1`}>
                                ₹{item?.prices?.selling_price}
                            </Text>
                        </View>

                        <View className={`flex flex-row justify-center items-center bg-green-700 rounded-r-md px-1 h-10`}>
                            <Text className='text-sm font-LexendMedium text-whiteColor mt-1 ml-1'>
                                {item?.prices?.discount ? `${item?.prices?.discount}% off` : null}
                            </Text>
                        </View>

                    </View>
                    <TouchableOpacity
                        onPress={() => { onProductCardPress(item?.product_id) }}
                        className='flex flex-row justify-center items-center bg-whiteColor rounded-md px-2 h-10  border border-borderColor'
                        style={{ marginLeft: screenWidth <= 360 ? 0 : 5 }}
                    >
                        <Text className='text-xs font-LexendMedium text-primaryColor mt-1 ml-1'>
                            View Product
                        </Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        )
    }

    const renderCarousel = ({ item }: { item: any }) => {
        return (
            <TouchableOpacity onPress={onImagePress} className="flex w-[250px] h-[250px] justify-center items-center">
                <FastImage
                    source={{ uri: BaseUrl.base + 'public/' + item }}
                    className="w-full h-full"
                    resizeMode="contain"
                />
            </TouchableOpacity>
        );
    };


    const onShare = async () => {
        const url = `https://clikshop.co.in/product/${productDetails?.id}`;
        try {
            const result = await Share.share({
                message: `Check out this product: ${productDetails?.name}. You can view it here: ${url}`,
                url: url, // This will help the app to handle the URL if it’s installed
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    console.log(result.activityType);
                } else {
                    console.log('Product shared successfully');
                }
            } else if (result.action === Share.dismissedAction) {
                console.log('Share dismissed');
            }
        } catch (error: any) {
            console.log('Error sharing product:', error.message);
        }
    };


    return (
        <View className="flex flex-1 bg-whiteColor">
            <CommonHeader title={'Book details'} navigation={props.navigation} isCartIcon={true} />
            <Modal
                isVisible={modalVisible}
                animationIn={'zoomIn'}
                animationInTiming={1}
                animationOutTiming={1}
                animationOut={'zoomOut'}

            >
                <View className='h-full w-full bg-transparent items-center justify-center'>
                    <View className='w-[100%] bg-bgGrayColor  rounded-[4px] px-4 py-4'>
                        <View className='flex-row w-full justify-between items-center'>
                            <Text className=' text-newTextColor text-[22px] font-LexendMedium'>
                                {'Image'}
                            </Text>
                            <TouchableOpacity accessible accessibilityLabel='Cancel button' className='justify-center items-center border-[1px] border-newTextColor w-[30px] h-[30px] rounded-[4px]' onPress={() => { setModalVisible(false) }} >
                                <Entypo name='cross' size={24} color={Colors.primaryColor} />
                            </TouchableOpacity>
                        </View>
                        <View className="flex w-full h-[500px] justify-center items-center mt-5">
                            <FastImage
                                source={{ uri: BaseUrl.base + 'public/' + productDetails?.thumbnail }}
                                className="w-full h-full"
                                resizeMode="contain"
                            />
                        </View>
                    </View>
                </View>
            </Modal>
            {
                loader ?
                    <View className='flex flex-1 justify-center items-center'>
                        <ActivityIndicator size={'large'} color={Colors.primaryColor} />
                    </View>
                    :
                    <>
                        <ScrollView>
                            <View className="mt-3 flex flex-auto px-5">
                                <View className='flex justify-center items-center relative'>
                                    <View style={styles.carouselContainer}>
                                        <Carousel
                                            data={productDetails?.photos}
                                            renderItem={renderCarousel}
                                            width={250}
                                            autoPlay={true}
                                            loop={productDetails?.photos?.length > 1}
                                            autoPlayInterval={1000}
                                            panGestureHandlerProps={{
                                                activeOffsetX: [-10, 10],
                                            }}
                                        />
                                    </View>

                                    <TouchableOpacity disabled={whishLoader} onPress={() => { productDetails?.added_in_wishlist === true ? removeWhishlist(productDetails?.id) : add_whishlist() }} className='absolute right-1 top-5 flex justify-center items-center border-[1px] border-borderColor rounded-full w-10 h-10'>
                                        {
                                            productDetails?.added_in_wishlist ?
                                                <Octicons name='heart-fill' size={20} color={Colors.primaryColor} />
                                                :
                                                <Octicons name='heart' size={20} color={Colors.primaryColor} />
                                        }
                                    </TouchableOpacity>
                                    {/* <TouchableOpacity onPress={onShare} className='absolute right-1 top-16 flex justify-center items-center border-[1px] border-borderColor rounded-full w-10 h-10'>
                                        <FontAwesome name='share' size={16} color={Colors.primaryColor} />
                                    </TouchableOpacity> */}
                                </View>
                                <View className="mt-3">
                                    <Text className="text-textColor text-base tracking-wider font-serif font-LexendMedium">{productDetails?.name}</Text>
                                </View>
                                <View className="mt-3 flex flex-row items-center">
                                    <View className='flex justify-center items-center px-3 py-2 border-[1px] border-borderColor rounded-[10px]'>
                                        <Text className="text-primaryColor text-[14px] font-LexendRegular">{productDetails?.language}</Text>
                                    </View>
                                    <View className='flex flex-row ml-2'>
                                        {/* <Text className="text-textColor text-[16px] ml-2">{productDetails?.rating}</Text> */}
                                        <CustomStarRating
                                            rating={productDetails?.rating}
                                            maxRating={5}
                                            starSize={20}
                                        />
                                    </View>
                                </View>
                                <View className='mt-3'>
                                    <LinearGradient
                                        colors={['#ececec', '#ececec']}
                                        className={`px-3 py-3 w-full bg-pink-200 mt-2 border border-borderColor rounded-md flex  justify-center items-center`}>
                                        <Text className='text-base text-blue-400 font-LexendMedium text-center'>{'Sold By : '}</Text>
                                        <View className=''>
                                            <Text className='text-base text-black font-LexendMedium'>{productDetails?.seller?.shop_name}</Text>
                                        </View>
                                        <View>
                                            <Text onPress={() => { onPressSeller(productDetails?.seller?.shop_id) }} className='text-base text-black underline font-LexendMedium'>{'View Shop'}</Text>
                                        </View>
                                    </LinearGradient>
                                </View>
                                <View className="border-[0.3px] border-greyColor w-full mt-3"></View>
                            </View>
                            <View className="mt-5 pb-3">
                                <FlatList
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    data={headerData}
                                    renderItem={renderHeader}
                                    keyExtractor={(item: any) => item.id.toString()}
                                />
                                {switchCase()}
                            </View>

                            <View className='flex flex-row justify-between w-full px-5'>
                                <TouchableOpacity className={`px-3 py-2 rounded-md ${productDetails?.current_stock > 0 ? 'bg-green-600' : 'bg-red-600'}`}>
                                    <Text className='text-sm text-whiteColor font-LexendMedium'>{productDetails?.current_stock > 0 ? 'In Stock' : 'Out of Stock'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={viewPdf} className={`px-3 py-2 bg-yellow-500 border border-borderColor rounded-md`}>
                                    <Text className='text-sm text-whiteColor font-LexendMedium'>{'View Sample'}</Text>
                                </TouchableOpacity>
                            </View>

                            {
                                otherSellers?.length > 0 && (
                                    <View className='my-2 flex justify-center items-center'>
                                        <View className='px-4 my-3'>
                                            <Text className='text-[20px] font-LexendMedium text-newTextColor underline text-center'>Other sellers</Text>
                                        </View>
                                        <FlatList
                                            data={otherSellers}
                                            renderItem={SellerCard}
                                            keyExtractor={(item: any) => item?.shop_id?.toString()}
                                            // horizontal
                                            // showsHorizontalScrollIndicator={false}
                                            contentContainerStyle={styles.listContainer}
                                        />
                                    </View>
                                )
                            }

                            <CheckPinCode totalAmt={totalAmount} paddinHorizonatl={20} totalWeight={productDetails?.weight * quantity} />
                            {topFromSellerData?.length !== 0 && (
                                <View className="flex justify-center items-center pb-3 mt-7">
                                    <View className='px-6 '>
                                        <Text className='text-[18px] border-b-2 border-red-700 text-newTextColor font-LexendMedium'>Top Product from the seller:</Text>
                                    </View>
                                    <FlatList
                                        horizontal
                                        data={topFromSellerData}
                                        renderItem={renderRelatedProduct}
                                        keyExtractor={(item: any, index: any) => index.toString()}
                                    />
                                </View>)
                            }
                            {relatedProduct?.length && (
                                <View className="flex justify-center items-center pb-3 mt-7">
                                    <View className='px-6 '>
                                        <Text className='text-[18px] border-b-2 border-red-700 text-newTextColor font-LexendMedium'>Related Products:</Text>
                                    </View>
                                    <FlatList
                                        horizontal
                                        data={relatedProduct}
                                        renderItem={renderRelatedProduct}
                                        keyExtractor={(item: any, index: any) => index.toString()}
                                    />
                                </View>)
                            }
                        </ScrollView>
                        <View className="flex px-5 border-[1px] border-borderColor bg-bgcolor" style={{ elevation: 3 }}>
                            <View className="flex flex-row justify-between items-center mt-3">
                                <View className="flex items-center flex-row">
                                    <Text className="text-textColor text-[22px] font-LexendMedium">{`₹${totalAmount?.toFixed(2)}`}</Text>
                                    <Text className="text-greyColor text-[12px] ml-1 mt-[5px] line-through font-LexendRegular">{`₹${productDetails?.seller?.prices?.selling_price}`}</Text>
                                    <Text className="text-errorColor text-[12px] font-Lexendlight ml-1 mt-[5px]">{`(${parseInt(productDetails?.seller?.prices?.discount)}%)`}</Text>
                                </View>
                                <View className="flex flex-row items-center">
                                    <TouchableOpacity onPress={decrementQuantity} className="px-2 py-1 border border-gray-300 rounded">
                                        <Text className="text-textColor font-LexendMedium">-</Text>
                                    </TouchableOpacity>
                                    <Text className="px-3 font-LexendMedium text-primaryColor">{quantity}</Text>
                                    <TouchableOpacity onPress={incrementQuantity} className="px-2 py-1 border border-gray-300 rounded">
                                        <Text className="text-textColor font-LexendMedium">+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {
                                !isLoggedIn && (
                                    <View>
                                        <Text className='text-sm text-center text-red-500 font-LexendRegular'>You are not logged in, Please log in or Register New Account</Text>
                                        <Text onPress={navigateToLogin} className='text-sm text-center text-blue-500 font-LexendRegular'>Please Register Here</Text>
                                    </View>
                                )
                            }
                            <View className="flex flex-row justify-between items-center my-3">
                                <TouchableOpacity onPress={() => addToCart('BUY_NOW')} activeOpacity={0.5} className="border-[1px] px-2 w-[47%] h-[45px] bg-whiteColor rounded-lg justify-center items-center">
                                    <Text className="text-textColor text-[16px] tracking-wider leading-4 font-semibold">Buy now</Text>
                                </TouchableOpacity>
                                {
                                    btnLoader ?
                                        <View className='w-[47%] flex justify-center items-center'>
                                            <ActivityIndicator size={'small'} color={Colors.primaryColor} />
                                        </View>
                                        :
                                        <TouchableOpacity onPress={() => addToCart()} activeOpacity={0.5} className="px-2 h-[45px] bg-orangeColor w-[47%] rounded-lg justify-center items-center">
                                            <Text className="text-whiteColor text-[16px] tracking-wider leading-4 font-semibold">Add to cart</Text>
                                        </TouchableOpacity>
                                }
                            </View>
                        </View>
                    </>
            }

        </View >
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
    successTextStyle: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
        padding: 30,
    },
    buttonStyle: {
        backgroundColor: '#000080',
        borderWidth: 0,
        color: '#FFFFFF',
        borderColor: '#000080',
        height: 50,
        alignItems: 'center',
        borderRadius: 30,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 20,
        marginBottom: 20,
        justifyContent: 'center',
    },
    buttonTextStyle: {
        color: '#FFFFFF',
        paddingVertical: 10,
        fontSize: 16,
        fontFamily: Fonts.LexendMedium
    },
    carouselContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 220,
    },
    listContainer: {
        paddingHorizontal: 10,
    },
    card: {
        width: 250,
        marginRight: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 1,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    booksCount: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    rating: {
        fontSize: 14,
        color: '#f39c12',
    },
});

export default ProductDetails;
