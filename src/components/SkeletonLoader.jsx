import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import colors from '../theme/colors';

export const SkeletonBox = ({ width, height, style, borderRadius = 8 }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height, borderRadius, opacity },
        style,
      ]}
    />
  );
};

export const CartItemSkeleton = () => {
  return (
    <View style={styles.cartItemSkeleton}>
      <SkeletonBox width={80} height={80} />
      <View style={styles.skeletonDetails}>
        <SkeletonBox width="80%" height={16} style={{ marginBottom: 8 }} />
        <SkeletonBox width="40%" height={20} style={{ marginBottom: 8 }} />
        <SkeletonBox width="60%" height={32} />
      </View>
    </View>
  );
};

export const ProductCardSkeleton = () => {
  return (
    <View style={styles.productCardSkeleton}>
      <SkeletonBox width="100%" height={110} />
      <SkeletonBox width="90%" height={16} style={{ marginTop: 8 }} />
      <SkeletonBox width="50%" height={16} style={{ marginTop: 4 }} />
      <SkeletonBox width="100%" height={36} style={{ marginTop: 10 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.border,
  },
  cartItemSkeleton: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
  },
  skeletonDetails: {
    flex: 1,
    marginLeft: 12,
  },
  productCardSkeleton: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
    flex: 1,
  },
});
