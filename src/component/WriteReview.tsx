import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import CommonHeader from './CommonHeader';
import { Colors } from '../common/Colors';
import { Rating } from 'react-native-elements';
import * as _RATING_SERVICE from '../services/ProductDetailService';
import { Utils } from '../common/Utils';
import Toast from 'react-native-toast-message';
import { Fonts } from '../common/Fonts';

const WriteReview = (props: any) => {
    const { navigation } = props;
    const { productID } = props.route.params;
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(Number);
    const [loader, setLoader] = useState(false);

    const ratingCompleted = (rating: number) => {
        setRating(rating);
    };

    const onSubmitRating = async () => {
        try {
            setLoader(true);
            const userDetails = await Utils.getData('_USER_DETAILS');
            const dataToSend = { product_id: productID, user_id: userDetails?.id, rating: rating, comment: review }
            const result: any = await _RATING_SERVICE.postReview(dataToSend);
            const { status, message = "" } = result;
            if (status === true) {
                navigation.goBack();
                Toast.show({
                    // text1: 'Success!',
                    text2: message,
                    type: 'success',
                    position: 'bottom',
                    text1Style: { fontSize: 16, fontFamily: Fonts.LexendBold, color: 'green' },
                    text2Style: { fontSize: 12, fontFamily: Fonts.LexendMedium, color: 'green' }
                });
                setLoader(false);
            } else {
                Toast.show({
                    text1: 'Error!',
                    text2: message,
                    type: 'error',
                    position: 'bottom',
                    text1Style: { fontSize: 16, fontFamily: Fonts.LexendBold, color: 'red' },
                    text2Style: { fontSize: 12, fontFamily: Fonts.LexendMedium, color: 'red' }
                });
                setLoader(false);
            }

        } catch (error) {
            console.log(error);
        }
    }


    return (
        <View className="flex flex-1 bg-whiteColor">
            <CommonHeader title={'Add your review'} navigation={navigation} isCartIcon={false} />
            <View className='p-5'>

                <Rating
                    showRating
                    imageSize={30}
                    onFinishRating={ratingCompleted}
                    style={{ paddingVertical: 20 }}
                    startingValue={0}
                />

                <Text className='text-newTextColor font-LexendMedium text-base'>Tell us about the book</Text>

                <View className='mt-4'>
                    <TextInput
                        value={review}
                        onChangeText={setReview}
                        placeholder='want to share more?Write here...'
                        placeholderTextColor={Colors.placeholderColor}
                        className='border border-borderColor rounded-md p-3 min-h-[200px] text-newTextColor font-LexendRegular align-top'
                        multiline
                        style={{ alignItems: 'flex-start', textAlign: 'left', textAlignVertical: 'top' }}
                    />
                </View>

                <View className='flex items-start mt-4 w-full'>
                    {
                        loader ?
                            <ActivityIndicator size={'large'} color={Colors.orangeColor} />
                            :
                            <TouchableOpacity disabled={!review} onPress={onSubmitRating} className={`px-4 py-2 bg-orangeColor rounded-md ${!review ? 'opacity-50' : ''}`}>
                                <Text className='text-whiteColor font-LexendRegular text-sm'>Submit</Text>
                            </TouchableOpacity>
                    }
                </View>
            </View>
        </View>
    )
}

export default WriteReview