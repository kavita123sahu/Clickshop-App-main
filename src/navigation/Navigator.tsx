import { View, Text, Dimensions } from 'react-native';
import React from 'react';
import { LinkingOptions, NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootBottomParamList, RootStackParamList } from '../../type';
import { enableScreens } from 'react-native-screens';
import Login from '../screens/auth/Login';
import Splash from '../screens/auth/Splash';
import Otp from '../screens/auth/Otp';
import Signup from '../screens/auth/Signup';
import HomePage from '../screens/home/HomePage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../common/Colors';
import AllBooks from '../screens/home/AllBooks';
import ProductDetails from '../screens/home/ProductDetails';
import Cart from '../screens/carts/Cart';
import Coupons from '../screens/carts/Coupons';
import Address from '../screens/carts/Address';
import PaymentOptions from '../screens/carts/PaymentOptions';
import Account from '../screens/Account/Account';
import EditProfile from '../screens/Account/EditProfile';
import MyOrders from '../screens/Account/MyOrders';
import MyWishList from '../screens/Account/MyWishList';
import ChildCategories from '../screens/categories/ChildCategories';
import BookItem from '../screens/categories/BookItem';
import Categories from '../screens/categories/Categories';
import ContactUs from '../screens/Account/ContactUs';
import TermsAndConditions from '../screens/Account/TermsAndConditions';
import ReplacementAndReturn from '../screens/Account/ReplacementAndReturn';
import PrivacyPolicy from '../screens/Account/PrivacyPolicy';
import Search from '../screens/home/Search';
import SubSubCategory from '../screens/categories/SubSubCategory';
import Sub5Category from '../screens/categories/Sub5Category';
import Sub3Category from '../screens/categories/Sub3Category';
import Sub4Category from '../screens/categories/Sub4Category';
import WriteReview from '../component/WriteReview';
import SellerDetails from '../component/SellerDetails';
import { Fonts } from '../common/Fonts';
import ThankYou from '../screens/carts/ThankYou';
import OrderDetailPage from '../screens/Account/OrderDetailPage';
import ViewPdf from '../component/ViewPdf';
import ReplacementReason from '../screens/Account/ReplacementReason';
import { useDispatch, useSelector } from 'react-redux';
import { setInternetStatus } from '../redux/action/InternetAction';
import NetInfo from "@react-native-community/netinfo";
import NetworkError from '../screens/NetworkError';
import ForgotPassword from '../screens/auth/ForgotPassword';
import Otpverify from '../screens/auth/Otpverify';



enableScreens();
const hideHeader = { headerShown: false };
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootBottomParamList>();
const screen_height = Dimensions.get('screen').height;


const TabStack = () => {
  const dispatch = useDispatch();
  const net = NetInfo.addEventListener(state => {
    dispatch(setInternetStatus(state.isConnected))
  });
  return (
    <Tab.Navigator
      initialRouteName="Home"
      backBehavior="history"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: Colors.white,
          height: screen_height * 0.08,
        },
        tabBarActiveTintColor: Colors.orangeColor,
        tabBarInactiveTintColor: Colors.bottomInactive,
        tabBarLabelStyle: { fontSize: 11, bottom: '10%', fontFamily: Fonts.LexendMedium },
      }}>
      <Tab.Screen name="Home" component={HomePage}
        options={{
          tabBarLabel: 'Home',
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <View
              style={{ height: 55, width: 130, justifyContent: 'center', alignItems: 'center', }}>
              <MaterialCommunityIcons
                name={focused ? 'home' : 'home-outline'}
                size={30}
                color={focused ? Colors.orangeColor : Colors.black}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen name="Search" component={Search}
        options={{
          tabBarLabel: 'Search',
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <View style={{ height: 55, width: 130, justifyContent: 'center', alignItems: 'center', }}>
              <MaterialIcons name="search" size={30} color={focused ? Colors.orangeColor : Colors.black} />
            </View>
          ),
        }}
      />

      <Tab.Screen name="Categories" component={Categories}
        options={{
          tabBarLabel: 'Categories',
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <View style={{ height: 55, width: 130, justifyContent: 'center', alignItems: 'center', }}>
              <MaterialIcons name="category" size={24} color={focused ? Colors.orangeColor : Colors.black} />
            </View>
          ),
        }}
      />
      < Tab.Screen name="Account" component={Account}
        options={{
          tabBarLabel: 'Account',
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <View style={{ height: 55, width: 130, justifyContent: 'center', alignItems: 'center', }}>
              <MaterialCommunityIcons name={focused ? 'account' : 'account-outline'} size={30} color={focused ? Colors.orangeColor : Colors.black} />
            </View>
          ),
        }} />
    </Tab.Navigator >
  );
};


