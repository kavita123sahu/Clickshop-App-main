import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import CommonHeader from '../../component/CommonHeader';
import { Colors } from '../../common/Colors';
import { Fonts } from '../../common/Fonts';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { EmailValidator } from '../../common/Validator';
import * as _ADDRESS_SERVICE from '../../services/AddressServices';
import Toast from 'react-native-toast-message';
import * as _PROFILE_SERVICES from '../../services/ProfileServices';

const Address = (props: any) => {
    const { navigation } = props;
    const { isEdit, addressID } = props.route.params;
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState(String);
    const [email, setEmail] = useState('');
    const [houseNo, setHouseNo] = useState('');
    const [locality, setLocality] = useState('');
    const [landmark, setLandmark] = useState('');
    const [pincode, setPincode] = useState(String);
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [addressType, setAddressType] = useState(Number)
    const [emailError, setEmailError] = useState(false);
    const [btnLoader, setBtnLoader] = useState(false);
    const [other, setOther] = useState(String)
    const [userDetails, setUserDetails] = useState<any>();
    const [isDefault, setIsDefault] = useState(true);
    const [pincodeSuggestions, setPincodeSuggestions] = useState<any[]>([]);
    const [showPincodeDropdown, setShowPincodeDropdown] = useState(false);
    const [selectedPincodeId, setSelectedPincodeId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const ADDRESS_TYPE = [{ id: 0, title: 'Home' }, { id: 1, title: 'Work' }, { id: 2, title: 'Other' }]

    useEffect(() => {
        if (isEdit) {
            getAddressByID();
        }
        getUserDetails();
    }, [])


    const fetchPincodeSuggestions = async (query: string) => {
        try {
            if (query.length >= 3) {
                const response = await fetch(`https://clikshop.co.in/api/v3/search-pincode?query=${query}`);
                const data = await response.json();
                setPincodeSuggestions(data);
                setShowPincodeDropdown(true);
            } else {
                setPincodeSuggestions([]);
                setShowPincodeDropdown(false);
            }
        } catch (error) {
            console.error('Error fetching pincode suggestions:', error);
        }
    };

    const onChangePincode = (text: string) => {
        setPincode(text);
        fetchPincodeSuggestions(text);
    };

    const onSelectPincode = (item: any) => {
        setPincode(item.office_name);
        setSelectedPincodeId(item.id);
        setShowPincodeDropdown(false);
    };

    const renderPincodeSuggestion = ({ item }: { item: any }) => (
        <TouchableOpacity
            onPress={() => onSelectPincode(item)}
            style={styles.suggestionItem}
        >
            <Text style={styles.suggestionText}>{item.office_name} - {item.pincode}</Text>
        </TouchableOpacity>
    );

    const getAddressByID = async () => {
        try {
            setIsLoading(true);
            const result: any = await _ADDRESS_SERVICE.getAddressByID(addressID);
            const { status_code, data } = result;
            if (status_code === 200) {
                setHouseNo(data?.address);
                setPhoneNumber(data?.phone);
                setLocality(data?.locality);
                setLandmark(data?.landmark);
                setCity(data?.city);
                setState(data?.state)
                setPincode(data?.pincode?.pincode);
                setSelectedPincodeId(data?.postal_code)
                setIsDefault(data?.set_default === 1 ? true : false)
                setName(data?.name);
                setEmail(data?.email);
                setIsLoading(false);
            } else {
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    }

    const getUserDetails = async () => {
        try {
            // const user = await Utils.getData('_USER_DETAILS');
            // setUserDetails(user);
            const result: any = await _PROFILE_SERVICES.get_user();
            const { status_code, data, message = "" } = result;

            if (status_code === 200) {
                setUserDetails(data);
            } else {
                Toast.show({
                    text1: 'Error!',
                    text2: message,
                    type: 'error',
                    position: 'bottom',
                    text1Style: { fontSize: 16, fontFamily: Fonts.LexendBold, color: 'red' },
                    text2Style: { fontSize: 12, fontFamily: Fonts.LexendMedium, color: 'red' }
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleUpdateAddress = async () => {
        setBtnLoader(true);
        try {
            const validEmail = EmailValidator(email);
            const dataToSend = {
                address: houseNo,
                locality: locality,
                landmark: landmark,
                city: city,
                state: state,
                postal_code: selectedPincodeId,
                phone: phoneNumber,
                set_default: isDefault === true ? 1 : 0,
                address_type: addressType === 0 ? 'home' : addressType === 1 ? 'work' : 'other',
                name: name,
                email: email
            }
            console.log(dataToSend);

            const result: any = await _ADDRESS_SERVICE.updateAddress(dataToSend, addressID);

            const { status_code, data, message = "" } = result;
            if (status_code === 200) {
                Toast.show({
                    // text1: 'Success!',
                    text2: message,
                    type: 'success',
                    position: 'bottom',
                    text1Style: { fontSize: 16, fontFamily: Fonts.LexendBold, color: 'green' },
                    text2Style: { fontSize: 12, fontFamily: Fonts.LexendMedium, color: 'green' }
                });
                navigation.navigate('Cart');
                setBtnLoader(false);
            } else {
                Toast.show({
                    text1: 'Error!',
                    text2: message,
                    type: 'error',
                    position: 'bottom',
                    text1Style: { fontSize: 16, fontFamily: Fonts.LexendBold, color: 'red' },
                    text2Style: { fontSize: 12, fontFamily: Fonts.LexendMedium, color: 'red' }
                });
                setBtnLoader(false);
            }
        } catch (error) {
            console.log("SAVE ADDRESS ERROR:", error);
        }
    };

    const handleSaveAddress = async () => {
        setBtnLoader(true);
        try {
            const validEmail = EmailValidator(email);
            const dataToSend = {
                address: houseNo,
                locality: locality,
                city: city,
                state: state,
                postal_code: selectedPincodeId,
                phone: userDetails?.phone,
                set_default: isDefault == true ? 1 : 0,
                address_type: addressType === 0 ? 'home' : addressType === 1 ? 'work' : 'other',
                name: name,
                email: email
            }
            const result: any = await _ADDRESS_SERVICE.postAddress(dataToSend);
            const { status_code, data, message = "" } = result;
            if (status_code === 201) {
                Toast.show({
                    // text1: 'Success!',
                    text2: message,
                    type: 'success',
                    position: 'bottom',
                    text1Style: { fontSize: 16, fontFamily: Fonts.LexendBold, color: 'green' },
                    text2Style: { fontSize: 12, fontFamily: Fonts.LexendMedium, color: 'green' }
                });
                navigation.navigate('Cart');
                setBtnLoader(false);
            } else {
                Toast.show({
                    // text1: 'Success!',
                    text2: message,
                    type: 'success',
                    position: 'bottom',
                    text1Style: { fontSize: 16, fontFamily: Fonts.LexendBold, color: 'green' },
                    text2Style: { fontSize: 12, fontFamily: Fonts.LexendMedium, color: 'green' }
                });
                setBtnLoader(false);
            }

        } catch (error) {
            console.log("SAVE ADDRESS ERROR:", error);
        }
    };

    const renderAddressType = ({ item }: { item: any }) => {
        return (
            <TouchableOpacity onPress={() => { setAddressType(item.id); setOther('') }} className={`w-[90px] h-10 px-2 border-[1px] rounded-[6px] flex justify-center items-center mr-3 flex-row ${addressType === item.id ? 'bg-blockColor border-orangeColor' : 'bg-bgcolor border-borderColor'}`}>
                {
                    addressType === item.id ?
                        <MaterialCommunityIcons name='checkbox-marked-circle' size={16} color={Colors.orangeColor} />
                        :
                        <MaterialCommunityIcons name='checkbox-blank-circle-outline' size={16} color={Colors.newTextColor} />
                }
                <Text className={`${addressType === item.id ? 'text-orangeColor' : 'text-newTextColor'} text-[14px] font-Lexendlight tracking-wide ml-1`}>{item.title}</Text>
            </TouchableOpacity>
        )
    }

    const onChangeEmail = (e: any) => {
        setEmail(e)
    }

    function notNull(val: any) {
        return (
            val !== null &&
            val !== undefined &&
            val !== 'NULL' &&
            val !== 'null' &&
            val !== 'undefined' &&
            val !== 'UNDEFINED' &&
            (val + '').trim() !== ''
        );
    }

    const isFormValid = () => {
        if (addressType === 2) {
            return notNull(state)
                // && notNull(phoneNumber)
                // && notNull(email)
                && notNull(houseNo)
                && notNull(locality)
                && notNull(pincode)
                && notNull(city)
                // && notNull(state)
                && notNull(other)
        } else {
            return notNull(state)
                // && notNull(phoneNumber)
                // && notNull(email)
                && notNull(houseNo)
                && notNull(locality)
                && notNull(pincode)
                && notNull(city)
            // && notNull(state)
        }
    };

    return (
        <SafeAreaView className='flex flex-1 bg-whiteColor'>
            <CommonHeader title={'Add address'} navigation={props.navigation} isCartIcon={false} />
            {
                isLoading ?
                    <View className='flex flex-1 justify-center items-center'>
                        <ActivityIndicator size={'large'} color={Colors.orangeColor} />
                    </View>
                    :
                    <View className='flex flex-1 px-5 pb-5'>
                        <View className='mt-4'>
                            <Text className='text-[20px] text-newTextColor font-LexendMedium tracking-wide'>Add Address</Text>
                        </View>
                        <View className='mt-1'>
                            <Text className='text-[15px] text-newTextColor font-Lexendlight tracking-wide'>Please complete the address to place your order!!</Text>
                        </View>
                        <View className='mt-3 pb-4'>
                            <Text className='text-[15px] text-newTextColor font-LexendMedium tracking-wide'>Enter Shipping Details</Text>
                        </View>
                        <ScrollView contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
                            <View className='mt-5'>
                                <View className='ml-1'>
                                    <Text className='text-newTextColor text-[14px] font-LexendMedium leading-[24px] mb-1 tracking-wide'>Full name *</Text>
                                </View>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Full Name"
                                    value={name}
                                    onChangeText={setName}
                                    placeholderTextColor={Colors.placeholderColor}
                                />
                                <View className='ml-1'>
                                    <Text className='text-newTextColor text-[14px] font-LexendMedium leading-[24px] mb-1 tracking-wide'>Phone number *</Text>
                                </View>
                                <View className={`flex mt-1 mx-1 px-5 flex-row justify-center border-[1px] bg-bgcolor items-center rounded-[10px] border-borderColor mb-4`}>
                                    <View className='ml-1'>
                                        <Text className='text-newTextColor text-[14px] font-LexendRegular leading-[24px] mb-1 tracking-wide'>+91</Text>
                                    </View>
                                    <View className='h-full w-[1px] bg-borderColor ml-2'></View>
                                    <TextInput
                                        className={`w-full h-[50px] text-[14px] text-newTextColor rounded-[10px] font-LexendRegular leading-4  border-newBorder px-2`}
                                        value={phoneNumber}
                                        placeholder={'Enter phone number'}
                                        placeholderTextColor={Colors.placeholderColor}
                                        onChangeText={(e: any) => { setPhoneNumber(e) }}
                                        autoComplete='off'
                                        keyboardType='number-pad'
                                        maxLength={10}
                                    />
                                </View>
                                <View className='ml-1'>
                                    <Text className='text-newTextColor text-[14px] font-LexendMedium leading-[24px] mb-1 tracking-wide'>Email address *</Text>
                                </View>
                                <TextInput
                                    style={[styles.input, { marginBottom: emailError ? 1 : 16, borderColor: emailError ? Colors.errorColor : Colors.borderColor, color: emailError ? Colors.errorColor : Colors.newTextColor }]}
                                    placeholder="Enter email address"
                                    value={email}
                                    onChangeText={(e) => { onChangeEmail(e) }}
                                    placeholderTextColor={Colors.placeholderColor}
                                />
                                {
                                    emailError ?
                                        <View className='ml-1 mb-4'>
                                            <Text className='text-errorColor text-[12px] font-LexendMedium tracking-wide'>Please enter valid email address</Text>
                                        </View>
                                        :
                                        null
                                }
                                <View className='ml-1'>
                                    <Text className='text-newTextColor text-[14px] font-LexendMedium leading-[24px] mb-1 tracking-wide'>House Number, Building Name *</Text>
                                </View>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter House number,Building Name"
                                    value={houseNo}
                                    onChangeText={(e) => { setHouseNo(e) }}
                                    placeholderTextColor={Colors.placeholderColor}
                                />
                                <View className='ml-1'>
                                    <Text className='text-newTextColor text-[14px] font-LexendMedium leading-[24px] mb-1 tracking-wide'>Locality, Area *</Text>
                                </View>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter locality"
                                    value={locality}
                                    onChangeText={(e) => { setLocality(e) }}
                                    placeholderTextColor={Colors.placeholderColor}
                                />
                                <View className='flex w-[100%]'>
                                    <View className='w-[100%]'>
                                        <View className='ml-1'>
                                            <Text className='text-newTextColor text-[14px] font-LexendMedium leading-[24px] mb-1 tracking-wide'>Landmark(optinal)</Text>
                                        </View>
                                        <TextInput
                                            style={[styles.input, { width: '100%' }]}
                                            placeholder="Landmark"
                                            value={landmark}
                                            onChangeText={(e) => { setLandmark(e) }}
                                            placeholderTextColor={Colors.placeholderColor}
                                        />
                                    </View>
                                    <View className="relative w-[100%]">
                                        <View className='ml-1'>
                                            <Text className='text-newTextColor text-[14px] font-LexendMedium leading-[24px] mb-1 tracking-wide'>Pincode *</Text>
                                        </View>
                                        <TextInput
                                            style={[styles.input, { width: '100%' }]}
                                            placeholder="Pincode"
                                            value={pincode}
                                            onChangeText={onChangePincode}
                                            keyboardType="phone-pad"
                                            placeholderTextColor={Colors.placeholderColor}
                                            maxLength={6}
                                        />
                                        {showPincodeDropdown && pincodeSuggestions.length > 0 && (
                                            <View className="absolute left-0 right-0 z-10 border border-gray-200 rounded-[8px] bg-white" style={{ maxHeight: 200, top: '80%' }}>
                                                <FlatList
                                                    data={pincodeSuggestions}
                                                    renderItem={renderPincodeSuggestion}
                                                    keyExtractor={(item) => item.id.toString()}
                                                    style={{ backgroundColor: 'white' }}
                                                    keyboardShouldPersistTaps="handled"
                                                    nestedScrollEnabled={true}
                                                />
                                            </View>
                                        )}
                                    </View>
                                </View>
                                <View className='flex'>
                                    <View className='w-[100%]'>
                                        <View className='ml-1'>
                                            <Text className='text-newTextColor text-[14px] font-LexendMedium leading-[24px] mb-1 tracking-wide'>City *</Text>
                                        </View>
                                        <TextInput
                                            style={[styles.input, { width: '100%' }]}
                                            placeholder="City"
                                            value={city}
                                            onChangeText={(e) => { setCity(e) }}
                                            placeholderTextColor={Colors.placeholderColor}
                                        />
                                    </View>
                                    <View className='w-[100%]'>
                                        <View className='ml-1'>
                                            <Text className='text-newTextColor text-[14px] font-LexendMedium leading-[24px] mb-1 tracking-wide'>State *</Text>
                                        </View>
                                        <TextInput
                                            style={[styles.input, { width: '100%' }]}
                                            placeholder="State"
                                            value={state}
                                            onChangeText={(e) => { setState(e) }}
                                            keyboardType="default"
                                            placeholderTextColor={Colors.placeholderColor}
                                        />
                                    </View>
                                </View>
                            </View>

                            <View className='mt-5'>
                                <View className=''>
                                    <Text className='text-newTextColor text-[18px] font-LexendMedium tracking-wide'>Address type (optional)</Text>
                                </View>
                                <View className='mt-4'>
                                    <FlatList
                                        horizontal
                                        data={ADDRESS_TYPE}
                                        renderItem={renderAddressType}
                                        keyExtractor={(i: any) => i.id} />
                                </View>
                            </View>
                            {
                                addressType === 2 ?
                                    <>
                                        <View className='ml-1 mt-4'>
                                            <Text className='text-newTextColor text-[14px] font-LexendMedium leading-[24px] mb-1 tracking-wide'>Enter new Tag *</Text>
                                        </View>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Enter new Tag"
                                            value={other}
                                            onChangeText={(e) => { setOther(e) }}
                                            placeholderTextColor={Colors.placeholderColor}
                                            multiline
                                        />
                                    </>
                                    :
                                    null
                            }
                        </ScrollView>
                        <View className=''>
                            <TouchableOpacity onPress={() => { setIsDefault(!isDefault) }} className='my-3 flex flex-row items-center'>
                                <MaterialCommunityIcons name={isDefault ? 'checkbox-outline' : 'checkbox-blank-outline'} size={18} color={Colors.primaryColor} />
                                <Text className='text-newTextColor font-LexendRegular text-sm ml-1'>mark this as default</Text>
                            </TouchableOpacity>
                            {
                                btnLoader ?
                                    <ActivityIndicator size={'large'} style={{}} color={Colors.textColor} />
                                    :
                                    isFormValid() ?
                                        <TouchableOpacity onPress={isEdit ? handleUpdateAddress : handleSaveAddress} style={styles.saveButton}>
                                            <Text style={styles.saveButtonText}>Save Address</Text>
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity className='opacity-50' style={styles.saveButton}>
                                            <Text style={styles.saveButtonText}>Save Address</Text>
                                        </TouchableOpacity>
                            }
                        </View>
                    </View>
            }
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: Colors.borderColor,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 16,
        backgroundColor: Colors.bgcolor,
        letterSpacing: 0.88,
        fontFamily: Fonts.LexendRegular,
        color: Colors.newTextColor
    },
    saveButton: {
        backgroundColor: Colors.primaryColor,
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    pincodeContainer: {
        position: 'relative',
        zIndex: 1,
    },
    suggestionList: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: Colors.borderColor,
        borderRadius: 8,
        maxHeight: 200,
    },
    suggestionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderColor,
    },
    suggestionText: {
        fontFamily: Fonts.LexendRegular,
        color: Colors.newTextColor,
    },
});

export default Address;
