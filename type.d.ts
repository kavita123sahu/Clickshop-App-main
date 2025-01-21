/// <reference types="nativewind/types" />
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
    Login: undefined;
    Signup: undefined;
    Otp: undefined;
    Splash: undefined;
    SplashStack: undefined;
    AuthStack: undefined;
    HomeStack: undefined;
    HomePage: undefined;
    ViewAll: undefined;
    TabStack: undefined;
    EditProfile: undefined;
    MyOrders: undefined;
    MyWishList: undefined;
    TermsConditions: undefined;
    Replacement: undefined;
    PrivacyPolicy: undefined;
    RateShare: undefined;
    AboutUs: undefined;
    ContactUs: undefined;
    ChildCategories: undefined;
    BookItem: undefined;
    AllBooks: undefined;
    ProductDetails: undefined;
    Cart: undefined;
    Coupons: undefined;
    Address: undefined;
    PaymentOptions: undefined;
    ContactUs: any,
    TermsAndConditions: any,
    ReplacementAndReturn: any,
    PrivacyPolicy: any,
    Search: any,
    SubSubCategory: any
    Sub3Category: any,
    Sub4Category: any,
    Sub5Category: any,
    WriteReview: any,
    SellerDetails: any,
    ThankYou: any,
    OrderDetailPage: any,
    ViewPdf: any,
    ReplacementReason: any
};

export type RootBottomParamList = {
    Home: undefined;
    Search: undefined;
    Categories: undefined;
    Account: undefined;
};

export type AllBooksScreenProps = NativeStackScreenProps<RootStackParamList, 'AllBooks'>
