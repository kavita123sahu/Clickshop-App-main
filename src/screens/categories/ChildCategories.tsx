import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from '../../common/Colors';
import FastImage from 'react-native-fast-image';
import * as _CAT_SERVICEs from '../../services/CategoryServices';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { useIsFocused } from '@react-navigation/native';
import CommonHeader from '../../component/CommonHeader';
import { BaseUrl } from '../../config/Key';

const ChildCategories = (props: any) => {
  const { subCatID, title } = props.route.params;
  const { navigation } = props;
  const isFocused = useIsFocused();
  const [headerItem, setHeaderItem] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState<{ id: number; title: string; type: string; image: string }[]>();
  const [subCatData, setSubCatData] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    getSubCategoryData();
  }, [isFocused])

  const getSubCategoryData = async () => {
    setLoader(true);
    try {
      const result: any = await _CAT_SERVICEs.get_sub_categories(subCatID);
      const { subCategory } = result;
      setSubCatData(subCategory);
      setFilteredBooks(subCategory);
      setLoader(false);
    } catch (error) {
      console.log("SUB CATEGORY ERROR:", error);

    }
  }

  const onClickItems = async (item: any) => {
    try {
      const result: any = await _CAT_SERVICEs.get_sub_sub_categories(item.id);
      if (result?.subSubCategory.length > 0) {
        props.navigation.navigate('SubSubCategory', { SubSubCategoryData: result?.subSubCategory, title: item?.name });
      } else {
        navigation.navigate('AllBooks', { link: `https://clikshop.co.in/api/v3/products?sub_category=${item.id}` })
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
      <TouchableOpacity style={styles.item} onPress={() => onClickItems(item)} className='w-full'>
        <FastImage source={{ uri: BaseUrl.base + 'public/' + item.image }} style={styles.image} resizeMode='center' className='w-1/4'/>
        <View className='w-3/4'>
          <Text className="text-newTextColor text-sm font-LexendMedium">
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex flex-1 bg-whiteColor">
      <CommonHeader title={title} navigation={navigation} isCartIcon={false} />
      <View className="flex flex-auto">
        {
          loader ?
            <View className='flex flex-1 justify-center items-center'>
              <ActivityIndicator size={'large'} color={Colors.primaryColor} />
            </View>
            :
            <View className={`w-full bg-whiteColor`} style={{ height: '100%' }}>
              {
                subCatData?.length > 0 ? (
                  <>
                    <View className='flex w-full justify-center items-center relative my-4 px-5'>
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
                  </>
                )
                  :
                  <View className='flex flex-1 justify-center items-center'>
                    <Text className='text-base font-LexendRegular text-center text-newTextColor'>No Product Available</Text>
                  </View>
              }
            </View>
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  image: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.borderColor
  },
  searchInput: {
    backgroundColor: '#fff',
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    paddingLeft: 30,
    paddingBottom: 0,
    backgroundColor: '#fff',
    width: '100%',
  },
  searchIcon: {
    marginRight: 0,
    position: 'absolute',
    left: 10,
    zIndex: 99,
    borderColor: '#ccc',
  },
});

export default ChildCategories;
