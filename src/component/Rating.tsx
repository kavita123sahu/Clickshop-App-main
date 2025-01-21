import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'
import { Colors } from '../common/Colors';
import { Rating } from 'react-native-elements';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import CustomStarRating from './CustomStarRating';


const RatingPage = (props: any) => {
    const { reviewData, navigation, productID } = props;

    const onReviewPress = () => {
        navigation.navigate('WriteReview', { productID: productID })
    }

    const renderCards = ({ item, index }: { item: any, index: number }) => {
        return (
            <View key={index} style={styles.cardContainer} className='mt-6'>
                <View style={styles.headerContainer}>
                    {/* <FastImage source={{ uri: avatar }} style={styles.avatar} /> */}
                    <FontAwesome5 size={40} name='user-alt' color={Colors.newTextColor} />
                    <View style={[styles.userInfo, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: 20 }]}>
                        <Text className='font-Lexendlight' style={styles.userName}>{item?.user?.name}</Text>
                        <View className='flex flex-row items-center mt-1'>
                            <CustomStarRating
                                rating={item?.rating}
                                maxRating={5}
                                starSize={15}
                            />
                        </View>
                    </View>
                </View>
                <Text className='font-Lexendlight' style={styles.reviewText}>{item?.review}</Text>
                <Text className='font-Lexendlight' style={styles.dateText}>{item?.time}</Text>
            </View>
        )
    }

    return (
        <View className='px-5'>
            <View className='flex flex-row justify-between items-center w-full mt-3'>
                <Text className='text-newTextColor font-LexendRegular text-sm'>{`${reviewData?.length} Reviews`}</Text>
                <TouchableOpacity onPress={onReviewPress} className='flex flex-row items-center border-b border-newTextColor justify-center'>
                    <Text className='text-newTextColor font-LexendRegular text-sm'>{'Write a review'}</Text>
                    <EvilIcons name='pencil' size={16} color={Colors.newTextColor} />
                </TouchableOpacity>
            </View>
            {
                reviewData.length > 0 ?
                    <FlatList
                        data={reviewData}
                        renderItem={renderCards}
                    />
                    :
                    <View className='mt-5'>
                        <Text className='text-black text-[15px] font-Lexendlight'>No review available for this book</Text>
                    </View>
            }
        </View>
    )
}
const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.newTextColor,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        marginLeft: 4,
        fontSize: 14,
        color: Colors.blackColor50,
    },
    reviewText: {
        fontSize: 14,
        color: Colors.newTextColor,
        marginBottom: 8,
    },
    dateText: {
        fontSize: 12,
        color: Colors.blackColor50,
    },
});

export default RatingPage