import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Dimensions,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import Header from '../../component/Header';
import {Touchable} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Zocial from 'react-native-vector-icons/Zocial';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Colors} from '../../common/Colors';
import FastImage from 'react-native-fast-image';
import {Images} from '../../assets/Images';
import LinearGradient from 'react-native-linear-gradient';
import {Menu, TextInput} from 'react-native-paper';
import * as _AUTH_SERVICE from '../../services/AuthService';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import Octicons from 'react-native-vector-icons/Octicons';

const BookItem = (props: any) => {
  const {BookItemName} = props.route.params;
  console.log(BookItemName);

  const [headerItem, setHeaderItem] = useState(BookItemName);
  const [openMenu, setOpenMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFavourite, setIsFavourite] = useState(false);
  const [itemId, setItemId] = useState();
  //   const [filteredBooks, setFilteredBooks] =
  //     useState<{id: number; title: string; type: string; image: string}[]>(books);

  const [filteredBooks, setFilteredBooks] = useState([
    {
      id: 0,
      source:
        'https://banner2.cleanpng.com/20180314/qwe/kisspng-web-banner-books-on-bookshelves-5aa97acee5bfc5.9101121915210564629411.jpg',
      title: 'Rich Dad Poor Dad',
      author: 'Robert T.Kiyosaki',
      price: '388',
      actual_price: '599',
      discount_percent: '-35%',
    },
    {
      id: 1,
      source:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9WjPl0_EOkjvwqP51AUfv8JpyQJiuGWVP7Q&usqp=CAU',
      title: 'Rich Dad Poor Dad',
      author: 'Robert T.Kiyosaki',
      price: '388',
      actual_price: '599',
      discount_percent: '-35%',
    },
    {
      id: 2,
      source:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnl1jD2hYWNPLOKGz2vMBryuSFYyU_HcqHYg&usqp=CAU',
      title: 'Rich Dad Poor Dad',
      author: 'Robert T.Kiyosaki',
      price: '388',
      actual_price: '599',
      discount_percent: '-35%',
    },
    {
      id: 3,
      source:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnl1jD2hYWNPLOKGz2vMBryuSFYyU_HcqHYg&usqp=CAU',
      title: 'Rich Dad Poor Dad',
      author: 'Robert T.Kiyosaki',
      price: '388',
      actual_price: '599',
      discount_percent: '-35%',
    },
    {
      id: 4,
      source:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnl1jD2hYWNPLOKGz2vMBryuSFYyU_HcqHYg&usqp=CAU',
      title: 'Rich Dad Poor Dad',
      author: 'Robert T.Kiyosaki',
      price: '388',
      actual_price: '599',
      discount_percent: '-35%',
    },
  ]);

  // setFilteredBooks(books);

  // const onClickItems = (item: any) => {
  //   setOpenMenu(false);
  //   if (item.key === 'my_orders') {
  //     navigation.navigate('MyOrders');
  //   } else if (item.key === 'my_wishlist') {
  //     navigation.navigate('MyWishList');
  //   }
  // };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = filteredBooks.filter(book =>
      book.title.toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredBooks(filtered);
  };

  const renderItem = ({item}: {item: any}) => {
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity style={styles.item}>
          <FastImage source={{uri: item.source}} style={styles.image} />
          <TouchableOpacity
            onPress={() => {
              setItemId(item.id);
              setIsFavourite(!isFavourite);
            }}
            style={[
              styles.favoriteButton,
              {
                backgroundColor:
                  item.id === itemId && isFavourite
                    ? Colors.green
                    : Colors.white,
              },
            ]}>
            <Octicons name="heart" size={18} color={Colors.black} />
          </TouchableOpacity>
        </TouchableOpacity>
        <View style={styles.itemDetails}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.author}>{item.author}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>₹{item.price}</Text>
            <Text style={styles.actualPrice}>₹{item.actual_price}</Text>
            <Text style={styles.discount}>{item.discount_percent}</Text>
          </View>
        </View>
      </View>
    );
  };

  const screen_height = Dimensions.get('window').height;
  const screen_width = Dimensions.get('screen').width;

  return (
    <View className="flex flex-1 bg-bgGrayColor">
      <View
        className={`flex flex-row items-center px-3 py-5`}
        style={{backgroundColor: Colors.orangeColor}}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.goBack();
          }}>
          <MaterialIcons name="arrow-back" size={30} color={Colors.white} />
        </TouchableOpacity>
        <View>
          <Text className="text-whiteColor text-[20px] leading-8 tracking-[0.44px] font-normal ml-2 uppercase">
            {headerItem}
          </Text>
        </View>
      </View>
      <View className="flex flex-auto">
        <View className={`w-full bg-bgGrayColor `} style={{height: '100%'}}>
          <View style={styles.searchContainer}>
            <FontAwesome
              name="search"
              size={22}
              color={Colors.textColor}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search books..."
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>
          <FlatList
            numColumns={2}
            data={filteredBooks}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  //   item: {
  //     flexDirection: 'row',
  //     alignItems: 'center',
  //     padding: 20,
  //     borderBottomWidth: 1,
  //     borderBottomColor: '#ccc',
  //     fontSize: 16,
  //     color: 'blue',
  //   },
  //   image: {
  //     width: 50,
  //     height: 50,
  //     marginRight: 10,
  //     borderRadius: 50,
  //     backgroundColor: 'black',
  //   },
  searchInput: {
    // borderWidth: 1,
    // borderColor: '#ccc',
    // borderRadius: 5,
    // padding: 10,
    // marginBottom: 10,
    // position: 'absolute',
    // top: 0,
    // zIndex: 1,
    backgroundColor: '#fff',
    flex: 1,
    // optional: add a background color to the search bar
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    paddingLeft: 30,
    paddingBottom: 0,
    backgroundColor: '#fff',
    width: SCREEN_WIDTH,
  },
  searchIcon: {
    marginRight: 0,
    position: 'absolute',
    left: 10,
    zIndex: 99,
    borderColor: '#ccc',
  },

  itemContainer: {
    flex: 1,
    width: 170,
    height: 200,
    marginVertical: 5,
    marginHorizontal: 5,
    backgroundColor: Colors.white,
    elevation: 5,
    padding: 15,
  },
  item: {
    width: '100%',
    height: '60%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    position: 'absolute',
    top: 0,
    right: 0,
    borderRadius: 15,
  },
  itemDetails: {
    marginTop: 4,
    paddingHorizontal: 1,
  },
  title: {
    fontSize: 14,
    color: Colors.blackColor50,
    fontWeight: 'bold',
  },
  author: {
    fontSize: 10,
    color: Colors.blackColor50,
    fontWeight: 'normal',
  },
  priceContainer: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 14,
    color: Colors.black,
    fontWeight: 'bold',
  },
  actualPrice: {
    fontSize: 10,
    color: Colors.blackColor50,
    fontWeight: 'normal',
    marginLeft: 1,
  },
  discount: {
    fontSize: 10,
    color: Colors.green,
    fontWeight: 'normal',
    marginLeft: 1,
  },
});

export default BookItem;
