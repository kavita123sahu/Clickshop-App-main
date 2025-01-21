import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../common/Colors';
import { Fonts } from '../common/Fonts';
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import * as _CART_SERVICE from '../services/CartService';
import { Utils } from '../common/Utils';
import { isAddedToCart, isRemovedFromCart } from '../redux/action/CartActions';
import Octicons from 'react-native-vector-icons/Octicons';

interface Props {
  navigation: {
    goBack: () => void;
    navigate: (value: string) => void
  };
  title: string;
  isCartIcon: boolean
}

const CommonHeader: React.FC<Props> = (props) => {
  const { navigation, isCartIcon, title } = props;
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
  }, [cart_Data && isCartIcon])


  return (
    <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', paddingLeft: 12, paddingRight: 40, paddingVertical: 20, justifyContent: 'space-between', backgroundColor: Colors.orangeColor }}>
      <View className='flex flex-row items-center w-[75%]'>
        <TouchableOpacity onPress={() => { props.navigation.goBack() }}>
          <MaterialIcons name='arrow-back' size={25} color={Colors.white} />
        </TouchableOpacity>
        <View style={{ width: '90%' }}>
          <Text numberOfLines={1} style={{ color: Colors.white, fontSize: 20, letterSpacing: 0.44, fontFamily: Fonts.LexendMedium, marginLeft: 12 }}>
            {title}
          </Text>
        </View>
      </View>

      {isCartIcon && (
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end', width: '30%' }}>
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
      )}
    </View>
  );
};

export default CommonHeader;
