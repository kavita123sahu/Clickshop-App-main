import { View, Text, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import HTMLView from 'react-native-htmlview';
import RenderHTML from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import { Colors } from '../common/Colors';
import { Fonts } from '../common/Fonts';

const Description = (props: any) => {
    let description = props.description;
    const { width } = useWindowDimensions();
    return (
        <View className="mt-4 px-5 bg-whiteColor">
            <View>
                <RenderHTML
                    contentWidth={width}
                    source={{
                        html:
                            `<span>
                        ${description}
                        </span>`

                    }}
                    tagsStyles={styles}
                />
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    span: {
        fontWeight: '300',
        color: Colors.newTextColor,
        fontSize: 12,
        lineHeight: 20,
        fontFamily: Fonts.LexendRegular
    },
    p: {
        color: 'black',
    },
    h1: {
        fontSize: 14,
        fontFamily: Fonts.LexendRegular
    }
});

export default Description;
