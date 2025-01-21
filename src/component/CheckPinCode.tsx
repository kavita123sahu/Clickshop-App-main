import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { Colors } from '../common/Colors';
import { debounce } from 'lodash';
import { Checkbox } from 'react-native-paper';

interface PincodeItem {
    id: string;
    office_name: string;
}

interface DeliveryCharge {
    id: number;
    min_amount: number;
    max_amount: number;
    ship_cost: number;
    delivery_type: number;
    note: string | null;
    config_id: number;
    ship_type: string;
    basic_note: string;
    premium_note: string;
    cod: boolean;
}

const CheckPinCode = (props: any) => {
    const { totalAmt, paddinHorizonatl, totalWeight } = props;
    const [pincode, setPincode] = useState<string>('');
    const [suggestions, setSuggestions] = useState<PincodeItem[]>([]);
    const [selectedPincodeId, setSelectedPincodeId] = useState<string | null>(null);
    const [deliverStatusData, setDeliveryStatusData] = useState<any>();
    const [basicDelivery, setBasicDelivery] = useState<any>();
    const [premiumDelivery, setPremiumDelivery] = useState<any>();
    const [loader, setLoader] = useState(false);
    const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);

    const fetchSuggestions = async (query: string) => {
        try {
            if (query) {
                const response = await fetch(`https://clikshop.co.in/api/v3/search-pincode?query=${query}`);
                const data = await response.json();
                setSuggestions(data);
                setShowDropdown(true);
            } else {
                setSuggestions([]);
                setShowDropdown(false);
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

    useEffect(() => {
        if (pincode.length > 0) {
            debouncedFetchSuggestions(pincode);
        } else {
            setSuggestions([]);
            setShowDropdown(false);
        }
    }, [pincode]);

    const onChangeText = (text: string) => {
        setPincode(text);
        setSelectedPincodeId(null);
    };

    const onSelectPincode = (item: PincodeItem) => {
        setPincode(item.office_name);
        setSelectedPincodeId(item.id);
        setSuggestions([]);
        setShowDropdown(false);
        checkDeliveryStatus(item.id);
    };

    const checkDeliveryStatus = async (pincodeId: string) => {
        try {
            setLoader(true);
            const result: any = await fetch(`https://clikshop.co.in/api/v3/delivery-charges?pincode_id=${pincodeId}`);
            const d = await result.json();
            const { data, status_code } = d;
            console.log(d)
            if (status_code === 200) {
                const comparable_value = data?.shipping_type === 'amount_based' ? totalAmt : totalWeight;
                setDeliveryStatusData(data?.shipping_amounts);
                calculateCharges(comparable_value, data?.shipping_amounts);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoader(false);
        }
    };

    function calculateCharges(amount: number, data: any): void {
        const basicCharge = getDeliveryCharge(amount, 1, data);
        const premiumCharge = getDeliveryCharge(amount, 2, data);
        if (basicCharge) {
            setBasicDelivery(basicCharge);
        } else {
            console.log("\nNo match found for Basic Delivery.");
        }
        if (premiumCharge) {
            setPremiumDelivery(premiumCharge)
        } else {
            console.log("\nNo match found for Premium Delivery.");
        }
    }

    function getDeliveryCharge(amount: number, deliveryType: number, DData: any): DeliveryCharge | undefined {
        return DData.find((item: any) =>
            item.delivery_type === deliveryType &&
            item.min_amount <= amount &&
            item.max_amount >= amount
        );
    }

    return (
        <View className="mt-3" style={{ paddingHorizontal: paddinHorizonatl }}>
            <View>
                <Text className="text-textColor text-[16px] font-normal tracking-wider leading-6 font-LexendMedium">
                    Check delivery status
                </Text>
            </View>
            <View className="relative">
                <View className="flex flex-row px-2 justify-between items-center border-[1px] border-borderColor w-full h-[50px] rounded-[8px] mt-1 bg-whiteColor">
                    <TextInput
                        className="rounded-[8px] h-full w-[70%] text-textColor font-LexendRegular"
                        value={pincode}
                        onChangeText={onChangeText}
                        placeholder="Enter Pin Code"
                        placeholderTextColor={Colors.blackColor50}
                        maxLength={6}
                        keyboardType='number-pad'
                    />
                </View>
                {showDropdown && suggestions.length > 0 && (
                    <View className="absolute top-[55px] left-0 right-0 z-10 border border-gray-200 rounded-[8px] bg-white" style={{ maxHeight: 200 }}>
                        <FlatList
                            data={suggestions}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => onSelectPincode(item)}
                                    className="px-2 py-3 border-b border-gray-200"
                                >
                                    <Text className="text-textColor font-LexendRegular">{item.office_name}</Text>
                                </TouchableOpacity>
                            )}
                            nestedScrollEnabled={true}
                            keyboardShouldPersistTaps="handled"
                        />
                    </View>
                )}
            </View>
            {loader ? (
                <View className="mt-3">
                    <ActivityIndicator size={'small'} color={Colors.primaryColor} />
                </View>
            ) : (
                <View>
                    {basicDelivery && (
                        <View className='mt-3'>
                            <View className='flex flex-row items-center'>
                                {/* <Checkbox
                                    status={selectedDelivery === 'basic' ? 'checked' : 'unchecked'}
                                    onPress={() => { setSelectedDelivery('basic'); }}
                                /> */}
                                <Text className='text-blackColor font-LexendMedium text-base'>
                                    Basic delivery :
                                </Text>
                            </View>
                            <Text className='text-newTextColor font-LexendRegular text-sm'>
                                Shipping Cost : ₹{basicDelivery?.ship_cost}
                            </Text>
                            <Text className='text-newTextColor font-LexendRegular text-sm'>
                                Delivery Note: {basicDelivery.basic_note}
                            </Text>
                        </View>
                    )}

                    {premiumDelivery && (
                        <View className='mt-4'>
                            <View className='flex flex-row items-center'>
                                {/* <Checkbox
                                    status={selectedDelivery === 'premium' ? 'checked' : 'unchecked'}
                                    onPress={() => { setSelectedDelivery('premium'); }}
                                /> */}
                                <Text className='text-blackColor font-LexendMedium text-base'>
                                    Premium delivery :
                                </Text>
                            </View>
                            <Text className='text-newTextColor font-LexendRegular text-sm'>
                                Shipping Cost : ₹{premiumDelivery?.ship_cost}
                            </Text>
                            <Text className='text-newTextColor font-LexendRegular text-sm'>
                                Delivery Note: {premiumDelivery.premium_note}
                            </Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        width: '100%',
        position: 'relative',
    },
    dropdownButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    dropdown: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ccc',
        maxHeight: 200,
        opacity: 999
    },
    searchInput: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    item: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default CheckPinCode;