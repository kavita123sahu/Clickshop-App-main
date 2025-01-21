import { ActivityIndicator, PermissionsAndroid, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, TextInput, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import BottomSheet from '@gorhom/bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';
import FastImage from 'react-native-fast-image'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Colors } from '../../common/Colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Images } from '../../assets/Images';
import IonIcon from 'react-native-vector-icons/Ionicons'
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import Modal from "react-native-modal";
import ImageCroper from '../../component/ImageCroper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { EmailValidator } from '../../common/Validator';
import * as _PROFILE_SERVICES from '../../services/ProfileServices';
import Toast from 'react-native-toast-message';
import { Fonts } from '../../common/Fonts';
import { useIsFocused } from '@react-navigation/native';
import { BaseUrl } from '../../config/Key';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../../redux/action/UserInfoAction';

const tommorow = new Date().setDate(new Date().getDate() + 1)
const GENDER = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Others', value: 'Others' }
]

const EditProfile = (props: any) => {
    const dispatch = useDispatch();
    const bottomSheetRef = React.useRef<BottomSheet>(null);
    const isFocused = useIsFocused();
    const [profilePic, setProfilePic] = useState<any>();
    const [modalVisible, setModalVisible] = useState(false);
    const [bottomSheetVisiblity, setBottomsheetVisibility] = useState(false);
    const [profilePicUrl, setProfilePicUrl] = useState<any>();
    const [email, setEmail] = useState('')
    const [name, setName] = useState('');
    const [hasError, setHasError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [datePicker, setDatePicker] = useState(false);
    const [phone, setPhone] = useState('');
    const [userProfile, setUserProfile] = useState<any>();
    const [loader, setLoader] = useState(true);

    useEffect(() => { getUser(); }, [isFocused])

    const getUser = async (returnkey?: boolean) => {
        try {
            if (!returnkey) {
                setLoader(true);
            }
            const result: any = await _PROFILE_SERVICES.get_user();
            const { status_code, data, message = "" } = result;
            if (status_code === 200) {
                setName(data?.name);
                setEmail(data?.email);
                setPhone(data?.phone);
                setUserProfile(data?.avatar);
                setLoader(false);
                if (returnkey) {
                    return result;
                }
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
            setLoader(false);
        }
    }

    const pickImage = async () => {
        setModalVisible(true)
        setBottomsheetVisibility(true)
    };

    const openGalary = async () => {
        const result: any = await launchImageLibrary({
            mediaType: 'photo'
        });
        if (result && result.assets) {
            setBottomsheetVisibility(false)
            setModalVisible(true);
            setProfilePic(result.assets[0].uri)

        }
    }

    const takePhoto = async () => {
        try {
            let granted = null;
            if (Platform.OS === 'android') {
                granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'CometChat Camera Permission',
                        message: 'CometChat needs access to your camera ',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                );
            }

            if (Platform.OS === 'ios' || granted === PermissionsAndroid.RESULTS.GRANTED) {
                const result: any = await launchCamera({
                    mediaType: 'photo'
                });
                if (result && result.assets) {
                    setBottomsheetVisibility(false)
                    setModalVisible(true);
                    setProfilePic(result.assets[0].uri)
                }
            }

        } catch (error) {
            console.log("Camera Error: ", error);

        }

    };

    const TakePhotoOption = () => {
        return (
            <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginTop: 25 }}
                onPress={takePhoto} >
                <EvilIcon name="camera" size={40} color={Colors.orangeColor} />
                <Text style={{ fontSize: 18, marginLeft: 10, fontWeight: '500', color: Colors.orangeColor, marginTop: 3 }}>
                    Take Photo
                </Text>
            </TouchableOpacity>
        );
    }

    const PhotoLibraryOption = () => {
        return (
            <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginTop: 20, marginLeft: 5 }}
                onPress={openGalary} >
                <IonIcon name="image-outline" size={30} color={Colors.orangeColor} />

                <Text
                    style={{
                        fontSize: 18,
                        marginLeft: 14,
                        fontWeight: '500',
                        color: Colors.orangeColor
                    }}>
                    Photo Library
                </Text>
            </TouchableOpacity>
        );
    }

    const closeModal = (uri: any, image_url: any) => {
        setModalVisible(false);
        if (uri !== null) {
            setProfilePic(uri)
            setProfilePicUrl(image_url)
        } else if (uri == undefined) {
            setProfilePic(profilePic);
            setProfilePicUrl(profilePicUrl)
        }
    }

    const onSubmit = async () => {
        try {
            setLoading(true);
            let e = EmailValidator(email);
            if (e) {
                const formData = new FormData();
                formData.append('name', name);
                formData.append('email', email);
                formData.append('phone', phone);
                if (profilePic) {
                    formData.append('image', {
                        uri: profilePic,
                        type: 'image/jpeg',
                        name: 'profile.jpg'
                    });
                }
                const result: any = await _PROFILE_SERVICES.update_Profile(formData);
                const { status_code, data, message = "" } = result;
                if (status_code === 200) {
                    const user: any = await getUser(true);
                    if (user?.status_code === 200) {
                        dispatch(setUserInfo(user?.data));
                        props.navigation.navigate('Account');
                        setLoading(false);
                        Toast.show({
                            // text1: 'Success!',
                            text2: message,
                            type: 'success',
                            position: 'bottom',
                            text1Style: { fontSize: 16, fontFamily: Fonts.LexendBold, color: 'green' },
                            text2Style: { fontSize: 12, fontFamily: Fonts.LexendMedium, color: 'green' }
                        });
                    }
                } else {
                    Toast.show({
                        text1: 'Error!',
                        text2: message,
                        type: 'error',
                        position: 'bottom',
                        text1Style: { fontSize: 16, fontFamily: Fonts.LexendBold, color: 'red' },
                        text2Style: { fontSize: 12, fontFamily: Fonts.LexendMedium, color: 'red' }
                    });
                    setLoading(false)
                }

            } else {
                console.log("calling222==============>");
                setHasError(true);
                setLoading(false)
            }
        } catch (error) {
            console.log("PROFILE UPDATE ERROR", error);
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0} style={{ flex: 1, backgroundColor: 'white' }}>
            <Modal
                isVisible={modalVisible}
                onBackButtonPress={() => closeModal(null, null)}
                animationIn={'slideInUp'}
                animationOut={'slideOutDown'}
                animationInTiming={1}
                animationOutTiming={1}
                onBackdropPress={() => closeModal(null, null)}
                coverScreen={true}
                style={{
                    margin: 0,
                    flex: 1,
                    justifyContent: 'flex-start'
                }}>
                {
                    bottomSheetVisiblity ?
                        <GestureHandlerRootView style={{ flex: 1 }}>
                            <BottomSheet
                                ref={bottomSheetRef}
                                snapPoints={['25%', '25%']}
                                // snapPoints={snapPoints}
                                index={1}
                            // enablePanDownToClose={true}
                            >
                                <View>
                                    {TakePhotoOption()}
                                    {PhotoLibraryOption()}
                                    <TouchableOpacity
                                        style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginTop: 20, marginLeft: 5 }}
                                        onPress={() => closeModal(null, null)} >
                                        <MaterialCommunityIcons name="cancel" size={30} color={Colors.errorColor} />
                                        <Text
                                            style={{
                                                fontSize: 18,
                                                marginLeft: 14,
                                                fontWeight: '500',
                                                color: Colors.errorColor
                                            }}>
                                            Cancel
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </BottomSheet>
                        </GestureHandlerRootView>
                        :
                        <ImageCroper closeModal={closeModal} profilePic={profilePic} profilePic2={profilePic} />
                }

            </Modal>

            <View className={`flex flex-row items-center px-3 py-5`} style={{ backgroundColor: Colors.orangeColor }}>
                <TouchableOpacity onPress={() => { props.navigation.goBack() }}>
                    <MaterialIcons name='arrow-back' size={30} color={Colors.white} />
                </TouchableOpacity>
                <View>
                    <Text className='text-whiteColor text-[20px] leading-8 tracking-[0.44px] font-normal ml-2'>Edit profile</Text>
                </View>
            </View>

            <View className='flex flex-1 bg-whiteColor'>
                {
                    loader ?
                        <View className='flex flex-1 justify-center items-center'>
                            <ActivityIndicator size={'large'} color={Colors.primaryColor} />
                        </View>
                        :
                        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always' contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}>
                            <View className='flex px-5 py-5 bg-greyColor25 justify-center items-center'>
                                {
                                    (userProfile === null || userProfile === undefined) && (profilePic === null || profilePic === undefined) ?
                                        <TouchableOpacity className='w-[120px] h-[120px] rounded-full justify-center items-center relative bg-bgGrayColor' onPress={() => { pickImage() }}>
                                            <FastImage source={Images.pic3} resizeMode='contain' className='w-full h-full rounded-full' />
                                            <View className='flex justify-center items-center bg-blackColor50 rounded-b-full absolute bottom-0 h-[50%] px-2 w-full'>
                                                <Text className='text-whiteColor text-[10px] leading-4 tracking-[1.5px] text-center uppercase font-InterMedium font-semibold'>CHANGE IMAGE</Text>
                                            </View>
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity className='w-[120px] h-[120px] rounded-full justify-center items-center relative' onPress={() => { pickImage() }}>
                                            <FastImage source={{ uri: profilePic ? profilePic : BaseUrl.base + "public/" + userProfile }} resizeMode='contain' className='w-full h-full rounded-full' />
                                            <View className='flex justify-center items-center bg-blackColor50 rounded-b-full absolute bottom-0 h-[50%] px-2 w-full'>
                                                <Text className='text-whiteColor text-[10px] leading-4 tracking-[1.5px] text-center uppercase font-InterMedium font-semibold'>CHANGE IMAGE</Text>
                                            </View>
                                        </TouchableOpacity>
                                }
                            </View>

                            <View className='px-4 mt-6'>
                                <Text className='text-sm text-left font-LexendMedium text-newTextColor ml-1'>name</Text>
                                <View style={styles.SectionStyle}>
                                    <TextInput
                                        style={styles.inputStyle}
                                        onChangeText={(e) => setName(e)}
                                        value={name}
                                        placeholder="Enter full name"
                                        placeholderTextColor={Colors.placeholderColor}
                                        autoCapitalize="none"
                                        keyboardType="default"
                                        underlineColorAndroid="#f000"
                                    />
                                </View>
                                <Text className='text-sm text-left font-LexendMedium text-newTextColor ml-1 mt-5'>Phone Number</Text>
                                <View style={styles.SectionStyle}>
                                    <TextInput
                                        style={styles.inputStyle}
                                        onChangeText={(e) => setPhone(e)}
                                        value={phone}
                                        placeholder="Enter Mobile Number"
                                        placeholderTextColor={Colors.placeholderColor}
                                        autoCapitalize="none"
                                        keyboardType="number-pad"
                                        maxLength={10}
                                        underlineColorAndroid="#f000"
                                    />
                                </View>
                                <Text className='text-sm text-left font-LexendMedium text-newTextColor ml-1 mt-5'>Email ID</Text>
                                <View style={styles.SectionStyle}>
                                    <TextInput
                                        style={styles.inputStyle}
                                        onChangeText={(e) => setEmail(e)}
                                        value={email}
                                        placeholder="Enter Email ID"
                                        placeholderTextColor={Colors.placeholderColor}
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                        underlineColorAndroid="#f000"
                                    />
                                </View>
                            </View>
                        </ScrollView>
                }
                <View className='flex flex-col px-5 bottom-6'>
                    {
                        loading ?
                            <ActivityIndicator size={'large'} color={Colors.primaryColor} />
                            :
                            <TouchableOpacity disabled={loading} onPress={onSubmit} className='flex justify-center items-center bg-primaryColor rounded-md py-3'>
                                <Text className='text-whiteColor text-center font-LexendMedium text-base'>Update Profile</Text>
                            </TouchableOpacity>
                    }
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

