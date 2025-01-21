import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import CommonHeader from '../../component/CommonHeader';
import FastImage from 'react-native-fast-image';
import { Colors } from '../../common/Colors';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as _CART_SERVICE from '../../services/CartService';
import * as _ADDRESS_SERVICES from '../../services/AddressServices';
import { useIsFocused } from '@react-navigation/native';
import { Item } from 'react-native-paper/lib/typescript/components/Drawer/Drawer';
import { BaseUrl } from '../../config/Key';
import { useDispatch } from 'react-redux';
import { isRemovedFromCart, removeFromCart } from '../../redux/action/CartActions';
import Modal from 'react-native-modal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Addresses from '../../component/Addresses';
import CheckPinCode from '../../component/CheckPinCode';
import { Checkbox } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { Fonts } from '../../common/Fonts';
import LottieView from 'lottie-react-native';
import { Drawer } from 'react-native-drawer-layout';

const screenWidth = Dimensions.get('window').width;

const Cart = (props: any) => {
    const isFocused = useIsFocused();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const dispatch = useDispatch();
    const [cartItems, setCartItems] = useState<any>();
    const [loader, setLoader] = useState(true);
    const [defaultAddress, setDefaultAddress] = useState<any>();
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [totalPrice, setTotalPrice] = useState<any>();
    const [totalDiscount, setTotalDiscount] = useState<any>();
    const [shippingData, setShippingData] = useState<any>([]);
    const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);
    const [shippingCharge, setShippingCharge] = useState<number>();
    const [deliveryNote, setDeliveryNote] = useState("");
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
    const [addressData, setAddressData] = useState<any>([]);
    const [codAvilable, setCodAvailable] = useState(true);

    useEffect(() => {
        getAddress();
    }, [isFocused])


    const getAddress = async () => {
        try {
            const result: any = await _ADDRESS_SERVICES.getAddress();
            const { status_code, message = "", data } = result;
            if (status_code === 200) {
                const d = data?.filter((i: any) => i.set_default === 1);
                setAddressData(data);
                if (data?.length === 1) {
                    setDefaultAddress(data);
                    getCartLists(data[0]?.postal_code);
                } else {
                    setDefaultAddress(d);
                    if (d.length > 0) {
                        getCartLists(d[0]?.postal_code);
                    } else {
                        getCartLists();
                    }
                }
                setModalVisible(false);
            } else {
                getCartLists();
            }
        } catch (error) {
            console.log("ADDRESS ERROR888:", error);
        }
    }

    const getCartLists = async (postalCode?: any) => {
        setLoader(true);
        try {
            const result: any = await _CART_SERVICE.get_cart_list(postalCode);
            const { data, message = "", status_code } = result;
            setCartItems(data);
            setTotalDiscount(data?.total_discount);
            setTotalPrice(data?.total_price);
            setShippingData(data?.shipping_options);
            setLoader(false);
        } catch (error) {
            console.log("FETCHING CART LIST ERROR:", error);
            setLoader(false);
        }
    }

    const updateCartItemQuantity = (id: string, newQuantity: number) => {
        setCartItems((prevItems: any) => ({
            ...prevItems,
            cart_items: prevItems.cart_items.map((item: any) =>
                item.product.id === id ? { ...item, quantity: newQuantity } : item
            )
        }));

        const updatedItems = cartItems.cart_items.map((item: any) =>
            item.product.id === id ? { ...item, quantity: newQuantity } : item
        );
        const newTotalPrice = updatedItems.reduce((sum: number, item: any) => sum + (item.discounted_price * item.quantity), 0);
        const newTotalDiscount = updatedItems.reduce((sum: number, item: any) => sum + ((item.price - item.discounted_price) * item.quantity), 0);

        setTotalPrice(newTotalPrice);
        setTotalDiscount(newTotalDiscount);
    };

    const increaseQuantity = async (id: string, currentQuantity: number) => {
        const newQuantity = currentQuantity + 1;
        updateCartItemQuantity(id, newQuantity);

        try {
            const dataToSend = { quantity: newQuantity };
            const result: any = await _CART_SERVICE.update_quantity(id, dataToSend);
            if (result.status_code !== 200) {
                updateCartItemQuantity(id, currentQuantity);
                Toast.show({
                    text1: 'Error!',
                    text2: result?.message,
                    type: 'error',
                    position: 'bottom',
                    text1Style: { fontSize: 16, fontFamily: Fonts.LexendBold, color: 'red' },
                    text2Style: { fontSize: 12, fontFamily: Fonts.LexendMedium, color: 'red' }
                });
            }
        } catch (error) {
            console.log("UPDATE CART ERROR:", error);
            updateCartItemQuantity(id, currentQuantity);
        }
    };

    const decreaseQuantity = async (id: string, currentQuantity: number) => {
        if (currentQuantity > 1) {
            const newQuantity = currentQuantity - 1;
            updateCartItemQuantity(id, newQuantity);

            try {
                const dataToSend = { quantity: newQuantity };
                const result: any = await _CART_SERVICE.update_quantity(id, dataToSend);
                if (result.status_code !== 200) {
                    updateCartItemQuantity(id, currentQuantity);
                    Toast.show({
                        text1: 'Error!',
                        text2: result?.message,
                        type: 'error',
                        position: 'bottom',
                        text1Style: { fontSize: 16, fontFamily: Fonts.LexendBold, color: 'red' },
                        text2Style: { fontSize: 12, fontFamily: Fonts.LexendMedium, color: 'red' }
                    });
                }
            } catch (error) {
                console.log("UPDATE CART ERROR:", error);
                updateCartItemQuantity(id, currentQuantity);
            }
        }
    };

    const removeItem = async (id: any) => {
        try {
            const result: any = await _CART_SERVICE.remove_from_cart(id);
            const { status_code, message = "", data } = result;
            if (status_code === 200) {
                dispatch(isRemovedFromCart(true));
                dispatch(removeFromCart(id));
                Toast.show({
                    // text1: 'Success!',
                    text2: message,
                    type: 'success',
                    position: 'bottom',
                    text1Style: { fontSize: 16, fontFamily: Fonts.LexendBold, color: 'green' },
                    text2Style: { fontSize: 12, fontFamily: Fonts.LexendMedium, color: 'green' }
                });
                getCartLists(defaultAddress[0]?.postal_code);
                setShippingCharge(0);
                setSelectedDelivery(null);
            } else {

            }

        } catch (error) {
            console.log("CART REMOVE ERROR:", error);
        }
    };

    const onProceedPayment = () => {
        props.navigation.navigate('PaymentOptions', {
            delivery_type: selectedDelivery,
            shippingCharge: shippingCharge,
            deliveryNote: deliveryNote,
            codAvilable: codAvilable
        });
    }
    const onShopping = () => {
        props.navigation.navigate('TabStack')
    }

    const onCardPress = (id: any) => {
        props.navigation.navigate('ProductDetails', { productID: id })
    }

    const renderCartItem = ({ item }: { item: any }) => {
        const { name = "", thumbnail_img = null, rating = 0, author, id } = item.product;

        return (
            <TouchableOpacity activeOpacity={0.7} onPress={() => onCardPress(id)} style={styles.cartItem} className='relative'>
                <View className='w-[120px] h-full flex justify-center items-center rounded-tl-[10px] rounded-bl-[10px]'>
                    <FastImage source={{ uri: BaseUrl.base + 'public/' + thumbnail_img }} className='w-full h-full rounded-tl-[10px] rounded-bl-[10px]' resizeMode='stretch' />
                </View>
                <View style={styles.bookDetails}>
                    <Text numberOfLines={1} className='font-LexendMedium text-[16px] text-newTextColor w-[88%]'>{name}</Text>
                    <Text numberOfLines={1} className='font-LexendRegular text-[14px] text-newTextColor mt-1'>{author}</Text>
                    <View className='flex flex-row items-center'>
                        <Text className='font-LexendRegular text-sm text-newTextColor'>₹{item.discounted_price.toFixed(2)}</Text>
                        <Text className='font-LexendRegular text-xs text-gray-400 ml-1 line-through'>₹{item.price?.toFixed(2)}</Text>
                        {/* <Text className='font-LexendRegular text-xs text-green-500  ml-1'>{item.discount?.toFixed(2)}%</Text> */}
                    </View>
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity onPress={() => decreaseQuantity(id, item.quantity)} style={[styles.quantityButton, { marginRight: 8 }]}>
                            <Text className='text-blackColor'>-</Text>
                        </TouchableOpacity>
                        <Text className='text-blackColor'>{item?.quantity}</Text>
                        <TouchableOpacity onPress={() => increaseQuantity(id, item.quantity)} style={[styles.quantityButton, { marginLeft: 8 }]}>
                            <Text className='text-blackColor'>+</Text>
                        </TouchableOpacity>
                    </View>
                    {/* <View className='mt-3 flex flex-row'>
                        <Text className='font-LexendMedium text-[12px] text-newTextColor'>Shipping charges </Text>
                        <Text className='font-LexendMedium text-[12px] text-onlineColor'>{'free'}</Text>
                    </View>
                    <View className='mt-1 flex flex-row'>
                        <Text className='font-LexendMedium text-[11px] text-newTextColor'>Estimated delivery date : </Text>
                        <Text className='font-LexendMedium text-[11px] text-onlineColor'>{'16-07-2024'}</Text>
                    </View> */}
                </View>
                <TouchableOpacity onPress={() => removeItem(id)} className='w-6 h-6 flex justify-center items-center absolute top-2 right-2 rounded-full border-[1px] border-borderColor'>
                    <Entypo name='cross' size={16} color={Colors.newTextColor} />
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }

    const renderCommonView = (title: String, value: String, discount: any = null) => {
        return (
            <View className='flex flex-row justify-between items-center mt-3 my-2' >
                <View>
                    <Text className='text-[13px] text-newTextColor font-LexendRegular tracking-wide'>{title}</Text>
                    {/* <Text className='text-[13px] text-newTextColor font-LexendRegular tracking-wide'>{discount}</Text> */}
                </View>
                <View className=''>
                    <Text className='text-[13px] text-newTextColor font-LexendBold tracking-wide'> {value === 'free' ? '' : '₹' + value}</Text>
                </View>
            </View >
        )
    }

    const footerComponent = ({ data }: { data: any }) => {
        return (
            <SafeAreaView className=''>
                {/* <TouchableOpacity onPress={() => { props.navigation.navigate('Coupons') }} className='w-full h-12 border-[1px] border-dashed border-borderColor flex justify-between items-center flex-row px-3 mt-5' style={{}}>
                    <Text className='text-[18px] text-newTextColor font-LexendMedium'>Apply Coupons</Text>
                    <Entypo name='chevron-right' size={18} color={Colors.newTextColor} />
                </TouchableOpacity> */}

                <View className='mt-4'>
                    <View>
                        <Text className='text-[15px] text-newTextColor font-LexendMedium tracking-wide'>Price Details</Text>
                    </View>
                    <View className='mt-2'></View>
                    {
                        renderCommonView('Order value', totalPrice?.toFixed(2))
                    }
                    {
                        renderCommonView('Discount on MRP applied', totalDiscount?.toFixed(2),)
                    }
                    <View className='mt-2'></View>
                    <View className='w-full h-[1px] bg-borderColor'></View>

                    <View className='flex flex-row justify-between items-center mt-2' >
                        <View>
                            <Text className='text-[14px] text-newTextColor font-LexendMedium tracking-wide'>{'You Pay'}</Text>
                        </View>
                        <View className=''>
                            <Text className='text-[13px] text-newTextColor font-LexendBold tracking-wide'> {'₹' + totalPrice?.toFixed()}</Text>
                        </View>
                    </View >

                    <View className='mt-2'>
                        <Text className='text-[14px] text-blackColor font-LexendMedium tracking-wide bg-yellow-300'>Congrats! ₹{totalDiscount?.toFixed(2)} saved on this order</Text>
                    </View>
                </View>

                <View>
                    <FlatList
                        data={shippingData}
                        renderItem={(d: any) => {
                            const { item, index } = d;
                            return (
                                <View className='mt-3' key={index}>
                                    <View className='flex flex-row items-center'>
                                        <Checkbox
                                            status={selectedDelivery === item?.delivery_type ? 'checked' : 'unchecked'}
                                            onPress={() => {
                                                setSelectedDelivery(item?.delivery_type);
                                                setShippingCharge(item?.ship_cost);
                                                setDeliveryNote(item?.delivery_type === 1 ? item.basic_note : item.premium_note);
                                                setCodAvailable(item?.cod);
                                            }}
                                        />
                                        <Text className='text-blackColor font-LexendMedium text-base'>
                                            {item?.delivery_type === 1 ? ' Basic delivery :' : 'Premium delivery :'}
                                        </Text>
                                    </View>
                                    <View className='ml-10'>
                                        <Text className='text-newTextColor font-LexendRegular text-[13px] leading-5'>
                                            Shipping Cost : ₹{item?.ship_cost}
                                        </Text>
                                        <Text className='text-newTextColor font-LexendRegular text-[13px] leading-5'>
                                            Delivery Note: {item?.delivery_type === 1 ? item.basic_note : item.premium_note}
                                        </Text>
                                    </View>
                                </View>
                            )
                        }}
                    />
                </View>

                {
                    shippingCharge ?
                        <View className='w-full flex justify-end items-end mt-5 bg-yellow-500 px-3'>
                            <Text className='text-blackColor font-LexendMedium text-base'> Total pay : ₹{Number(totalPrice + shippingCharge).toFixed(2)}</Text>
                        </View>
                        : null
                }

                <View className='mt-5'>
                    <Text className='text-[14px] pb-1 text-newTextColor font-LexendRegular tracking-wide'>Address</Text>
                </View>
                {
                    addressData?.length ?
                        <View className='flex flex-row items-center border border-borderColor rounded-md w-full bg-bgcolor h-[50px] justify-between px-2'>
                            <View className='w-[60%]'>
                                <Text numberOfLines={1} className='text-xs text-newTextColor font-Lexendlight tracking-wide'>
                                    {defaultAddress?.length ? defaultAddress[0]?.address : addressData[0]?.address}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={openBottomSheet} className='w-[40%] flex justify-end items-end'>
                                <Text className='text-sm text-primaryColor font-LexendMedium tracking-wide'>{"Change"}</Text>
                            </TouchableOpacity>
                        </View>
                        :
                        <TouchableOpacity onPress={() => { props.navigation.navigate('Address', { isEdit: false }) }} className='flex flex-row border border-borderColor rounded-md items-center w-full bg-bgcolor h-[50px] justify-between px-5'>
                            <View className=''>
                                <Text className='text-[16px] text-newTextColor font-LexendMedium tracking-wide'>Add Address</Text>
                            </View>
                            <Entypo name='plus' size={25} color={Colors.newTextColor} />
                        </TouchableOpacity>
                }
            </SafeAreaView>
        )
    }

    const listEmptyComponent = () => {
        return (
            <View className='flex items-center max-h-[50%] mt-[5%]'>
                <LottieView
                    source={require('../../assets/animations/emptycart.json')}
                    autoPlay
                    loop
                    style={{ width: screenWidth <= 360 ? 200 : 400, height: screenWidth <= 360 ? 200 : 400 }}
                />
                <Text className='text-blackColor font-LexendRegular text-center text-base'>Your Cart is empty</Text>
                <Text className='text-newTextColor font-Lexendlight text-center text-sm mt-1'>Add items to get started</Text>

                <TouchableOpacity onPress={onShopping} className='p-2 px-5 bg-primaryColor rounded-md mt-2'>
                    <Text className='text-white text-sm font-LexendMedium'>START SHOPPING</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const closeModal = () => {
        setModalVisible(false);
        getAddress();
    };
    const openBottomSheet = () => {
        setBottomSheetVisible(true);
        setSelectedDelivery(null);
    };

    const closeBottomSheet = (eventKey?: string) => {
        if (eventKey === 'closeBottomSheet') {
            setBottomSheetVisible(false);
        } else {
            setBottomSheetVisible(false);
            getAddress();
        }
    };

    return (
        <SafeAreaView className='flex flex-1 bg-whiteColor'>
            <CommonHeader title={'Shopping cart'} navigation={props.navigation} isCartIcon={false} />
            {/* <GestureHandlerRootView style={{ flex: 1 }}> */}

            <Drawer
                open={bottomSheetVisible}
                onClose={() => closeBottomSheet('closeBottomSheet')}
                onOpen={openBottomSheet}
                renderDrawerContent={() => {
                    return <Addresses navigation={props.navigation} closeModal={closeBottomSheet} />;
                }}
                drawerPosition='right'
                drawerType='front'
            >
                {
                    loader ?
                        <View className='flex flex-1 justify-center items-center'>
                            <ActivityIndicator size={'large'} color={Colors.primaryColor} />
                        </View>
                        :
                        <>
                            <View className='flex flex-1'>
                                <SafeAreaView className='flex flex-1'>
                                    {
                                        cartItems?.cart_items?.length ?
                                            <View className='w-36 border border-borderColor rounded-lg px-3 py-2 mt-5 ml-5'>
                                                <Text className='text-newTextColor text-base font-LexendMedium text-center'>Total Items ({cartItems?.cart_items?.length})</Text>
                                            </View>
                                            : null
                                    }
                                    <View className='px-5 mt-5 pb-10'>
                                        <FlatList
                                            data={cartItems?.cart_items}
                                            renderItem={renderCartItem}
                                            keyExtractor={item => item.id}
                                            ListFooterComponent={cartItems?.cart_items?.length ? footerComponent : null}
                                            ListEmptyComponent={listEmptyComponent}
                                            contentContainerStyle={{ paddingBottom: '20%' }}
                                            showsVerticalScrollIndicator={false}
                                        />
                                    </View>
                                </SafeAreaView>

                                {
                                    cartItems?.cart_items?.length ?
                                        <View className={`w-full h-[70px] flex px-3 py-4 border-[1px] border-borderColor bg-whiteColor flex-row justify-between ${screenWidth < 360 ? 'py-3 px-3' : ''}`}>
                                            <View className='flex w-[50%]'>
                                                <View>
                                                    <Text className='text-[12px] text-newTextColor font-LexendRegular'>Total</Text>
                                                </View>
                                                <View className='flex flex-row items-center'>
                                                    <Text className={`text-[${screenWidth <= 360 ? '14px' : '16px'}] text-newTextColor font-LexendBold`}>
                                                        ₹{shippingCharge ? Number(totalPrice + shippingCharge).toFixed(2) : totalPrice?.toFixed(2)}
                                                    </Text>
                                                    <Text className='text-[12px] text-newTextColor font-Lexendlight ml-1'>(All inclusive)</Text>
                                                </View>
                                            </View>

                                            <TouchableOpacity
                                                disabled={defaultAddress?.length <= 0 || !selectedDelivery}
                                                onPress={onProceedPayment}
                                                className={`px-3 py-2 bg-orangeColor flex justify-center items-center rounded-md ${defaultAddress?.length <= 0 || !selectedDelivery ? 'opacity-50' : ''}`}
                                            >
                                                <Text className={`text-whiteColor ${screenWidth <= 360 ? 'text-[10px]' : 'text-[14px]'}  font-LexendMedium`}>
                                                    Proceed to payment
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        : null
                                }
                            </View>
                        </>
                }
            </Drawer>

            {/* </GestureHandlerRootView> */}

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.borderColor,
        height: 170,
        marginVertical: 12,
        borderRadius: 10
    },
    bookDetails: {
        flex: 1,
        padding: 12
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10
    },
    quantityButton: {
        // marginRight: 8,
        // padding: 8,
        backgroundColor: '#eee',
        borderRadius: 4,
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center'
    },
    removeButton: {
        marginLeft: 16,
        padding: 8,
        backgroundColor: '#ff6961',
        borderRadius: 4,
    },
    removeButtonText: {
        color: '#fff',
    },
    couponContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 16,
    },
    couponInput: {
        flex: 1,
        padding: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
    },
    applyCouponButton: {
        marginLeft: 8,
        padding: 8,
        backgroundColor: '#4682b4',
        borderRadius: 4,
    },
    applyCouponButtonText: {
        color: '#fff',
    },
    priceDetailsContainer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    paymentButton: {
        padding: 16,
        backgroundColor: '#32cd32',
        alignItems: 'center',
        borderRadius: 4,
        marginVertical: 16,
    },
    paymentButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    lottie: {
        width: 400,
        height: 400,
    },
    bottomSheet: {
        shadowColor: "#000",
        shadowOffset: {
            width: 5,
            height: -4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 10,
        borderWidth: 1.5,
        borderColor: Colors.primaryColor,
        borderTopRightRadius: 12,
        borderTopLeftRadius: 12
    },
});

export default Cart;
