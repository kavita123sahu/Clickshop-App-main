import { View, Text, Dimensions, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Utils } from '../../common/Utils';
import TopAuthor from './TopAuthor';
import Header from '../../component/Header';
import SearchBar from '../../component/SearchBar';
import MainBanner from './MainBanner';
import SignupButton from '../../component/SignupButton';
import SmallBanner from './SmallBanner';
import NewArrival from './NewArrival';
import BestSellers from './BestSellers';
import HomePageProduct from './HomePageProducts';
import * as _HPS from '../../services/HomeServices';
import Loader from '../../component/Loader';
import { Colors } from '../../common/Colors';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FeaturedProduct from './FeaturedProduct';
import * as _PROFILE_SERVICES from '../../services/ProfileServices';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../../redux/action/UserInfoAction';
import Toast from 'react-native-toast-message';
import { Fonts } from '../../common/Fonts';

interface HomePageProps {
    navigation: any; // Replace `any` with the proper type if you have a navigation prop type defined
}

const HomePage: React.FC<HomePageProps> = ({ navigation }) => {
    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [categorieData, setCategoryData] = useState([]);

    useEffect(() => {
        getProducts();
    }, [])

    const getProducts = async () => {
        // setIsLoading(true);
        try {
            let response: any = await _HPS.products();
            if (response.status == 200) {
                setCategoryData(response.data);
                setIsLoading(false);
            } else {
                setIsLoading(false);
            }
        } catch (error) {
            console.log("CATEGORY DATA ERROR:", error);
        }
    }

    const getUser = async () => {
        try {
            const token = await Utils.getData('_TOKEN');
            if (token) {
                const result: any = await _PROFILE_SERVICES.get_user();
                const { status_code, data, message = "" } = result;
                if (status_code === 200) {
                    dispatch(setUserInfo(data));
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const getToken = async () => {
            const t = await Utils.getData('_TOKEN');
            setToken(t);
        };
        getToken();
        getUser();
    }, [isFocused]);



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ flex: 1 }}>
                <Header navigation={navigation} />
                <View style={{ flex: 1, paddingBottom: 3 }}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                        <View className='px-3 pb-3'>
                            <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Search')} className='w-full flex-row py-3.5 rounded-[15px] mt-5 leading-4 px-3 bg-bgcolor border-[1px] border-borderColor justify-start items-center'>
                                <View className=''>
                                    <Fontisto name="search" size={18} color={Colors.blackColor50} />
                                </View>
                                <Text className='text-newTextColor opacity-50  font-LexendRegular ml-2'>Search your best books</Text>
                            </TouchableOpacity>
                        </View>
                        {/* <TopAuthor navigation={navigation} /> */}
                        <Loader loading={isLoading} />
                        <MainBanner navigation={navigation} />
                        <SignupButton navigation={navigation} token={token} />
                        <SmallBanner navigation={navigation} position={1} margin={10} />
                        <SmallBanner navigation={navigation} position={2} margin={0} />
                        <NewArrival navigation={navigation} />
                        <SmallBanner navigation={navigation} position={3} margin={10} />
                        <BestSellers navigation={navigation} />
                        <SmallBanner navigation={navigation} position={4} margin={10} />
                        <SmallBanner navigation={navigation} position={5} margin={0} />
                        <FeaturedProduct navigation={navigation} />
                        <HomePageProduct navigation={navigation} categorieData={categorieData} />
                    </ScrollView>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default HomePage;