const HomeStack = () => {
  const dispatch = useDispatch();
  const net = NetInfo.addEventListener(state => {
    dispatch(setInternetStatus(state.isConnected))
  });
  return (
    <Stack.Navigator initialRouteName="TabStack" screenOptions={hideHeader}>
      <Stack.Screen name={'TabStack'} component={TabStack} options={{ headerShown: false }} />
      <Stack.Screen name={'AllBooks'} component={AllBooks} options={{ headerShown: false }} />
      <Stack.Screen name={'EditProfile'} component={EditProfile} options={{ headerShown: false }} />
      <Stack.Screen name={'MyOrders'} component={MyOrders} options={{ headerShown: false }} />
      <Stack.Screen name={'MyWishList'} component={MyWishList} options={{ headerShown: false }} />
      <Stack.Screen name={'ContactUs'} component={ContactUs} options={{ headerShown: false }} />
      <Stack.Screen name={'TermsAndConditions'} component={TermsAndConditions} options={{ headerShown: false }} />
      <Stack.Screen name={'ReplacementAndReturn'} component={ReplacementAndReturn} options={{ headerShown: false }} />
      <Stack.Screen name={'PrivacyPolicy'} component={PrivacyPolicy} options={{ headerShown: false }} />
      <Stack.Screen name={'ChildCategories'} component={ChildCategories} options={{ headerShown: false }} />
      <Stack.Screen name={'BookItem'} component={BookItem} options={{ headerShown: false }} />
      <Stack.Screen name={'SubSubCategory'} component={SubSubCategory} options={{ headerShown: false }} />
      <Stack.Screen name={'Sub3Category'} component={Sub3Category} options={{ headerShown: false }} />
      <Stack.Screen name={'Sub4Category'} component={Sub4Category} options={{ headerShown: false }} />
      <Stack.Screen name={'Sub5Category'} component={Sub5Category} options={{ headerShown: false }} />
      <Stack.Screen name={'ProductDetails'} component={ProductDetails} options={{ headerShown: false }} />
      <Stack.Screen name={'Cart'} component={Cart} options={{ headerShown: false }} />
      <Stack.Screen name={'Coupons'} component={Coupons} options={{ headerShown: false }} />
      <Stack.Screen name={'Address'} component={Address} options={{ headerShown: false }} />
      <Stack.Screen name={'PaymentOptions'} component={PaymentOptions} options={{ headerShown: false }} />
      <Stack.Screen name={'Search'} component={Search} options={{ headerShown: false }} />
      <Stack.Screen name={'WriteReview'} component={WriteReview} options={{ headerShown: false }} />
      <Stack.Screen name={'SellerDetails'} component={SellerDetails} options={{ headerShown: false }} />
      <Stack.Screen name={'ThankYou'} component={ThankYou} options={{ headerShown: false }} />
      <Stack.Screen name={'OrderDetailPage'} component={OrderDetailPage} options={{ headerShown: false }} />
      <Stack.Screen name={'ReplacementReason'} component={ReplacementReason} options={{ headerShown: false }} />
      <Stack.Screen name={'ViewPdf'} component={ViewPdf} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};



const AuthStack = () => {
  const dispatch = useDispatch();
  const net = NetInfo.addEventListener(state => {
    dispatch(setInternetStatus(state.isConnected))
  });
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={hideHeader}>
      <Stack.Screen name={'Login'} component={Login} options={{ headerShown: false }} />
      <Stack.Screen name={'Otpverify'} component={Otpverify} options={{ headerShown: false }} />
      <Stack.Screen name={'Otp'} component={Otp} options={{ headerShown: false }} />
      <Stack.Screen name={'Signup'} component={Signup} options={{ headerShown: false }} />
      <Stack.Screen name={'ForgotPassword'} component={ForgotPassword} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

const SplashStack = () => {
  const dispatch = useDispatch();
  const net = NetInfo.addEventListener(state => {
    dispatch(setInternetStatus(state.isConnected))
  });
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={hideHeader}>
      <Stack.Screen name={'Splash'} component={Splash} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

const DrawerNavigator = () => {
  return (
    <Stack.Navigator initialRouteName='SplashStack' screenOptions={hideHeader}>
      <Stack.Screen name='SplashStack' component={SplashStack} options={hideHeader} />
      <Stack.Screen name='AuthStack' component={AuthStack} options={hideHeader} />
      <Stack.Screen name='HomeStack' component={HomeStack} options={hideHeader} />
    </Stack.Navigator>
  )
}

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['clikshop://', 'https://clikshop.co.in/api/v3/'],
  config: {
    screens: {
      HomeStack: {
        screens: {
          ProductDetails: 'products/:id',
        },
      },
    },
  },
};

const Navigator = () => {
  const isConnected = useSelector((state: any) => {
    return state.internetReducer.isConnected
  })

  return (
    <NavigationContainer>
      {
        isConnected ?
          <DrawerNavigator />
          :
          <NetworkError />
      }
    </NavigationContainer>
  )
}

export default Navigator