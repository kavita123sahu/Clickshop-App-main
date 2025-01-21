import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    TextInput,
} from 'react-native';
import React, { useState } from 'react';
import { Colors } from '../../common/Colors';
import * as _CAT_SERVICEs from '../../services/CategoryServices';
import Fontisto from 'react-native-vector-icons/Fontisto';
import CommonHeader from '../../component/CommonHeader';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Sub4Category = (props: any) => {
    const { Sub4CategoryData, title } = props.route.params;
    const { navigation } = props;
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredBooks, setFilteredBooks] = useState(Sub4CategoryData);
    const [subCatData, setSubCatData] = useState(Sub4CategoryData);

    const onClickItems = async (item: any) => {
        try {
            const result: any = await _CAT_SERVICEs.get_sub5_categories(item.id);
            if (result?.sub5Category.length > 0) {
                navigation.navigate('Sub5Category', { Sub5CategoryData: result?.sub5Category, title: item?.name });
            } else {
                navigation.navigate('AllBooks', { link: `https://clikshop.co.in/api/v3/products?sub4_category=${item.id}` })
            }
        } catch (error) {
            console.log("ERROR:", error);
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        const filtered = subCatData.filter((book: any) =>
            book.name.toLowerCase().includes(query.toLowerCase()),
        );
        setFilteredBooks(filtered);
    };

    const renderItem = ({ item }: { item: any }) => {
        return (
            <TouchableOpacity className='py-3 px-6 flex flex-row justify-between items-center' onPress={() => onClickItems(item)}>
                <Text className="text-newTextColor text-sm font-LexendRegular pr-4">
                    {item.name}
                </Text>
                <AntDesign name='right' size={20} color={Colors.newTextColor} />
            </TouchableOpacity>
        );
    };

    return (
        <View className="flex flex-1 bg-whiteColor">
            <CommonHeader title={title} navigation={navigation} isCartIcon={false} />
            <View className="flex flex-auto">
                <View className={`w-full bg-whiteColor`} style={{ height: '100%' }}>
                    <View className='flex w-[100%] justify-center items-center relative my-4 px-5'>
                        <TextInput
                            className='w-full h-[45px] rounded-[15px] text-newTextColor leading-6 pl-10 bg-bgcolor border border-borderColor font-LexendRegular'
                            placeholder='Search your best books'
                            value={searchQuery}
                            onChangeText={handleSearch}
                            placeholderTextColor={Colors.blackColor50}
                            autoComplete='off'
                        />
                        <View className='absolute left-8'>
                            <Fontisto name="search" size={18} color={Colors.blackColor50} />
                        </View>
                    </View>
                    <FlatList
                        data={filteredBooks}
                        renderItem={renderItem}
                        keyExtractor={item => item.id.toString()}
                    />
                </View>
            </View>
        </View>
    )
}

export default Sub4Category