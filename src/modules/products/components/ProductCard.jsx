import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../../theme/colors';
import { useCart } from '../../../context/CartContext';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const navigation = useNavigation();
    
    // Adaptar campos de la API
    const productData = {
        id: product._id || product.id,
        title: product.name || product.title,
        price: product.price,
        image: product.images?.[0] || product.image || 'https://via.placeholder.com/300',
        rating: product.rating || 5,
        category: product.category,
        description: product.description,
        stock: product.stock
    };
    
    return (
        <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('Producto', { product: productData })} style={{ backgroundColor: colors.card, borderRadius: 12, padding: 10, borderWidth: 1, borderColor: colors.border, flex: 1 }}>
            <Image source={{ uri: productData.image }} style={{ width: '100%', height: 110, borderRadius: 10 }} resizeMode="cover" />
            <Text style={{ marginTop: 8, fontWeight: '700', color: colors.text }} numberOfLines={2}>{productData.title}</Text>
            <Text style={{ marginTop: 4, fontWeight: '700', color: colors.text }}>$ {productData.price.toFixed(2)}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                    <Ionicons key={i} name={i < productData.rating ? 'star' : 'star-outline'} color={colors.primary} size={16} />
                ))}
            </View>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <TouchableOpacity style={{ flex: 1, backgroundColor: colors.primary, paddingVertical: 8, borderRadius: 8, marginRight: 8 }}>
                    <Text style={{ textAlign: 'center', color: '#fff', fontWeight: '700' }}>Buy Now</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => addToCart(productData)}
                    style={{ flex: 1, backgroundColor: '#E9F6F1', paddingVertical: 8, borderRadius: 8 }}
                >
                    <Text style={{ textAlign: 'center', color: colors.primary, fontWeight: '700' }}>Add to Cart</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}