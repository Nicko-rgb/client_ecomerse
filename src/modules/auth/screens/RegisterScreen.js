import React, { useState, useEffect } from 'react';
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
import { useAuth } from '../../../context/AuthContext';
import { colors } from '../../../theme/colors';
import GoogleAuthButton from '../../../components/GoogleAuthButton';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import ModalMessage from '../../../components/ModalMessage';
import { Ionicons } from '@expo/vector-icons';
import { apiClient } from '../../../config/api';

const RegisterScreen = ({ navigation, route }) => {
  const { register } = useAuth();
  const { signInWithGoogleIdToken } = useGoogleAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [googleModalVisible, setGoogleModalVisible] = useState(false);
  const [googleError, setGoogleError] = useState('');
  const [phase, setPhase] = useState('email');
  const [enteredEmail, setEnteredEmail] = useState('');
  const [msgVisible, setMsgVisible] = useState(false);
  const [msgType, setMsgType] = useState('info');
  const [msgTitle, setMsgTitle] = useState('');
  const [msgText, setMsgText] = useState('');
  const [msgPrimaryLabel, setMsgPrimaryLabel] = useState(undefined);
  const [msgSecondaryLabel, setMsgSecondaryLabel] = useState(undefined);
  const [msgPrimary, setMsgPrimary] = useState(undefined);
  const [msgSecondary, setMsgSecondary] = useState(undefined);

  useEffect(() => {
    const initialEmail = route && route.params && route.params.email;
    if (initialEmail) {
      setPhase('register');
      setFormData({ ...formData, email: initialEmail });
    }
  }, [route]);

  const handleRegister = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setMsgType('error');
      setMsgTitle('Error');
      setMsgText('Por favor completa todos los campos obligatorios');
      setMsgPrimaryLabel(undefined);
      setMsgSecondaryLabel(undefined);
      setMsgPrimary(undefined);
      setMsgSecondary(undefined);
      setMsgVisible(true);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMsgType('error');
      setMsgTitle('Error');
      setMsgText('Las contraseñas no coinciden');
      setMsgPrimaryLabel(undefined);
      setMsgSecondaryLabel(undefined);
      setMsgPrimary(undefined);
      setMsgSecondary(undefined);
      setMsgVisible(true);
      return;
    }

    if (formData.password.length < 6) {
      setMsgType('error');
      setMsgTitle('Error');
      setMsgText('La contraseña debe tener al menos 6 caracteres');
      setMsgPrimaryLabel(undefined);
      setMsgSecondaryLabel(undefined);
      setMsgPrimary(undefined);
      setMsgSecondary(undefined);
      setMsgVisible(true);
      return;
    }

    setLoading(true);

    const result = await register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    });

    setLoading(false);

    if (result.success) {
      setMsgType('success');
      setMsgTitle('Éxito');
      setMsgText(result.message || '¡Cuenta creada! Bienvenido');
      setMsgPrimaryLabel('Entrar');
      setMsgSecondaryLabel(undefined);
      setMsgSecondary(undefined);
      setMsgPrimary(() => () => {
        navigation.replace('MainTabs');
        setMsgVisible(false);
      });
      setMsgVisible(true);
    } else {
      setMsgType('error');
      setMsgTitle('Error');
      setMsgText(result.error || 'Error al crear cuenta');
      setMsgPrimaryLabel(undefined);
      setMsgSecondaryLabel(undefined);
      setMsgPrimary(undefined);
      setMsgSecondary(undefined);
      setMsgVisible(true);
    }
  };

  const handleGoogle = async () => {
    try {
      setLoading(true);
      const idToken = null;
      if (!idToken) {
        setGoogleError('Configura el registro con Google para obtener el idToken');
        setGoogleModalVisible(true);
        return;
      }
      const user = await signInWithGoogleIdToken(idToken);
      if (user) {
        navigation.replace('MainTabs');
      }
    } catch (e) {
      setGoogleError(e.message || 'Error en autenticación con Google');
      setGoogleModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueEmail = async () => {
    try {
      const emailTrim = (enteredEmail || '').trim().toLowerCase();
      if (!emailTrim) {
        setMsgType('warning');
        setMsgTitle('Email requerido');
        setMsgText('Por favor ingresa tu correo');
        setMsgPrimaryLabel(undefined);
        setMsgSecondaryLabel(undefined);
        setMsgPrimary(undefined);
        setMsgSecondary(undefined);
        setMsgVisible(true);
        return;
      }
      setLoading(true);
      const { data } = await apiClient.post('/auth/check-email', { email: emailTrim });
      if (!data.success) {
        throw new Error(data.error || 'No se pudo verificar el email');
      }
      if (data.data?.exists) {
        navigation.replace('LoginScreen', { email: emailTrim });
      } else {
        setPhase('register');
        setFormData({ ...formData, email: emailTrim });
      }
    } catch (e) {
      setMsgType('error');
      setMsgTitle('Error');
      setMsgText(e.message || 'Algo salió mal');
      setMsgPrimaryLabel(undefined);
      setMsgSecondaryLabel(undefined);
      setMsgPrimary(undefined);
      setMsgSecondary(undefined);
      setMsgVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}><Ionicons name="arrow-back" size={20} color={colors.dark} /></TouchableOpacity>
        <Text style={styles.title}>{phase === 'email' ? 'Regístrate/ Iniciar Sesión' : 'Regístrate'}</Text>
        <Text style={styles.banner}>Inicie sesión o regístrese para acceder a sus productos y datos personales</Text>
        <Text style={styles.protected}>Su información está protegida</Text>

        <View style={styles.form}>
          {phase === 'email' ? (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Correo electrónico</Text>
                <TextInput
                  style={styles.input}
                  value={enteredEmail}
                  onChangeText={setEnteredEmail}
                  placeholder="correo@ejemplo.com"
                  placeholderTextColor={colors.gray}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              <TouchableOpacity
                style={[styles.registerButton, loading && styles.registerButtonDisabled]}
                disabled={loading}
                onPress={handleContinueEmail}
              >
                {loading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.registerButtonText}>Continuar</Text>}
              </TouchableOpacity>
              <View style={styles.quickLabelRow}><View style={styles.quickLine} /><Text style={styles.quickLabel}>Acceso rápido con</Text><View style={styles.quickLine} /></View>
              <GoogleAuthButton onPress={handleGoogle} />
            </>
          ) : (
            <>
              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>Nombre *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.firstName}
                    onChangeText={(value) => setFormData({...formData, firstName: value})}
                    placeholder="Juan"
                    placeholderTextColor={colors.gray}
                  />
                </View>

                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>Apellido *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.lastName}
                    onChangeText={(value) => setFormData({...formData, lastName: value})}
                    placeholder="Pérez"
                    placeholderTextColor={colors.gray}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.email}
                  onChangeText={(value) => setFormData({...formData, email: value})}
                  placeholder="tu@email.com"
                  placeholderTextColor={colors.gray}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Teléfono</Text>
                <TextInput
                  style={styles.input}
                  value={formData.phone}
                  onChangeText={(value) => setFormData({...formData, phone: value})}
                  placeholder="+1234567890"
                  placeholderTextColor={colors.gray}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Contraseña *</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    value={formData.password}
                    onChangeText={(value) => setFormData({...formData, password: value})}
                    placeholder="••••••••"
                    placeholderTextColor={colors.gray}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirmar Contraseña *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.confirmPassword}
                  onChangeText={(value) => setFormData({...formData, confirmPassword: value})}
                  placeholder="••••••••"
                  placeholderTextColor={colors.gray}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity
                style={[styles.registerButton, loading && styles.registerButtonDisabled]}
                onPress={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.registerButtonText}>Crear Cuenta</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => navigation.navigate('LoginScreen')}
              >
                <Text style={styles.loginButtonText}>
                  ¿Ya tienes cuenta? <Text style={styles.loginButtonTextBold}>Inicia Sesión</Text>
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
      <ModalMessage visible={googleModalVisible} type="info" title="Google" message={googleError} onClose={() => setGoogleModalVisible(false)} primaryLabel="Entendido" onPrimary={() => setGoogleModalVisible(false)} />
      <ModalMessage
        visible={msgVisible}
        type={msgType}
        title={msgTitle}
        message={msgText}
        onClose={() => setMsgVisible(false)}
        primaryLabel={msgPrimaryLabel}
        onPrimary={msgPrimary}
        secondaryLabel={msgSecondaryLabel}
        onSecondary={msgSecondary}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: 20,
  },
  backBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  backText: {
    color: colors.dark,
    fontWeight: '700',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 8,
    textAlign: 'center',
    marginTop: 20,
  },
  banner: {
    fontSize: 14,
    color: colors.dark,
    backgroundColor: '#FEF9C3',
    padding: 10,
    borderRadius: 8,
    textAlign: 'center',
    marginBottom: 8,
  },
  protected: {
    fontSize: 14,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 24,
  },
  form: {
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  inputGroup: {
    marginBottom: 20,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.dark,
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
  registerButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  loginButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  loginButtonText: {
    fontSize: 14,
    color: colors.gray,
  },
  loginButtonTextBold: {
    color: colors.primary,
    fontWeight: '600',
  },
  quickLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  quickLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  quickLabel: {
    marginHorizontal: 12,
    color: colors.gray,
    fontSize: 14,
  },
});

export default RegisterScreen;
