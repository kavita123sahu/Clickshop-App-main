import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, TextInput } from 'react-native';
import Toast from 'react-native-toast-message';
import * as _ORDER_SERVICE from '../../services/OrderService';
import { Fonts } from '../../common/Fonts';
import CommonHeader from '../../component/CommonHeader';
import { Colors } from '../../common/Colors';

const reasons = [
    "Damaged product",
    "Wrong product"
];

const ReplacementReason = (props: any) => {
    const { productId } = props.route.params;
    const { navigation } = props;
    const [loader, setLoader] = useState(false);
    const [selectedReason, setSelectedReason] = useState('');
    const [message, setMessage] = useState('');

    const selectReason = (reason: string) => {
        setSelectedReason(reason);
    };

    const replaceProduct = async () => {
        if (!selectedReason) {
            Toast.show({
                text1: 'Error!',
                text2: 'Please select a reason for replacement.',
                type: 'error',
                position: 'bottom',
                text1Style: styles.toastTitle,
                text2Style: styles.toastMessage
            });
            return;
        }

        try {
            setLoader(true);
            const dataToSend = {
                order_detail_id: productId,
                reason: selectedReason,
                message: message
            };
            console.log(dataToSend);

            const result: any = await _ORDER_SERVICE.replace_product(dataToSend);
            console.log(result);

            const { status_code, message: responseMessage = "" } = result;
            if (status_code === 200) {
                Toast.show({
                    // text1: 'Replacement Request!',
                    text2: 'Replacement Request Sent Successfully',
                    type: 'success',
                    position: 'bottom',
                    text1Style: styles.toastTitle,
                    text2Style: styles.toastMessage
                });
                navigation.navigate('MyOrders');
            } else {
                Toast.show({
                    text1: 'Error!',
                    text2: responseMessage,
                    type: 'error',
                    position: 'bottom',
                    text1Style: styles.toastTitle,
                    text2Style: styles.toastMessage
                });
            }
        } catch (error) {
            console.log(error);
            Toast.show({
                text1: 'Error!',
                text2: 'An unexpected error occurred. Please try again.',
                type: 'error',
                position: 'bottom',
                text1Style: styles.toastTitle,
                text2Style: styles.toastMessage
            });
        } finally {
            setLoader(false);
        }
    };

    return (
        <View style={styles.container}>
            <CommonHeader title="Replacement reason" navigation={navigation} isCartIcon={false} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>Select Replacement Reason</Text>
                <View style={styles.reasonsContainer}>
                    {reasons.map((reason: string, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.radioButtonContainer}
                            onPress={() => selectReason(reason)}
                        >
                            <View style={styles.radioButtonWrapper}>
                                <View style={styles.radioButton}>
                                    {selectedReason === reason && <View style={styles.radioButtonInner} />}
                                </View>
                            </View>
                            <Text style={styles.reasonText}>{reason}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <Text style={styles.messageLabel}>Additional Message:</Text>
                <TextInput
                    style={styles.messageInput}
                    multiline
                    numberOfLines={4}
                    onChangeText={setMessage}
                    value={message}
                    placeholder="Please provide any additional details..."
                    placeholderTextColor="#BDBDBD"
                />
                <TouchableOpacity
                    style={styles.replaceButton}
                    onPress={replaceProduct}
                    disabled={loader}
                >
                    {loader ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.replaceButtonText}>Request Replacement</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontFamily: Fonts.LexendBold,
        marginBottom: 20,
        color: Colors.newTextColor,
    },
    reasonsContainer: {
        marginBottom: 20,
    },
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    radioButtonWrapper: {
        marginRight: 10,
    },
    radioButton: {
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Colors.primaryColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioButtonInner: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: Colors.primaryColor,
    },
    reasonText: {
        fontSize: 16,
        fontFamily: Fonts.LexendMedium,
        color: Colors.newTextColor,
    },
    messageLabel: {
        fontSize: 16,
        fontFamily: Fonts.LexendMedium,
        color: Colors.newTextColor,
        marginBottom: 10,
    },
    messageInput: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
        fontFamily: Fonts.LexendRegular,
        fontSize: 14,
        textAlignVertical: 'top',
        color: Colors.newTextColor,
    },
    replaceButton: {
        backgroundColor: Colors.primaryColor,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    replaceButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: Fonts.LexendBold,
    },
    toastTitle: {
        fontSize: 16,
        fontFamily: Fonts.LexendBold,
    },
    toastMessage: {
        fontSize: 14,
        fontFamily: Fonts.LexendMedium,
    },
});

export default ReplacementReason;