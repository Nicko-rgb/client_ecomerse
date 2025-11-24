import { Platform } from 'react-native';

const ENV_URL = process.env.EXPO_PUBLIC_API_URL || process.env.API_URL || '';
const ENV_PORT = process.env.EXPO_PUBLIC_API_PORT || process.env.API_PORT || '5000';
const DEFAULT_IP = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

const API_CONFIG = {
  LOCAL_IP: ENV_URL ? '' : DEFAULT_IP,
  PORT: ENV_PORT,
  get BASE_URL() {
    const base = ENV_URL ? ENV_URL.replace(/\/$/, '') : `http://${this.LOCAL_IP}:${this.PORT}`;
    return `${base}/api`;
  },
  ENDPOINTS: {
    PROFILE: '/profile',
    ADDRESSES: '/addresses',
    PAYMENT_METHODS: '/payment-methods',
  }
};

export default API_CONFIG;
