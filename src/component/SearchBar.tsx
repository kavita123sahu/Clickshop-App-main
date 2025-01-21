import { View, TextInput } from 'react-native';
import React from 'react';
import { Colors } from '../common/Colors';
import Fontisto from 'react-native-vector-icons/Fontisto';

interface SearchComponentProps {
    searchText: string;
    onChangeText: (text: string) => void;
    autoFocus: boolean
}

const SearchBar: React.FC<SearchComponentProps> = ({ searchText, onChangeText, autoFocus }) => {
    return (
        <View className='flex w-full justify-center items-center mt-3'>
            <View className='flex w-[100%] justify-center items-center relative'>
                <TextInput
                    className='w-full h-[45px] rounded-[15px] text-fieldTextColor leading-6 pl-10 bg-bgcolor border-[1px] border-borderColor font-LexendRegular'
                    placeholder='Search your best books'
                    value={searchText}
                    onChangeText={(e) => onChangeText(e)}
                    placeholderTextColor={Colors.blackColor50}
                    autoComplete='off'
                    autoFocus={autoFocus}
                    selectionColor={Colors.greyBorder}
                />
                <View className='absolute left-3'>
                    <Fontisto name="search" size={18} color={Colors.blackColor50} />
                </View>
            </View>
        </View>
    );
};

export default SearchBar;
