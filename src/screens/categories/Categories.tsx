import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../../component/Header';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Colors } from '../../common/Colors';
import * as _AUTH_SERVICE from '../../services/AuthService';
import * as _CAT_SERVICES_ from '../../services/CategoryServices';
import { useIsFocused } from '@react-navigation/native';
import Loader from '../../component/Loader';
import FastImage from 'react-native-fast-image';
import { BaseUrl } from '../../config/Key';


const Categories = (props: any) => {
  const isFocused = useIsFocused();
  const [categories, setCategories] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    getAllCategory();
  }, [])

  const getAllCategory = async () => {
    setLoader(true);
    try {
      let result: any = await _CAT_SERVICES_.get_all_categories();
      setCategories(result?.category);
      setLoader(false);
    } catch (error) {
      console.log(error);
    }
  }

  const onClickItems = (item: any) => {
    props.navigation.navigate('ChildCategories', { subCatID: item?.id, title: item?.name });
  };


  const renderItems = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        onPress={() => onClickItems(item)}
        style={{ elevation: 2 }}
        className="bg-slate-200 flex w-[45%] h-[180px] mx-[2%] my-[2%] rounded-[6px]">
        <View className="w-full h-[50%] bg-white rounded-t-[6px]">
          <FastImage source={{ uri: BaseUrl.base + 'public/' + item.banner }} className='w-full h-full' resizeMode='center' />
        </View>
        <View className='h-[50%] w-full flex justify-center items-center'>
          <Text
            className="text-textColor text-[13px] font-LexendMedium ml-2 mt-4 text-center"
            style={{ color: Colors.textColor }}>
            {item?.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const screen_height = Dimensions.get('window').height;

  return (
    <View className="flex flex-1 bg-whiteColor">
      <Header navigation={props.navigation} />
      <View className={`w-full bg-whiteColor`}>
        <View className="flex items-center justify-center px-1 mt-4 h-[93%]">
          <Loader loading={loader} />
          <FlatList
            style={{}}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            data={categories}
            renderItem={renderItems}
            keyExtractor={(item: any) => item.id.toString()}
          />
        </View>
      </View>
    </View>
  );
};

export default Categories;
