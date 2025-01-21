import { View, Text, FlatList, ListRenderItem } from 'react-native';
import React, { useState } from 'react';
import FastImage from 'react-native-fast-image';

interface Author {
    id: string;
    image: string;
}

interface TopAuthorProps {
    navigation: any
}

const TopAuthor: React.FC<TopAuthorProps> = ({ navigation }) => {
    const [Author, setAuthor] = useState<Author[]>([
        { id: '0', image: 'https://truleague-staging.s3.ap-south-1.amazonaws.com/user/profile_image_1702988875242.png' },
        { id: '1', image: 'https://w7.pngwing.com/pngs/484/293/png-transparent-elon-musk-thumbnail.png' },
        { id: '2', image: 'https://truleague-staging.s3.ap-south-1.amazonaws.com/user/profile_image_1702988875242.png' },
        { id: '3', image: 'https://w7.pngwing.com/pngs/484/293/png-transparent-elon-musk-thumbnail.png' },
        { id: '4', image: 'https://truleague-staging.s3.ap-south-1.amazonaws.com/user/profile_image_1702988875242.png' },
        { id: '5', image: 'https://w7.pngwing.com/pngs/484/293/png-transparent-elon-musk-thumbnail.png' },
        { id: '6', image: 'https://truleague-staging.s3.ap-south-1.amazonaws.com/user/profile_image_1702988875242.png' },
        { id: '7', image: 'https://w7.pngwing.com/pngs/484/293/png-transparent-elon-musk-thumbnail.png' },
        { id: '8', image: 'https://truleague-staging.s3.ap-south-1.amazonaws.com/user/profile_image_1702988875242.png' },
    ]);

    const renderAuthors: ListRenderItem<Author> = ({ item }) => {
        return (
            <View className='w-[60px] h-[60px] justify-center items-center rounded-full mx-2'>
                <FastImage
                    source={{ uri: item.image }}
                    resizeMode='cover'
                    className='w-full h-full rounded-full'
                />
            </View>
        );
    };

    return (
        <View className='flex my-4'>
            <View className='mb-2 px-4'>
                <Text className='text-[16px] text-newTextColor font-LexendMedium'>Top Authors</Text>
            </View>
            <FlatList
                showsHorizontalScrollIndicator={false}
                horizontal
                data={Author}
                renderItem={renderAuthors}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
};

export default TopAuthor;
