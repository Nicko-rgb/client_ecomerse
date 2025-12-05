import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import ProfileMenuItem from '../components/ProfileMenuItem';
import { colors } from '../../../theme/colors';
import Header from '../../../components/Header';

const SettingsScreen = ({ navigation }) => {
  const [settings, setSettings] = useState({
    notifications: true,
    emailNotifications: false,
    pushNotifications: true,
    newsletter: false,
    darkMode: false,
    biometricAuth: false,
  });

  const handleToggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePasswordScreen');
  };

  const handlePrivacySettings = () => {
    navigation.navigate('PrivacySettingsScreen');
  };

  const handleLanguage = () => {
    Alert.alert(
      'Idioma',
      'Selecciona tu idioma preferido',
      [
        { text: 'Español', onPress: () => console.log('Español seleccionado') },
        { text: 'English', onPress: () => console.log('English selected') },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Eliminar Cuenta',
      '¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive', 
          onPress: () => {
            // Lógica para eliminar cuenta
            console.log('Eliminar cuenta');
          }
        }
      ]
    );
  };

  const SettingItem = ({ icon, title, subtitle, value, onToggle, onPress, showSwitch = false }) => (
    <View style={styles.settingItem}>
      <TouchableOpacity 
        style={styles.settingContent} 
        onPress={onPress}
        disabled={showSwitch}
      >
        <View style={styles.settingLeft}>
          <View style={styles.settingIcon}>
            <Text style={styles.iconText}>{icon}</Text>
          </View>
          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>{title}</Text>
            {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
          </View>
        </View>
        {showSwitch ? (
          <Switch
            value={value}
            onValueChange={onToggle}
            trackColor={{ false: colors.lightGray, true: colors.primaryLight }}
            thumbColor={value ? colors.primary : colors.gray}
          />
        ) : (
          <Text style={styles.arrow}>›</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Header title="Configuración" onBack={() => navigation.goBack()} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notificaciones</Text>
        <View style={styles.sectionContent}>
          <SettingItem
            icon="🔔"
            title="Notificaciones"
            subtitle="Recibir notificaciones de la app"
            value={settings.notifications}
            onToggle={() => handleToggleSetting('notifications')}
            showSwitch={true}
          />
          <SettingItem
            icon="📧"
            title="Email"
            subtitle="Notificaciones por correo electrónico"
            value={settings.emailNotifications}
            onToggle={() => handleToggleSetting('emailNotifications')}
            showSwitch={true}
          />
          <SettingItem
            icon="📱"
            title="Push"
            subtitle="Notificaciones push en el dispositivo"
            value={settings.pushNotifications}
            onToggle={() => handleToggleSetting('pushNotifications')}
            showSwitch={true}
          />
          <SettingItem
            icon="📰"
            title="Newsletter"
            subtitle="Recibir ofertas y novedades"
            value={settings.newsletter}
            onToggle={() => handleToggleSetting('newsletter')}
            showSwitch={true}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Apariencia</Text>
        <View style={styles.sectionContent}>
          <SettingItem
            icon="🌙"
            title="Modo Oscuro"
            subtitle="Cambiar a tema oscuro"
            value={settings.darkMode}
            onToggle={() => handleToggleSetting('darkMode')}
            showSwitch={true}
          />
          <SettingItem
            icon="🌍"
            title="Idioma"
            subtitle="Español"
            onPress={handleLanguage}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Seguridad</Text>
        <View style={styles.sectionContent}>
          <SettingItem
            icon="🔒"
            title="Cambiar Contraseña"
            subtitle="Actualizar tu contraseña"
            onPress={handleChangePassword}
          />
          <SettingItem
            icon="👆"
            title="Autenticación Biométrica"
            subtitle="Usar huella dactilar o Face ID"
            value={settings.biometricAuth}
            onToggle={() => handleToggleSetting('biometricAuth')}
            showSwitch={true}
          />
          <SettingItem
            icon="🛡️"
            title="Privacidad"
            subtitle="Configurar privacidad de datos"
            onPress={handlePrivacySettings}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cuenta</Text>
        <View style={styles.sectionContent}>
          <SettingItem
            icon="📊"
            title="Descargar mis Datos"
            subtitle="Obtener copia de tu información"
            onPress={() => console.log('Descargar datos')}
          />
          <TouchableOpacity style={styles.dangerItem} onPress={handleDeleteAccount}>
            <Text style={styles.dangerIcon}>🗑️</Text>
            <View style={styles.dangerText}>
              <Text style={styles.dangerTitle}>Eliminar Cuenta</Text>
              <Text style={styles.dangerSubtitle}>Eliminar permanentemente tu cuenta</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.version}>Versión 1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 10
  },
  section: {
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 8,
    paddingHorizontal: 5,
  },
  sectionContent: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 18,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.dark,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: colors.gray,
  },
  arrow: {
    fontSize: 20,
    color: colors.gray,
    marginLeft: 8,
  },
  dangerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  dangerIcon: {
    fontSize: 18,
    marginRight: 12,
    width: 40,
    textAlign: 'center',
  },
  dangerText: {
    flex: 1,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.error || '#FF6B6B',
    marginBottom: 2,
  },
  dangerSubtitle: {
    fontSize: 14,
    color: colors.gray,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    marginTop: 24,
  },
  version: {
    fontSize: 14,
    color: colors.gray,
  },
});

export default SettingsScreen;
