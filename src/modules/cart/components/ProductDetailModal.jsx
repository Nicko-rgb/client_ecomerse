import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
  StyleSheet,
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../../theme/colors';

const { width } = Dimensions.get('window');

export default function ProductDetailModal({ visible, product, onClose, onAddToCart, onRemove }) {
  if (!product) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header con botón cerrar */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detalles del Producto</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Imagen del producto */}
            <Image 
              source={{ uri: product.image }} 
              style={styles.productImage}
              resizeMode="cover"
            />

            {/* Información del producto */}
            <View style={styles.infoContainer}>
              <Text style={styles.productTitle}>{product.title}</Text>
              
              {/* Rating */}
              <View style={styles.ratingContainer}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Ionicons 
                    key={i} 
                    name={i < product.rating ? 'star' : 'star-outline'} 
                    color={colors.secondary} 
                    size={20} 
                  />
                ))}
                <Text style={styles.ratingText}>
                  {product.rating}.0 ({Math.floor(Math.random() * 500) + 100} reseñas)
                </Text>
              </View>

              {/* Precio */}
              <View style={styles.priceContainer}>
                <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                <View style={styles.stockBadge}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                  <Text style={styles.stockText}>En stock</Text>
                </View>
              </View>

              {/* Cantidad en carrito */}
              {product.quantity && (
                <View style={styles.quantityInfo}>
                  <Ionicons name="cart" size={20} color={colors.primary} />
                  <Text style={styles.quantityText}>
                    Tienes {product.quantity} {product.quantity === 1 ? 'unidad' : 'unidades'} en tu carrito
                  </Text>
                </View>
              )}

              {/* Descripción */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Descripción</Text>
                <Text style={styles.description}>
                  {product.description || 
                    `${product.title} es un producto de alta calidad que cumple con los más altos estándares. Perfecto para tus necesidades diarias, combina funcionalidad y estilo en un solo producto.`
                  }
                </Text>
              </View>

              {/* Características */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Características</Text>
                <View style={styles.featureItem}>
                  <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
                  <Text style={styles.featureText}>Garantía de 1 año</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="cube" size={20} color={colors.primary} />
                  <Text style={styles.featureText}>Envío gratis en compras mayores a $50</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="return-down-back" size={20} color={colors.primary} />
                  <Text style={styles.featureText}>Devolución gratis en 30 días</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="card" size={20} color={colors.primary} />
                  <Text style={styles.featureText}>Pago seguro</Text>
                </View>
              </View>

              {/* Categoría */}
              {product.category && (
                <View style={styles.categoryContainer}>
                  <Text style={styles.categoryLabel}>Categoría: </Text>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{product.category}</Text>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Botones de acción */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => {
                onRemove();
                onClose();
              }}
            >
              <Ionicons name="trash-outline" size={20} color={colors.white} />
              <Text style={styles.removeButtonText}>Eliminar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => {
                onAddToCart();
                onClose();
              }}
            >
              <Ionicons name="add-circle-outline" size={20} color={colors.white} />
              <Text style={styles.addButtonText}>Agregar más</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: width,
    height: width * 0.8,
    backgroundColor: colors.lightBackground,
  },
  infoContainer: {
    padding: 20,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.muted,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  price: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  stockText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
  },
  quantityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '10',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  quantityText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.muted,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    marginLeft: 12,
    fontSize: 15,
    color: colors.text,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  categoryLabel: {
    fontSize: 14,
    color: colors.muted,
  },
  categoryBadge: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  removeButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.error,
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  addButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});
