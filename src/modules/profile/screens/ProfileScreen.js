import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  Alert,
  RefreshControl 
} from 'react-native';
import { useProfile } from '../hooks/useProfile';
import ProfileHeader from '../components/ProfileHeader';
import ProfileMenuItem from '../components/ProfileMenuItem';
import { colors } from '../../../theme/colors';

const ProfileScreen = ({ navigation }) => {
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
        { text: 'Cerrar Sesión', style: 'destructive', onPress: () => {
          // Lógica de logout
          console.log('Logout');
        }},
      ]
    );
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
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
            subtitle={`${addresses.length} direcciones guardadas`}
            onPress={handleAddresses}
          />
          
          <ProfileMenuItem
            icon="💳"
            title="Métodos de Pago"
            subtitle={`${paymentMethods.length} métodos guardados`}
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
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    textAlign: 'center',
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