import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_CONFIG from '../../../config/api';
import { useAuth } from '../../../context/AuthContext';
import { colors } from '../../../theme/colors';
import Header from '../../../components/Header';

const ChangePasswordScreen = ({ navigation }) => {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers,
      errors: [
        ...(password.length < minLength ? [`Mínimo ${minLength} caracteres`] : []),
        ...(!hasUpperCase ? ['Una letra mayúscula'] : []),
        ...(!hasLowerCase ? ['Una letra minúscula'] : []),
        ...(!hasNumbers ? ['Un número'] : []),
      ]
    };
  };

  const handleChangePassword = async () => {
    // Validaciones
    if (!formData.currentPassword) {
      Alert.alert('Error', 'Ingresa tu contraseña actual');
      return;
    }

    if (!formData.newPassword) {
      Alert.alert('Error', 'Ingresa una nueva contraseña');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    const passwordValidation = validatePassword(formData.newPassword);
    if (!passwordValidation.isValid) {
      Alert.alert(
        'Contraseña débil',
        `La contraseña debe tener:\n${passwordValidation.errors.join('\n')}`
      );
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      Alert.alert('Error', 'La nueva contraseña debe ser diferente a la actual');
      return;
    }

    setLoading(true);
    
    try {
      const token = await AsyncStorage.getItem('token');
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert(
          'Éxito', 
          'Contraseña cambiada correctamente. Por seguridad, deberás iniciar sesión nuevamente.',
          [
            { 
              text: 'OK', 
              onPress: async () => {
                await logout();
                navigation.navigate('LoginScreen');
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', data.error || 'No se pudo cambiar la contraseña');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      Alert.alert('Error', 'No se pudo cambiar la contraseña. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const passwordValidation = validatePassword(formData.newPassword);

  return (
    <ScrollView style={styles.container}>
      <Header title="Cambiar Contraseña" onBack={() => navigation.goBack()} />
      <View style={styles.form}>
        <Text style={styles.title}>Cambiar Contraseña</Text>
        <Text style={styles.subtitle}>
          Por tu seguridad, necesitamos verificar tu identidad antes de cambiar tu contraseña.
        </Text>
        
        {/* Contraseña actual */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contraseña Actual *</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={formData.currentPassword}
              onChangeText={(value) => handleInputChange('currentPassword', value)}
              placeholder="Ingresa tu contraseña actual"
              placeholderTextColor={colors.gray}
              secureTextEntry={!showPasswords.current}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => togglePasswordVisibility('current')}
            >
              <Text style={styles.eyeIcon}>
                {showPasswords.current ? '👁️' : '👁️‍🗨️'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Nueva contraseña */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nueva Contraseña *</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={formData.newPassword}
              onChangeText={(value) => handleInputChange('newPassword', value)}
              placeholder="Ingresa tu nueva contraseña"
              placeholderTextColor={colors.gray}
              secureTextEntry={!showPasswords.new}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => togglePasswordVisibility('new')}
            >
              <Text style={styles.eyeIcon}>
                {showPasswords.new ? '👁️' : '👁️‍🗨️'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Indicador de fortaleza de contraseña */}
          {formData.newPassword.length > 0 && (
            <View style={styles.passwordStrength}>
              <Text style={styles.strengthTitle}>Fortaleza de la contraseña:</Text>
              <View style={styles.strengthIndicators}>
                {passwordValidation.errors.map((error, index) => (
                  <Text key={index} style={styles.strengthError}>• {error}</Text>
                ))}
                {passwordValidation.isValid && (
                  <Text style={styles.strengthSuccess}>✅ Contraseña segura</Text>
                )}
              </View>
            </View>
          )}
        </View>

        {/* Confirmar contraseña */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirmar Nueva Contraseña *</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              placeholder="Confirma tu nueva contraseña"
              placeholderTextColor={colors.gray}
              secureTextEntry={!showPasswords.confirm}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => togglePasswordVisibility('confirm')}
            >
              <Text style={styles.eyeIcon}>
                {showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Indicador de coincidencia */}
          {formData.confirmPassword.length > 0 && (
            <View style={styles.matchIndicator}>
              {formData.newPassword === formData.confirmPassword ? (
                <Text style={styles.matchSuccess}>✅ Las contraseñas coinciden</Text>
              ) : (
                <Text style={styles.matchError}>❌ Las contraseñas no coinciden</Text>
              )}
            </View>
          )}
        </View>

        {/* Consejos de seguridad */}
        <View style={styles.securityTips}>
          <Text style={styles.tipsTitle}>💡 Consejos de seguridad:</Text>
          <Text style={styles.tipText}>• Usa una combinación de letras, números y símbolos</Text>
          <Text style={styles.tipText}>• No uses información personal como fechas o nombres</Text>
          <Text style={styles.tipText}>• No reutilices contraseñas de otras cuentas</Text>
          <Text style={styles.tipText}>• Considera usar un gestor de contraseñas</Text>
        </View>

        <TouchableOpacity 
          style={[
            styles.changeButton, 
            (loading || !passwordValidation.isValid || formData.newPassword !== formData.confirmPassword) && styles.changeButtonDisabled
          ]}
          onPress={handleChangePassword}
          disabled={loading || !passwordValidation.isValid || formData.newPassword !== formData.confirmPassword}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.changeButtonText}>Cambiar Contraseña</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  form: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: colors.dark,
  },
  eyeButton: {
    padding: 12,
  },
  eyeIcon: {
    fontSize: 18,
  },
  passwordStrength: {
    marginTop: 8,
    padding: 12,
    backgroundColor: colors.lightBackground,
    borderRadius: 8,
  },
  strengthTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.dark,
    marginBottom: 4,
  },
  strengthIndicators: {
    gap: 2,
  },
  strengthError: {
    fontSize: 12,
    color: colors.error || '#FF6B6B',
  },
  strengthSuccess: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '500',
  },
  matchIndicator: {
    marginTop: 8,
  },
  matchSuccess: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '500',
  },
  matchError: {
    fontSize: 12,
    color: colors.error || '#FF6B6B',
  },
  securityTips: {
    backgroundColor: colors.lightBackground,
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 12,
    color: colors.gray,
    marginBottom: 4,
    lineHeight: 16,
  },
  changeButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  changeButtonDisabled: {
    opacity: 0.6,
  },
  changeButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  cancelButtonText: {
    color: colors.gray,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChangePasswordScreen;
