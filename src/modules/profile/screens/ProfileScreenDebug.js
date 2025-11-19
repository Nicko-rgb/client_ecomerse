import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  StyleSheet, 
  Alert,
  RefreshControl 
} from 'react-native';
import { useProfile } from '../hooks/useProfile';
import { colors } from '../../../theme/colors';

const ProfileScreenDebug = ({ navigation }) => {
  const { 
    profile, 
    addresses, 
    paymentMethods, 
    loading, 
    error,
    refreshProfile 
  } = useProfile();
  
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshProfile();
    setRefreshing(false);
  };

  const handleNavigation = (screenName, params = {}) => {
    console.log(`Intentando navegar a: ${screenName}`);
    try {
      navigation.navigate(screenName, params);
      console.log(`✅ Navegación exitosa a: ${screenName}`);
    } catch (error) {
      console.error(`❌ Error navegando a ${screenName}:`, error);
      Alert.alert('Error de Navegación', `No se pudo navegar a ${screenName}\n\nError: ${error.message}`);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar Sesión', style: 'destructive', onPress: () => {
          console.log('Logout');
        }},
      ]
    );
  };

  // Debug info
  console.log('ProfileScreen Debug Info:', {
    profile: !!profile,
    addresses: addresses?.length || 0,
    paymentMethods: paymentMethods?.length || 0,
    loading,
    error,
    navigation: !!navigation
  });

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refreshProfile}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header del perfil */}
      <View style={styles.profileHeader}>
        <Text style={styles.profileName}>
          {profile ? `${profile.firstName} ${profile.lastName}` : 'Cargando...'}
        </Text>
        <Text style={styles.profileEmail}>
          {profile ? profile.email : 'Cargando...'}
        </Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => handleNavigation('EditProfile', { profile })}
        >
          <Text style={styles.editButtonText}>Editar Perfil</Text>
        </TouchableOpacity>
      </View>
      
      {/* Menú principal */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Mi Cuenta</Text>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => handleNavigation('EditProfile', { profile })}
        >
          <Text style={styles.menuIcon}>📝</Text>
          <View style={styles.menuText}>
            <Text style={styles.menuTitle}>Editar Perfil</Text>
            <Text style={styles.menuSubtitle}>Información personal</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => handleNavigation('AddressesScreen', { addresses })}
        >
          <Text style={styles.menuIcon}>📍</Text>
          <View style={styles.menuText}>
            <Text style={styles.menuTitle}>Direcciones</Text>
            <Text style={styles.menuSubtitle}>{addresses?.length || 0} direcciones guardadas</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => handleNavigation('PaymentMethodsScreen', { paymentMethods })}
        >
          <Text style={styles.menuIcon}>💳</Text>
          <View style={styles.menuText}>
            <Text style={styles.menuTitle}>Métodos de Pago</Text>
            <Text style={styles.menuSubtitle}>{paymentMethods?.length || 0} métodos guardados</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => handleNavigation('OrderHistoryScreen')}
        >
          <Text style={styles.menuIcon}>📦</Text>
          <View style={styles.menuText}>
            <Text style={styles.menuTitle}>Historial de Pedidos</Text>
            <Text style={styles.menuSubtitle}>Ver pedidos anteriores</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Configuración */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Configuración</Text>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => handleNavigation('SettingsScreen')}
        >
          <Text style={styles.menuIcon}>⚙️</Text>
          <View style={styles.menuText}>
            <Text style={styles.menuTitle}>Configuración</Text>
            <Text style={styles.menuSubtitle}>Notificaciones, privacidad</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => handleNavigation('HelpScreen')}
        >
          <Text style={styles.menuIcon}>❓</Text>
          <View style={styles.menuText}>
            <Text style={styles.menuTitle}>Ayuda y Soporte</Text>
            <Text style={styles.menuSubtitle}>Centro de ayuda</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => handleNavigation('TermsScreen')}
        >
          <Text style={styles.menuIcon}>📋</Text>
          <View style={styles.menuText}>
            <Text style={styles.menuTitle}>Términos y Condiciones</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={handleLogout}
        >
          <Text style={styles.menuIcon}>🚪</Text>
          <View style={styles.menuText}>
            <Text style={styles.menuTitle}>Cerrar Sesión</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Debug info */}
      <View style={styles.debugSection}>
        <Text style={styles.debugTitle}>Debug Info:</Text>
        <Text style={styles.debugText}>Profile loaded: {profile ? 'Yes' : 'No'}</Text>
        <Text style={styles.debugText}>Addresses: {addresses?.length || 0}</Text>
        <Text style={styles.debugText}>Payment methods: {paymentMethods?.length || 0}</Text>
        <Text style={styles.debugText}>Loading: {loading ? 'Yes' : 'No'}</Text>
        <Text style={styles.debugText}>Error: {error || 'None'}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  profileHeader: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  menuSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  menuIcon: {
    fontSize: 18,
    marginRight: 12,
    width: 30,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.dark,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: colors.gray,
  },
  menuArrow: {
    fontSize: 20,
    color: colors.gray,
  },
  debugSection: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 8,
  },
  debugText: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 4,
  },
});

export default ProfileScreenDebug;