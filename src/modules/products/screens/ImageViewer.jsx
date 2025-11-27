import React from 'react';
import { View, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function ImageViewer({ route, navigation }) {
    const { images, index } = route.params;

    return (
        <View style={{ flex: 1, backgroundColor: 'black' }}>

            {/* Botón cerrar */}
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    top: 40,
                    right: 20,
                    zIndex: 100,
                }}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="close" size={32} color="#fff" />
            </TouchableOpacity>

            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                contentOffset={{ x: width * index, y: 0 }}
            >
                {images.map((uri, i) => (
                    <View key={i} style={{ width, height, justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            source={{ uri }}
                            style={{ width: width, height: height * 0.75, resizeMode: 'contain' }}
                        />
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}
