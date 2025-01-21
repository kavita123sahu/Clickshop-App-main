import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Images } from '../assets/Images';
import { Colors } from '../common/Colors';
import { Fonts } from '../common/Fonts';

interface SignUpButtonProps {
    navigation: any;
    token: string | null;
}

const SignupButton: React.FC<SignUpButtonProps> = ({ navigation, token }) => {
    const onSignUp = () => {
        navigation.replace('AuthStack', { screen: 'Login' });
    };

    return (
        <>
            {
                token ? null :
                    <View style={{ width: '100%', paddingVertical: 8, backgroundColor: '#FEF9C3', marginTop: 10, flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 12 }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', height: 30, width: '100%' }}>
                            <Image
                                source={Images.logoWithoutName}
                                style={{ width: '100%', height: '100%' }}
                                resizeMode='center'
                            />
                        </View>
                        <Text style={{ fontSize: 16, color: '#1E40AF', textAlign: 'center', fontFamily: Fonts.LexendMedium }}>Create a Clikshop Account to get amazing offers</Text>
                        <TouchableOpacity onPress={onSignUp} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 18, color: '#B91C1C', textAlign: 'center', fontFamily: Fonts.LexendMedium }}>Sign up now</Text>
                            <View style={{ marginLeft: 8, marginTop: 2 }}>
                                <FontAwesome5 name='chevron-right' size={15} color={'red'} />
                            </View>
                        </TouchableOpacity>
                    </View>
            }
        </>
    );
};

export default SignupButton;
