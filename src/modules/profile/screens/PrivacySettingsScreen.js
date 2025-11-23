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
import { colors } from '../../../theme/colors';

const PrivacySettingsScreen = ({ navigation }) => {
  const [settings, setSettings] = useState({
    profileVisibility: 'public', // public, friends, private
    showEmail: false,
    showPhone: false,
    showAddress: false,
    allowDataCollection: true,
    allowPersonalizedAds: true,
    allowThirdPartySharing: false,
    activityTracking: true,
  });

  const handleToggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleProfileVisibility = () => {
    Alert.alert(
      'Visibilidad del Perfil',
      'Selecciona quién puede ver tu perfil',
      [
        { 
          text: 'Público', 
          onPress: () => setSettings(prev => ({ ...prev, profileVisibility: 'public' }))
        },
        { 
          text: 'Solo Amigos', 
          onPress: () => setSettings(prev => ({ ...prev, profileVisibility: 'friends' }))
        },
        { 
          text: 'Privado', 
          onPress: () => setSettings(prev => ({ ...prev, profileVisibility: 'private' }))
        },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  const handleDownloadData = () => {
    Alert.alert(
      'Descargar Datos',
      'Recibirás un correo con todos tus datos en formato JSON dentro de 24 horas.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Solicitar', 
          onPress: () => {
            Alert.alert('Éxito', 'Solicitud enviada. Recibirás un correo pronto.');
          }
        }
      ]
    );
  };

  const handleDeleteData = () => {
    Alert.alert(
      'Eliminar Datos',
      '¿Estás seguro? Esta acción eliminará todo tu historial de compras y actividad. Tu cuenta permanecerá activa.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Confirmación', 'Tus datos han sido eliminados.');
          }
        }
      ]
    );
  };

  const getVisibilityLabel = () => {
    switch (settings.profileVisibility) {
      case 'public': return 'Público';
      case 'friends': return 'Solo Amigos';
      case 'private': return 'Privado';
      default: return 'Público';
    }
  };

  const SettingItem = ({ icon, title, subtitle, value, onToggle, onPress, showSwitch = false, showArrow = false }) => (
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
        ) : showArrow ? (
          <Text style={styles.arrow}>›</Text>
        ) : null}
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Privacidad y Datos</Text>
        <Text style={styles.subtitle}>
          Controla cómo se usa tu información personal
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Visibilidad del Perfil</Text>
        <View style={styles.sectionContent}>
          <SettingItem
            icon="👁️"
            title="Visibilidad"
            subtitle={getVisibilityLabel()}
            onPress={handleProfileVisibility}
            showArrow={true}
          />
          <SettingItem
            icon="📧"
            title="Mostrar Email"
            subtitle="Visible en tu perfil público"
            value={settings.showEmail}
            onToggle={() => handleToggleSetting('showEmail')}
            showSwitch={true}
          />
          <SettingItem
            icon="📱"
            title="Mostrar Teléfono"
            subtitle="Visible en tu perfil público"
            value={settings.showPhone}
            onToggle={() => handleToggleSetting('showPhone')}
            showSwitch={true}
          />
          <SettingItem
            icon="📍"
            title="Mostrar Dirección"
            subtitle="Visible en tu perfil público"
            value={settings.showAddress}
            onToggle={() => handleToggleSetting('showAddress')}
            showSwitch={true}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recopilación de Datos</Text>
        <View style={styles.sectionContent}>
          <SettingItem
            icon="📊"
            title="Recopilación de Datos"
            subtitle="Permitir análisis de uso"
            value={settings.allowDataCollection}
            onToggle={() => handleToggleSetting('allowDataCollection')}
            showSwitch={true}
          />
          <SettingItem
            icon="🎯"
            title="Anuncios Personalizados"
            subtitle="Mostrar anuncios relevantes"
            value={settings.allowPersonalizedAds}
            onToggle={() => handleToggleSetting('allowPersonalizedAds')}
            showSwitch={true}
          />
          <SettingItem
            icon="🔗"
            title="Compartir con Terceros"
            subtitle="Compartir datos con socios"
            value={settings.allowThirdPartySharing}
            onToggle={() => handleToggleSetting('allowThirdPartySharing')}
            showSwitch={true}
          />
          <SettingItem
            icon="📍"
            title="Seguimiento de Actividad"
            subtitle="Rastrear tu actividad en la app"
            value={settings.activityTracking}
            onToggle={() => handleToggleSetting('activityTracking')}
            showSwitch={true}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tus Datos</Text>
        <View style={styles.sectionContent}>
          <SettingItem
            icon="⬇️"
            title="Descargar mis Datos"
            subtitle="Obtener copia de tu información"
            onPress={handleDownloadData}
            showArrow={true}
          />
          <TouchableOpacity style={styles.dangerItem} onPress={handleDeleteData}>
            <Text style={styles.dangerIcon}>🗑️</Text>
            <View style={styles.dangerText}>
              <Text style={styles.dangerTitle}>Eliminar mis Datos</Text>
              <Text style={styles.dangerSubtitle}>Borrar historial y actividad</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>🔒 Tu privacidad es importante</Text>
        <Text style={styles.infoText}>
          Usamos tus datos para mejorar tu experiencia. Puedes controlar qué información compartimos y cómo la usamos.
        </Text>
        <TouchableOpacity onPress={() => console.log('Ver política')}>
          <Text style={styles.infoLink}>Ver Política de Privacidad</Text>
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
  header: {
    padding: 20,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray,
    lineHeight: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  sectionContent: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginHorizontal: 16,
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
  infoBox: {
    backgroundColor: colors.lightBackground,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    marginBottom: 32,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.gray,
    lineHeight: 20,
    marginBottom: 12,
  },
  infoLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
});

export default PrivacySettingsScreen;
