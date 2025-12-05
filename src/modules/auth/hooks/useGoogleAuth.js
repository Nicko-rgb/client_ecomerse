import AsyncStorage from '@react-native-async-storage/async-storage';
import API_CONFIG from '../../../config/api';

export const useGoogleAuth = () => {
    const signInWithGoogleIdToken = async (idToken) => {
        const resp = await fetch(`${API_CONFIG.BASE_URL}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken })
        });
        const data = await resp.json();
        if (!resp.ok || !data.success) {
            throw new Error(data.error || 'Error en autenticación con Google');
        }
        const { token, user } = data.data;
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        return user;
    };

    return { signInWithGoogleIdToken };
};
