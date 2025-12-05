import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PORT = process.env.EXPO_PUBLIC_API_PORT || 5010;
const ENV_API_URL = process.env.EXPO_PUBLIC_API_URL;

const normalizeApiBase = (url) => {
    if (!url) return null;
    const trimmed = url.replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const getDefaultBaseURL = () => {
    const envBase = normalizeApiBase(ENV_API_URL);
    if (envBase) return envBase;
    if (Platform.OS === 'android') return `http://10.0.2.2:${PORT}/api`;
    return `http://localhost:${PORT}/api`;
};

const BASE_URL = getDefaultBaseURL();

const apiClient = axios.create({ baseURL: BASE_URL });

apiClient.interceptors.request.use(async (config) => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (e) { }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            return Promise.reject({ ...error, handled: true });
        }
        return Promise.reject(error);
    }
);

const API_CONFIG = { BASE_URL };

export default API_CONFIG;
export { BASE_URL, apiClient };
