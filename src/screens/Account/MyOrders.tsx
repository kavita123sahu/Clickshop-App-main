import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CommonHeader from '../../component/CommonHeader';
import { Fonts } from '../../common/Fonts';
import * as _ORDER_SERVICE from '../../services/OrderService';
import { BaseUrl } from '../../config/Key';
import { Utils } from '../../common/Utils';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const screenWidth = Dimensions.get('window').width;

interface Order {
    id: string;
    order_code: string;
    date: string;
    payment_type: string;
    payment_status: string;
    order_details: OrderDetail[];
    unit_price: number;
    discount: number
}

interface OrderDetail {
    product_name: string;
    product_image: string;
    author: string;
    price: number;
    delivery_status: string;
    unit_price: number;
    discount: number
}

const MyOrders = (props: any) => {
    const { navigation } = props;
    const isFocused = useIsFocused();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [loader, setLoader] = useState<boolean>(true);
    const [orders, setOrders] = useState<Order[]>([]);
    const [sortBy, setSortBy] = useState<'date' | 'status'>('date');
    const [isToken, setIsToken] = useState(true);

    useEffect(() => { getOrderHistory(); }, [isFocused]);

    const getOrderHistory = async (): Promise<void> => {
        try {
            setLoader(true);
            const token = await Utils.getData('_TOKEN');
            if (token) {
                setIsToken(true);
                const result: any = await _ORDER_SERVICE.get_order_history();
                if (result.status_code === 200) {
                    setOrders(result?.data);
                }
            } else {
                setIsToken(false);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoader(false);
        }
    };

    const filteredOrders = orders.filter((order) =>
        order.payment_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.order_code.includes(searchTerm) ||
        order.order_details.some(detail =>
            detail.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            detail.delivery_status.toLowerCase().includes(searchTerm.toLowerCase())
        )
    ).sort((a, b) => {
        if (sortBy === 'date') {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        } else {
            return a.payment_status.localeCompare(b.payment_status);
        }
    });

    const capitalizeFirstLetter = (str: string): string => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const renderOrderItem = ({ item }: { item: Order }) => {
        return (
            <View style={styles.orderItem} className='border border-primaryColor'>
                {item.order_details.map((product, index) => (
                    <View
                        key={index}
                        style={[
                            styles.productContainer,
                            { paddingTop: 10 },
                            index !== item.order_details.length - 1 && { borderBottomWidth: 1, borderBottomColor: '#E0E0E0', paddingBottom: 10, borderStyle: 'dashed' }, // Add border with bottom padding
                        ]}
                    >
                        <FastImage
                            style={styles.productImage}
                            source={{ uri: `${BaseUrl.base}public/${product.product_image}` }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                        <View style={styles.productInfo} className='space-y-1'>
                            <Text style={styles.bookTitle}>{product.product_name}</Text>
                            <Text style={styles.authorText}>{product.author}</Text>
                            <View className='flex flex-row items-center'>
                                <Text className='font-LexendBold text-sm text-blackColor'>₹{product?.price?.toFixed(2)}</Text>
                                <Text className='font-LexendRegular text-xs text-gray-400 ml-1 line-through'>₹{product?.unit_price}</Text>
                                <Text className='font-LexendRegular text-xs text-green-500 ml-1'>{product?.discount}%</Text>
                            </View>
                            <View style={styles.statusContainer}>
                                <Icon name={getStatusIcon(product.delivery_status)} size={16} color={getStatusColor(product.delivery_status)} />
                                <Text style={[styles.statusText, { color: getStatusColor(product.delivery_status) }]}>
                                    {capitalizeFirstLetter(product?.delivery_status == "on_delivery" ? "Out for delivery" : product.delivery_status.replaceAll("_", " "))}
                                </Text>
                            </View>
                        </View>
                    </View>
                ))}
                <View style={styles.orderFooter} className='border-dashed border-primaryColor'>
                    <Text style={styles.orderId}>Order ID :
                        <Text className='text-blackColor'>{" " + item.order_code}</Text>
                    </Text>
                </View>
                <View className='flex flex-row justify-between items-center mt-3'>
                    <Text style={styles.orderDate}>
                        Order Date :
                        <Text className='text-blackColor'>{" " + moment(item?.date).format('DD MMM YYYY')}</Text>
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('OrderDetailPage', { order: item, product: item.order_details[0] })}
                        style={styles.detailsButton}
                    >
                        <Text style={styles.detailsButtonText}>View Details</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };



    const getStatusColor = (status: string): string => {
        switch (status.toLowerCase()) {
            case 'delivered': return '#4CAF50';
            case 'shipped': return '#2196F3';
            case 'pending': return '#FFC107';
            case 'cancelled': return '#F44336';
            default: return '#757575';
        }
    };

    const getStatusIcon = (status: string): string => {
        switch (status.toLowerCase()) {
            case 'delivered': return 'truck-delivery-outline';
            case 'shipped': return 'truck-delivery';
            case 'pending': return 'progress-clock';
            case 'cancelled': return 'cancel';
            default: return 'information-outline';
        }
    };

    const onClickRegister = () => {
        navigation.replace('AuthStack', { screen: 'Login' })
    }

    const EmptyOrdersList: React.FC = () => (
        <View style={styles.emptyContainer}>
            <LottieView
                source={require('../../assets/animations/emptyorder.json')}
                autoPlay
                loop
                // style={styles.lottie}
                style={{ width: screenWidth <= 360 ? 200 : 400, height: screenWidth <= 360 ? 200 : 400 }}
            />
            <Text style={styles.emptyText}>No Orders Yet 😢!</Text>
            <Text style={styles.emptySubText}>Your order history will appear here</Text>
            <TouchableOpacity onPress={() => navigation.replace('HomeStack', { screen: 'TabStack' })} style={styles.startShoppingButton}>
                <Text style={styles.startShoppingText}>START SHOPPING</Text>
            </TouchableOpacity>
        </View>
    );

    const NoSearchResults: React.FC = () => (
        <View style={[styles.emptyContainer, { marginTop: '30%' }]}>
            <Text style={styles.emptyText}>No Orders Found!</Text>
            <Text style={styles.emptySubText}>Try searching with different keywords</Text>
        </View>
    );

    const renderEmptyComponent = () => {
        if (orders.length === 0) {
            return <EmptyOrdersList />;
        }
        return <NoSearchResults />;
    };

    return (
        <SafeAreaView style={styles.container}>
            <CommonHeader title='My Orders' navigation={navigation} isCartIcon={false} />
            <View style={styles.contentContainer}>
                {
                    orders.length > 0 && (
                        <>
                            <View style={styles.searchContainer}>
                                <Icon name="magnify" size={20} color="#757575" style={styles.searchIcon} />
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Search orders..."
                                    value={searchTerm}
                                    onChangeText={setSearchTerm}
                                    placeholderTextColor="#757575"
                                />
                            </View>
                            {/* <View style={styles.sortContainer}>
                                <Text style={styles.sortLabel}>Sort by:</Text>
                                <TouchableOpacity onPress={() => setSortBy('date')} style={[styles.sortButton, sortBy === 'date' && styles.sortButtonActive]}>
                                    <Text style={[styles.sortButtonText, sortBy === 'date' && styles.sortButtonTextActive]}>Date</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setSortBy('status')} style={[styles.sortButton, sortBy === 'status' && styles.sortButtonActive]}>
                                    <Text style={[styles.sortButtonText, sortBy === 'status' && styles.sortButtonTextActive]}>Status</Text>
                                </TouchableOpacity>
                            </View> */}
                        </>
                    )
                }
                {

                    !isToken ?
                        <View className='flex flex-1 justify-center items-center'>
                            <Text className='text-base text-left text-newTextColor font-LexendRegular'>Please login to see your Whishlist</Text>
                            <Text onPress={onClickRegister} className='text-blue-300 text-center font-LexendMedium text-base'>{"Click here to login"}</Text>
                        </View>
                        :
                        loader ? (
                            <View style={styles.loaderContainer}>
                                <ActivityIndicator size="large" color="#FF5722" />
                            </View>
                        ) : (
                            <FlatList
                                data={filteredOrders}
                                renderItem={renderOrderItem}
                                ListEmptyComponent={renderEmptyComponent}
                                keyExtractor={(item) => item.id.toString()}
                                contentContainerStyle={styles.orderList}
                                showsVerticalScrollIndicator={false}
                            />
                        )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    contentContainer: {
        flex: 1,
        padding: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 40,
        color: '#212121',
        fontFamily: Fonts.LexendRegular,
    },
    sortContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    sortLabel: {
        fontFamily: Fonts.LexendRegular,
        color: '#757575',
        marginRight: 8,
    },
    sortButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: '#E0E0E0',
        marginRight: 8,
    },
    sortButtonActive: {
        backgroundColor: '#FF5722',
    },
    sortButtonText: {
        fontFamily: Fonts.LexendMedium,
        color: '#757575',
    },
    sortButtonTextActive: {
        color: '#FFFFFF',
    },
    orderList: {
        paddingBottom: 16,
    },
    orderItem: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 10,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    productContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    productImage: {
        width: 80,
        height: 120,
        borderRadius: 8,
    },
    productInfo: {
        flex: 1,
        marginLeft: 12,
    },
    bookTitle: {
        fontSize: 14,
        color: '#212121',
        fontFamily: Fonts.LexendMedium,
        marginBottom: 4,
    },
    authorText: {
        color: '#757575',
        fontFamily: Fonts.LexendRegular,
        marginBottom: 4,
    },
    priceText: {
        color: '#FF5722',
        fontFamily: Fonts.LexendMedium,
        marginBottom: 4,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusText: {
        marginLeft: 4,
        fontFamily: Fonts.LexendMedium,
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
    },
    orderId: {
        color: '#757575',
        fontFamily: Fonts.LexendRegular,
        fontSize: 12
    },
    orderDate: {
        color: '#757575',
        fontFamily: Fonts.LexendRegular,
        fontSize: 12
    },
    detailsButton: {
        backgroundColor: '#FF5722',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignSelf: 'flex-end',
    },
    detailsButtonText: {
        color: '#FFFFFF',
        fontFamily: Fonts.LexendMedium,
        fontSize: 12
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '30%'
    },
    lottie: {
        width: SCREEN_WIDTH * 0.6,
        height: SCREEN_WIDTH * 0.6,
    },
    emptyText: {
        color: '#212121',
        fontFamily: Fonts.LexendMedium,
        fontSize: 18,
        marginTop: 16,
    },
    emptySubText: {
        color: '#757575',
        fontFamily: Fonts.LexendRegular,
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
    },
    startShoppingButton: {
        backgroundColor: '#FF5722',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginTop: 24,
    },
    startShoppingText: {
        color: '#FFFFFF',
        fontFamily: Fonts.LexendMedium,
        fontSize: 14,
    }
});

export default MyOrders;