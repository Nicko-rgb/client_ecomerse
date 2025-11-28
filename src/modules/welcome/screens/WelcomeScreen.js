import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Animated } from 'react-native';
import colors from '../../../theme/colors';
import LottieView from 'lottie-react-native';
import { fontNames } from '../../../theme/fonts';


export default function WelcomeScreen({ navigation }) {
  const progress = useRef(new Animated.Value(0)).current;
  const [trackWidth, setTrackWidth] = useState(0);
  useEffect(() => {
    if (trackWidth > 0) {
      progress.setValue(0);
      Animated.timing(progress, { toValue: trackWidth, duration: 10000, useNativeDriver: false }).start(() => {
        navigation.replace('MainTabs');
      });
    }
  }, [trackWidth]);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', padding: 24 }}>
      <LottieView
        source={require('../../../../assets/lottie/Shop-icon.json')}
        style={{ width: 240, height: 240 }}
        autoPlay
        loop
      />
      <Text style={{ fontSize: 25, color: colors.text, fontFamily: fontNames.playpenExtraBold }}>Explora Nuestros Productos</Text>
      <Text style={{ marginTop: 0, color: colors.muted, textAlign: 'center', fontFamily: fontNames.playpenRegular }}>Explora productos, agrega al carrito y compra fácil.</Text>
      <View
        onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
        style={{ width: '80%', height: 8, borderRadius: 8, backgroundColor: '#eee', marginTop: 20, overflow: 'hidden' }}
      >
        <Animated.View style={{ height: 8, borderRadius: 8, backgroundColor: colors.primary, width: progress }} />
      </View>
    </View>
  );
}
