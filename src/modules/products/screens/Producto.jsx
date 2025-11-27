import React, { useMemo, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../../theme/colors';
import { fontNames } from '../../../theme/fonts';
import { useCart } from '../../../context/CartContext';
import { useProductDetails } from '../hooks/useProducts';
import styles from '../styles/productoStyles';

export default function Producto({ route, navigation }) {
    const { product: initial } = route.params;
    const { addToCart } = useCart();
    const { product, relatedProducts } = useProductDetails(initial.id);
    const [selected, setSelected] = useState(0);
    const current = product || initial;
    const gallery = useMemo(() => {
        const arr = Array.isArray(current.images) && current.images.length ? current.images : [current.image];
        return arr.slice(0, 4);
    }, [current]);

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>

            {/* Header */}
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={colors.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Detalles del producto</Text>
            </View>

            {/* Caja de imagenes */}
            <View style={styles.mediaBox}>
                <View style={styles.thumbsCol}>
                    {gallery.map((uri, i) => (
                        <TouchableOpacity key={i} onPress={() => setSelected(i)} style={[styles.thumbItem, selected === i && styles.thumbItemActive]}>
                            <Image source={{ uri }} style={styles.thumbImg} />
                        </TouchableOpacity>
                    ))}
                </View>
                <TouchableOpacity
                    activeOpacity={0.9}
                    style={styles.mainImageContainer}
                    onPress={() =>
                        navigation.navigate('ImageViewer', {
                            images: gallery,
                            index: selected
                        })
                    }
                >
                    <Image source={{ uri: gallery[selected] }} style={styles.mainImage} />
                </TouchableOpacity>

            </View>

            <Text style={styles.titleText}>{current.name || current.title}</Text>

            {/* Precio y calificacion */}
            <View style={styles.priceRow}>
                <View style={styles.ratingRow}>
                    <View style={styles.stars}>
                        <Ionicons name="star" size={16} color={colors.yellow} />
                        <Ionicons name="star" size={16} color={colors.yellow} />
                        <Ionicons name="star" size={16} color={colors.yellow} />
                        <Ionicons name="star" size={16} color={colors.yellow} />
                    </View>
                    <Text style={styles.ratingText}>4.5 | +456 vendidos(as)</Text>
                </View>
                <View style={styles.prices}>
                    {current.old_price != null && (
                        <Text style={styles.oldPriceText}>$ {current.old_price.toFixed ? current.old_price.toFixed(2) : current.old_price}</Text>
                    )}
                    <Text style={styles.priceText}>$ {current.price.toFixed ? current.price.toFixed(2) : current.price}</Text>
                </View>
            </View>

            <View style={styles.actionsRow}>
                <Ionicons name="cart" size={24} color={colors.primary} />
                <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={() => addToCart(current)}>
                    <Text style={[styles.btnText, { color: colors.primary }]}>Agregar a Carrito</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.btnFill]}>
                    <Text style={[styles.btnText, { color: '#fff' }]}>Comprar</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.description}>
                {current.description}
            </Text>

            {Array.isArray(current.features) && current.features.length > 0 && (
                <View style={{ marginTop: 12 }}>
                    <Text style={styles.similaresTitle}>Características</Text>
                    {current.features.map((f, idx) => (
                        <View key={`feat-${idx}`} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 }}>
                            <Text style={{ color: colors.gray, fontFamily: fontNames.spartanRegular }}>{f.name}</Text>
                            <Text style={{ fontFamily: fontNames.spartanBold }}>{f.value}</Text>
                        </View>)
                    )}
                </View>
            )}

            <Text style={styles.similaresTitle}>Productos similares</Text>
            <View style={styles.similaresGrid}>
                {relatedProducts.map((p) => {
                    const productData = {
                        id: p.id,
                        name: p.name || p.title,
                        price: p.price,
                        image: (p.images && p.images[0]) || p.image,
                        images: p.images,
                        category: p.category,
                        description: p.description,
                        stock: p.stock
                    };
                    return (
                        <TouchableOpacity
                            style={styles.similarCard}
                            key={p.id}
                            onPress={() => navigation.navigate('Producto', { product: productData })}
                        >
                            <Image source={{ uri: productData.image }} style={styles.similarImg} />
                            <Text style={styles.similarTitle}>{productData.name}</Text>
                            <Text style={styles.similarPrice}>$ {productData.price.toFixed ? productData.price.toFixed(2) : productData.price}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </ScrollView>
    );
}
