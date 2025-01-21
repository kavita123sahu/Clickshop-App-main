import { View, Text, TouchableOpacity, FlatList, ScrollView, Dimensions, ActivityIndicator, Platform, Share, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Colors } from '../../common/Colors'
import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient'
import { Card, Menu } from 'react-native-paper';
import * as _AUTH_SERVICE from '../../services/AuthService';
import { Utils } from '../../common/Utils'
import { useIsFocused } from '@react-navigation/native'
import * as _PROFILE_SERVICES from '../../services/ProfileServices';
import Toast from 'react-native-toast-message'
import { Fonts } from '../../common/Fonts'
import { BaseUrl } from '../../config/Key'
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux'
import { setUserInfo } from '../../redux/action/UserInfoAction'

const screenWidth = Dimensions.get('window').width;


let DATA = [
  {
    id: 1,
    iconName: 'cart-arrow-down',
    name: 'My Orders',
    key: 'my_orders',
  },
  {
    id: 2,
    iconName: 'heart',
    name: 'My Wishlist',
    key: 'my_wishlist',
  },
  {
    id: 3,
    iconName: 'asterisk',
    name: 'Terms & Conditions',
    key: 'terms_and_conditions',
  },
  {
    id: 4,
    iconName: 'refresh',
    name: 'Replacement & Refund Policy',
    key: 'replacement_and_refund_policy',
  },
  {
    id: 5,
    iconName: 'info-circle',
    name: 'Privacy Policy',
    key: 'privacy_and_policy',
  },
  {
    id: 6,
    iconName: 'share-alt',
    name: 'Rate & Share',
    key: 'rate_and_share',
  },
  {
    id: 7,
    iconName: 'mobile-phone',
    name: 'Clikshop Contact Details',
    key: 'clikshop_contact',
  },
  {
    id: 7,
    iconName: 'logout',
    name: 'Logout',
    key: 'logout',
  },
]
const Account = (props: any) => {
  const dispatch = useDispatch();
  const userDetails = useSelector((state: any) => {
    return state.user_info_reducer?.user_info;
  })


  const onClickItems = (item: any) => {
    if (item.key === 'my_orders') {
      props.navigation.navigate('MyOrders');
    } else if (item.key === 'my_wishlist') {
      props.navigation.navigate('MyWishList');
    } else if (item.key === 'clikshop_contact') {
      props.navigation.navigate('ContactUs');
    } else if (item.key === 'terms_and_conditions') {
      props.navigation.navigate('TermsAndConditions');
    } else if (item.key === 'replacement_and_refund_policy') {
      props.navigation.navigate('ReplacementAndReturn');
    } else if (item.key === 'privacy_and_policy') {
      props.navigation.navigate('PrivacyPolicy');
    } else if (item.key === 'logout') {
      logout();
    } else if (item.key === 'rate_and_share') {
      onShare();
    }
  }

  const logout = async () => {
    await Utils.clearAllData()
    dispatch(setUserInfo(null));
    props.navigation.replace('AuthStack', { screen: 'Login' });
  }

  const onShare = async () => {
    try {
      const result = await Share.share({
        title: 'App link',
        message: 'https://play.google.com/store/apps/details?id=com.bansal.clickshop',
        url: 'https://play.google.com/store/apps/details?id=com.bansal.clickshop'
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // setMenu(false)
        } else {
          // setMenu(false)
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error: any) {
      console.log(error.message);
    }
  }

  const onClickRegister = () => {
    props.navigation.replace('AuthStack', { screen: 'Login' })
  }

  const renderItems = ({ item }: { item: any }) => {
    if (item.key === 'logout' && !userDetails) {
      return null;
    }
    return (
      <Card
        onPress={() => onClickItems(item)}
        className='flex w-[45%]  h-[130px] bg-whiteColor mx-[2%] my-[2%] rounded-[6px] items-center justify-center px-1'>
        <View className='items-center justify-center px-1'>
          <View className={`w-[40px] h-[40px] rounded-full flex justify-center items-center ${item.key === 'logout' ? 'bg-red-200' : 'bg-slate-200'}`}>
            {
              item.key === 'logout' ?
                <MaterialIcons name={item.iconName} size={18} color={'red'} />
                :
                <FontAwesome name={item.iconName} size={18} color={Colors.textColor} />
            }
          </View>
        </View>
        <Text className={`${item.key === 'logout' ? 'text-red-600' : 'text-textColor'} text-xs font-LexendRegular ml-2 text-center px-2 mt-2`}>{item.name}</Text>
      </Card>
    )
  }

  return (
    <View className='flex flex-auto'>
      <LinearGradient
        colors={['#e62e04', '#ffa500']}
        className='flex flex-1 bg-orange-200 items-center w-full relative pb-4' style={{ zIndex: 10 }}
      >
        <StatusBar backgroundColor={'#e62e04'} barStyle={'light-content'} />
        {
          userDetails ?
            <View className={`flex mt-[6%] justify-center items-center`}>
              <TouchableOpacity className={`${screenWidth > 360 ? 'w-32 h-32' : 'w-20 h-20'} relative rounded-full border-[1px] border-whiteColor justify-center items-center`}>
                {
                  userDetails?.avatar === null ?
                    <Text className='text-4xl text-whiteColor font-LexendBold text-center'>{userDetails?.name[0].toUpperCase()}</Text>
                    :
                    <FastImage source={{ uri: BaseUrl.base + 'public/' + userDetails?.avatar }} resizeMode='contain' className='w-[95%] h-[95%] rounded-full' />
                }
                <TouchableOpacity onPress={() => { props.navigation.navigate('EditProfile') }} className={`flex justify-center items-center absolute bottom-0 ${screenWidth > 360 ? 'right-4' : 'right-0'}`}>
                  <Feather name='edit' size={20} color={Colors.white} />
                </TouchableOpacity>
              </TouchableOpacity>
              <View className='mt-2 flex justify-center items-center'>
                <Text className={`text-whiteColor ${screenWidth > 360 ? 'text-[22px]' : 'text-sm'} tracking-wide font-LexendMedium`}>{userDetails?.name}</Text>
                <Text className='text-whiteColor text-sm tracking-wide mt-1 font-LexendRegular'>+91 {userDetails?.phone}</Text>
              </View>
            </View>
            :
            <View className='flex justify-center items-center h-[200px]'>
              <Text className='text-whiteColor text-center font-LexendMedium text-base'>{"You haven't register yet!!!"}</Text>
              <Text onPress={onClickRegister} className='text-blue-300 text-center font-LexendMedium text-base'>{"Click here to register"}</Text>
            </View>
        }

        <View className={`w-full bg-bgGrayColor absolute bottom-0`} style={{ height: '70%' }}>
          <View className='flex items-center justify-center px-1 mt-4'>
            <FlatList
              style={{}}
              showsVerticalScrollIndicator={false}
              numColumns={2}
              data={DATA}
              renderItem={renderItems}
              keyExtractor={(item: any) => item.id.toString()}
            />
          </View>
        </View>
      </LinearGradient>
      {/* </ScrollView> */}
    </View>
  )
}

export default Account