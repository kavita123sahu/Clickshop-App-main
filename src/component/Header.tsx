import { View, Text, StatusBar, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from '../common/Colors';
import Octicons from 'react-native-vector-icons/Octicons';
import Feather from 'react-native-vector-icons/Feather';
import FastImage from 'react-native-fast-image';
import { Images } from '../assets/Images';
import { useDispatch, useSelector } from 'react-redux';
import { Utils } from '../common/Utils';
import { isAddedToCart, isRemovedFromCart } from '../redux/action/CartActions';
import * as _CART_SERVICE from '../services/CartService';

interface HeaderProps {
    navigation: any;
}

const Header: React.FC<HeaderProps> = ({ navigation }) => {
    const dispatch = useDispatch();
    const [cartSize, setCartSize] = useState([]);

    const cart_Data = useSelector((state: any) => {
        return state.CartAddedReducer?.isAddedToCart;
    })

    useEffect(() => {
        const getCartData = async () => {
            const result: any = await _CART_SERVICE.get_cart_list();
            const { data, message = "", status_code } = result;
            if (status_code === 200) {
                Utils.storeData('cart_items', data?.cart_items);
                dispatch(isRemovedFromCart(false));
                dispatch(isAddedToCart(false));
            }
        }

        const cardLength = async () => {
            const a = await Utils.getData('cart_items');
            setCartSize(a);
        }

        cardLength();
        if (cart_Data === true) {
            getCartData();
        }
    }, [cart_Data])

    return (
        <>
            <StatusBar backgroundColor={Colors.orangeColor} />
            <View
                className={`flex flex-row w-full justify-between items-center px-5 h-[60px] pb-3`}
                style={{ backgroundColor: Colors.orangeColor }}
            >
                <View className='flex w-[60%]'>
                    <View className='flex flex-row items-center'>
                        <View className='flex flex-row items-center w-[160px] h-[50px]'>
                            <FastImage
                                source={Images.mainlogo}
                                className='w-full h-full'
                                resizeMode='center'
                            />
                        </View>
                    </View>
                </View>
                <View className='flex mt-2 flex-row w-[40%] justify-end'>
                    <TouchableOpacity onPress={() => { navigation.navigate('MyWishList'); }} className='mr-5'>
                        <Octicons name='heart' size={25} color={Colors.white} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { navigation.navigate('Cart') }} className='relative'>
                        <Feather name='shopping-cart' size={25} color={Colors.white} className='' />
                        {
                            (cartSize?.length > 0) && (
                                <View className='w-4 h-4 rounded-full flex justify-center items-center absolute -right-2 -top-1 bg-green-500'>
                                    <Text className='text-[11px] text-center text-blackColor  font-LexendMedium'>{cartSize?.length}</Text>
                                </View>
                            )
                        }
                    </TouchableOpacity>
                </View>
            </View>
            {/* <View className='w-full h-[1.5px] bg-greyColor10'></View> */}
        </>
    );
};

export default Header;
