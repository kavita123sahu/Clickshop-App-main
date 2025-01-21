import React, { useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import WebView from 'react-native-webview';
import CommonHeader from './CommonHeader';
import { ActivityIndicator } from 'react-native-paper';
import { Colors } from '../common/Colors';
import Pdf from 'react-native-pdf';

const ViewPdf = (props: any) => {
    const { navigation } = props;
    const { pdf_url } = props.route.params;
    const [loader, setLoader] = useState(true);

    const onLoadStart = () => {
        setLoader(true);
        console.log('WebView load started')
    }
    const onLoadEnd = () => {
        setLoader(false);
        console.log('WebView load ended')
    };
    const onError = (error: any) => console.error('WebView error:', error);

    return (
        <View style={styles.container}>
            <CommonHeader title={'Pdf'} navigation={navigation} isCartIcon={false} />
            {loader ? <ActivityIndicator size="large" color={Colors.primaryColor} /> : null}
            {/* <WebView
                source={{ uri: `https://docs.google.com/viewer?url=${pdf_url}&embedded=true`, cache: true }}
                style={styles.webview}
                onLoadStart={onLoadStart}
                onLoadEnd={onLoadEnd}
                onError={onError}
                javaScriptEnabled={true}
                domStorageEnabled={true}
            /> */}

            <Pdf
                source={{ uri: pdf_url, cache: true }}
                style={styles.webview}
                onError={(error) => {
                    console.log(error);
                }}
                onLoadComplete={(numberOfPages, filePath) => {
                    console.log(`Number of pages: ${numberOfPages}`);
                }}
                onPageChanged={(page, numberOfPages) => {
                    console.log(`Current page: ${page}`);
                }}
                trustAllCerts={true}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    webview: {
        flex: 1,
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    }
});

export default ViewPdf;
