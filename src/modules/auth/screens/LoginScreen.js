import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { colors } from '../../../theme/colors';
import GoogleAuthButton from '../../../components/GoogleAuthButton';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import ModalMessage from '../../../components/ModalMessage';
import { Ionicons } from '@expo/vector-icons';
import { apiClient } from '../../../config/api';
import { fontNames } from '../../../theme/fonts';

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const { signInWithGoogleIdToken } = useGoogleAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const handleLogin = async () => {
    if (!email || !password) {
      setMsgType('error');
      setMsgTitle('Error');
      setMsgText('Por favor completa todos los campos');
      setMsgPrimaryLabel(undefined);
      setMsgSecondaryLabel(undefined);
      setMsgPrimary(undefined);
      setMsgSecondary(undefined);
      setMsgVisible(true);
      return;
    }

    setLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        setMsgType('success');
        setMsgTitle('Éxito');
        setMsgText(result.message || 'Bienvenido!');
        setMsgPrimaryLabel('Continuar');
        setMsgSecondaryLabel(undefined);
        setMsgSecondary(undefined);
        setMsgPrimary(() => () => {
          if (result.user && result.user.role === 'admin') {
            navigation.replace('MainTabs', { screen: 'Perfil' });
          } else {
            navigation.replace('MainTabs');
          }
          setMsgVisible(false);
        });
        setMsgVisible(true);
      } else {
        setMsgType('error');
        setMsgTitle('Error');
        setMsgText(result.error || 'Credenciales inválidas');
        setMsgPrimaryLabel(undefined);
        setMsgSecondaryLabel(undefined);
        setMsgPrimary(undefined);
        setMsgSecondary(undefined);
        setMsgVisible(true);
      }
    } catch (error) {
      setMsgType('error');
      setMsgTitle('Error');
      setMsgText('Error de conexión. Verifica tu red.');
      setMsgPrimaryLabel(undefined);
      setMsgSecondaryLabel(undefined);
      setMsgPrimary(undefined);
      setMsgSecondary(undefined);
      setMsgVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setLoading(true);
      const idToken = null;
      if (!idToken) {
        setGoogleError('Configura el inicio con Google para obtener el idToken');
        setGoogleModalVisible(true);
        return;
      }
      const user = await signInWithGoogleIdToken(idToken);
      if (user && user.role === 'admin') {
        navigation.replace('MainTabs', { screen: 'Perfil' });
      } else {
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
        setEmail(emailTrim);
        setPhase('login');
      } else {
        navigation.replace('RegisterScreen', { email: emailTrim });
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}><Ionicons name="arrow-back" size={20} color={colors.dark} /></TouchableOpacity>
        <Text style={styles.title}>{phase === 'email' ? 'Regístrate/ Iniciar Sesión' : 'Iniciar sesión'}</Text>
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
                style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                disabled={loading}
                onPress={handleContinueEmail}
              >
                {loading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.loginButtonText}>Continuar</Text>}
              </TouchableOpacity>
              <View style={styles.quickLabelRow}><View style={styles.quickLine} /><Text style={styles.quickLabel}>Acceso rápido con</Text><View style={styles.quickLine} /></View>
              <GoogleAuthButton onPress={handleGoogle} />
            </>
          ) : (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="tu@email.com"
                  placeholderTextColor={colors.gray}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Contraseña</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    value={password}
                    onChangeText={setPassword}
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

              <TouchableOpacity
                style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                )}
              </TouchableOpacity>

              <View style={styles.quickLabelRow}><View style={styles.quickLine} /><Text style={styles.quickLabel}>Acceso rápido con</Text><View style={styles.quickLine} /></View>

              <GoogleAuthButton onPress={handleGoogle} />

              <TouchableOpacity
                style={styles.registerButton}
                onPress={() => navigation.navigate('RegisterScreen')}
              >
                <Text style={styles.registerButtonText}>
                  ¿No tienes cuenta? <Text style={styles.registerButtonTextBold}>Regístrate</Text>
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.demoCredentials}>
          <Text style={styles.demoTitle}>Credenciales de prueba:</Text>
          <Text style={styles.demoText}>Cliente: usuario@ejemplo.com / password123</Text>
          <Text style={styles.demoText}>Admin: admin@ejemplo.com / admin123</Text>
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
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
    fontSize: 24,
    color: colors.dark,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: fontNames.playpenBold
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
  inputGroup: {
    marginBottom: 20,
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
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
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
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: 16,
    color: colors.gray,
    fontSize: 14,
  },
  registerButton: {
    alignItems: 'center',
  },
  registerButtonText: {
    fontSize: 14,
    color: colors.gray,
    marginTop: 12
  },
  registerButtonTextBold: {
    color: colors.primary,
    fontWeight: '600',
  },
  demoCredentials: {
    backgroundColor: colors.lightBackground,
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 8,
  },
  demoText: {
    fontSize: 12,
    color: colors.gray,
    marginBottom: 4,
  },
});

export default LoginScreen;