export default EditProfile

const styles = StyleSheet.create({
    container: {
        width: '100%'
    },
    itemContainer: {
        backgroundColor: Colors.fieldGrayColor,
    },
    dropdown: {
        paddingVertical: 10,
        borderColor: Colors.greyColor25,
        borderRadius: 4,
        paddingHorizontal: 8,
        marginTop: 24,
        backgroundColor: Colors.white,
        width: '100%',
        borderWidth: 1,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: Colors.bgGrayColor,
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
        color: Colors.textColor
    },
    placeholderStyle: {
        fontSize: 14,
        color: Colors.orangeColor
    },
    selectedTextStyle: {
        fontSize: 14,
        color: Colors.orangeColor
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        color: Colors.textColor,

    },
    error: {
        color: 'red',
        fontSize: 20,
        marginBottom: 12,
    },
    SectionStyle: {
        height: 50,
        marginTop: 5,
    },
    buttonStyle: {
        backgroundColor: '#000080',
        borderWidth: 0,
        color: '#000080',
        borderColor: 'blue',
        height: 40,
        alignItems: 'center',
        borderRadius: 30,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 20,
        marginBottom: 25,
    },
    inputStyle: {
        flex: 1,
        color: Colors.newTextColor,
        paddingLeft: 15,
        paddingRight: 15,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: Colors.borderColor,
    },

})