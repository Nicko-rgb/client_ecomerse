import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  Alert,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../../../context/AuthContext';
import ProfileHeader from '../components/ProfileHeader';
import ProfileMenuItem from '../components/ProfileMenuItem';
import { colors } from '../../../theme/colors';

const ProfileScreen = ({ navigation }) => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { 
    profile, 
    addresses, 
    paymentMethods, 
    loading, 
    error,
    refreshProfile 
  } = useProfile();
  
  const [refreshing, setRefreshing] = useState(false);

  // No necesitamos el useEffect con Alert, solo mostramos la pantalla de login

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshProfile();
    setRefreshing(false);
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile', { profile });
  };

  const handleAddresses = () => {
    navigation.navigate('AddressesScreen', { addresses });
  };

  const handlePaymentMethods = () => {
    navigation.navigate('PaymentMethodsScreen', { paymentMethods });
  };

  const handleOrderHistory = () => {
    navigation.navigate('OrderHistoryScreen');
  };

  const handleSettings = () => {
    navigation.navigate('SettingsScreen');
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cerrar Sesión', 
          style: 'destructive', 
          onPress: async () => {
            await logout();
            navigation.navigate('LoginScreen');
          }
        },
      ]
    );
  };

  // Mostrar pantalla de login si no está autenticado
  if (!isAuthenticated) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.loginTitle}>🔐</Text>
        <Text style={styles.loginText}>Inicia sesión para ver tu perfil</Text>
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => navigation.navigate('LoginScreen')}
        >
          <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.errorContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={refreshProfile}
        >
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
      <ProfileHeader 
        profile={profile} 
        onEditPress={handleEditProfile}
      />
      
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Mi Cuenta</Text>
        
        <View style={styles.menuContainer}>
          <ProfileMenuItem
            icon="📝"
            title="Editar Perfil"
            subtitle="Información personal"
            onPress={handleEditProfile}
          />
          
          <ProfileMenuItem
            icon="📍"
            title="Direcciones"
            subtitle={`${addresses?.length || 0} direcciones guardadas`}
            onPress={handleAddresses}
          />
          
          <ProfileMenuItem
            icon="💳"
            title="Métodos de Pago"
            subtitle={`${paymentMethods?.length || 0} métodos guardados`}
            onPress={handlePaymentMethods}
          />
          
          <ProfileMenuItem
            icon="📦"
            title="Historial de Pedidos"
            subtitle="Ver pedidos anteriores"
            onPress={handleOrderHistory}
          />
        </View>
      </View>

      {/* Solo mostrar Dashboard Admin si es administrador */}
      {isAdmin && (
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Administración</Text>
          
          <View style={styles.menuContainer}>
            <ProfileMenuItem
              icon="🎛️"
              title="Dashboard Admin"
              subtitle="Panel de administración"
              onPress={() => navigation.navigate('AdminDashboardScreen')}
            />
          </View>
        </View>
      )}

      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Configuración</Text>
        
        <View style={styles.menuContainer}>
          <ProfileMenuItem
            icon="⚙️"
            title="Configuración"
            subtitle="Notificaciones, privacidad"
            onPress={handleSettings}
          />
          
          <ProfileMenuItem
            icon="❓"
            title="Ayuda y Soporte"
            subtitle="Centro de ayuda"
            onPress={() => navigation.navigate('HelpScreen')}
          />
          
          <ProfileMenuItem
            icon="📋"
            title="Términos y Condiciones"
            onPress={() => navigation.navigate('TermsScreen')}
          />
          
          <ProfileMenuItem
            icon="🚪"
            title="Cerrar Sesión"
            onPress={handleLogout}
            showArrow={false}
          />
        </View>
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
    backgroundColor: colors.bg,
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  loginTitle: {
    fontSize: 64,
    marginBottom: 16,
  },
  loginText: {
    fontSize: 18,
    color: colors.dark,
    marginBottom: 24,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.dark,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
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
  menuContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
  },
});

export default ProfileScreen;
