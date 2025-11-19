import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../../theme/colors';
import { fontNames } from '../../../theme/fonts';
import { useCart } from '../../../context/CartContext';
import useProducto from '../hooks/useProducto';
import styles from '../styles/productoStyles';

export default function Producto({ route, navigation }) {
    const { product } = route.params;
    const { addToCart } = useCart();
    const { gallery, selected, setSelected, similares } = useProducto(product);

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={colors.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Detalles del producto</Text>
            </View>

            <View style={styles.mediaRow}>
                <View style={styles.thumbsCol}>
                    {gallery.map((uri, i) => (
                        <TouchableOpacity key={i} onPress={() => setSelected(i)} style={[styles.thumbItem, selected === i && styles.thumbItemActive]}>
                            <Image source={{ uri }} style={styles.thumbImg} />
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={styles.mainImageBox}>
                    <Image source={{ uri: gallery[selected] }} style={styles.mainImage} />
                </View>
            </View>

            <View style={styles.titleRow}>
                <Text style={styles.titleText}>{product.title}</Text>
                <View style={styles.pricePill}>
                    <Text style={styles.priceText}>$ {product.price.toFixed(2)}</Text>
                </View>
            </View>

            <View style={styles.actionsRow}>
                <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={() => addToCart(product)}>
                    <Text style={[styles.btnText, { color: colors.primary }]}>Agregar a Carrito</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.btnFill]}>
                    <Text style={[styles.btnText, { color: '#fff' }]}>Comprar</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.description}>
                Las laptops {product.title} son dispositivos de gama alta diseñados para productividad y creatividad.
            </Text>

            <Text style={styles.similaresTitle}>Productos similares</Text>
            <View style={styles.similaresGrid}>
                {similares.map((p) => (
                    <View style={styles.similarCard} key={p.id}>
                        <Image source={{ uri: p.image }} style={styles.similarImg} />
                        <Text style={styles.similarTitle}>{p.title}</Text>
                        <Text style={styles.similarPrice}>$ {p.price.toFixed(2)}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}