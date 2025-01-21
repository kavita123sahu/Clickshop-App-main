import { View, Text, TouchableOpacity, Platform, ActivityIndicator } from 'react-native'
import React, { MutableRefObject, createRef, useState } from 'react'
import { CropView } from 'react-native-image-crop-tools';
import { useRef } from 'react';
import FastImage from 'react-native-fast-image';
import { Colors } from '../common/Colors';
import { useSelector } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const ImageCroper = (props: any) => {
    const [loader, setLoader] = useState(false);
    let cropViewRef = createRef<CropView>();

    const createFormData = (photo: any) => {
        const data = new FormData();
        data.append('profile_image', {
            name: 'name' + "." + photo.fileName.split(".").pop(),
            type: photo.type,
            uri:
                Platform.OS === 'android' ? ('file://' + photo.uri) : photo.uri.replace('file://', ''),
        });
        return data;
    };

    const onSave = () => {
        try {
            const r = cropViewRef.current?.saveImage(true, 100)
        } catch (error) {
            console.log(error)
        }
    }

    const onCropDone = async (data: any) => {
        setLoader(true);
        try {
            let { uri } = data
            let r = uri.split('/')
            let fileName = r[r.length - 1]
            let photo = {
                fileName, uri, type: "image/jpeg"
            }
            let d = createFormData(photo)
            setLoader(false);
            props.closeModal('file://' + photo.uri, photo.uri)
            // ProfileServices.upload_image(d).then(async (res: any) => {
            //     if (res.statusCode == 202) {
            //         // props.setProfilePic(photo.uri)
            //         setLoader(false);
            //         props.closeModal('file://' + photo.uri, res.data.image_url)
            //     }
            // }).catch(e => {
            //     console.log('Error =========>>>>', e)
            // })

        } catch (e) {
            console.log(e)
        }
    }

    return (
        <View className='flex flex-1 bg-blackColor50'>
            <View className='flex flex-row items-center justify-between py-5 px-4' style={{ backgroundColor: Colors.orangeColor }}>
                <View className='flex flex-row'>
                    <TouchableOpacity onPress={() => { props.closeModal(props.profilePic2, props.profilePic2); }}>
                        <MaterialIcons name='arrow-back' size={30} color={Colors.white} />
                    </TouchableOpacity>
                    <Text className='text-whiteColor text-[20px] leading-8 tracking-[0.44px] font-medium ml-2'>Crop Image</Text>
                </View>
                {
                    loader ?
                        <TouchableOpacity activeOpacity={0.25} className='flex px-4 py-2 bg-whiteColor rounded-[4px] opacity-40'>
                            <Text className='text-textColor text-[14px] font-InterBold font-bold'>Save</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity className='flex px-4 py-2 bg-whiteColor rounded-[4px]' onPress={() => { onSave() }}>
                            <Text className='text-textColor text-[14px] font-InterBold font-bold'>Save</Text>
                        </TouchableOpacity>
                }
            </View>

            <View className='flex flex-1 justify-center items-center'>
                {
                    loader ?
                        <ActivityIndicator size={'large'} color={Colors.orangeColor} />
                        :
                        <CropView
                            sourceUrl={props.profilePic}
                            style={{ width: 400, height: 400 }}
                            ref={cropViewRef}
                            onImageCrop={(res) => onCropDone(res)}
                            // keepAspectRatio
                            aspectRatio={{ width: 10, height: 10 }}
                        />
                }
            </View>
        </View>
    )
}

export default ImageCroper