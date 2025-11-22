import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { colors } from '../../../theme/colors';

const ProfileHeader = ({ profile, onEditPress }) => {
  const { user } = useAuth();
  
  if (!profile && !user) return null;
  
  // Usar datos del contexto si no hay profile
  const displayData = profile || user;

  // Generar iniciales del nombre
  const getInitials = () => {
    const firstName = displayData.firstName || '';
    const lastName = displayData.lastName || '';
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    return initials || '??';
  };

  // Generar color de fondo basado en el nombre
  const getAvatarColor = () => {
    const avatarColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
    const fullName = displayData.firstName + displayData.lastName || 'User';
    const index = fullName.length % avatarColors.length;
    return avatarColors[index];
  };

  const getFullName = () => {
    return `${displayData.firstName || ''} ${displayData.lastName || ''}`.trim() || 'Usuario';
  };

  const getMemberSince = () => {
    if (!displayData.createdAt) return 'Nuevo miembro';
    return `Miembro desde ${new Date(displayData.createdAt).getFullYear()}`;
  };

  const handleChangeAvatar = () => {
    Alert.alert(
      'Cambiar Foto de Perfil',
      'Selecciona una opción',
      [
        { text: 'Tomar Foto', onPress: () => console.log('Tomar foto') },
        { text: 'Elegir de Galería', onPress: () => console.log('Galería') },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        {displayData.avatar ? (
          <Image 
            source={{ uri: displayData.avatar }}
            style={styles.avatar}
          />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder, { backgroundColor: getAvatarColor() }]}>
            <Text style={styles.avatarInitials}>{getInitials()}</Text>
          </View>
        )}
        <TouchableOpacity 
          style={styles.editAvatarButton}
          onPress={handleChangeAvatar}
        >
          <Text style={styles.editAvatarText}>📷</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{getFullName()}</Text>
        <Text style={styles.email}>{displayData.email}</Text>
        <Text style={styles.memberSince}>{getMemberSince()}</Text>
      </View>
      
      <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
        <Text style={styles.editButtonText}>✏️ Editar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.lightGray,
    borderWidth: 3,
    borderColor: colors.white,
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: colors.primary,
    borderRadius: 15,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  editAvatarText: {
    fontSize: 14,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 2,
  },
  memberSince: {
    fontSize: 12,
    color: colors.lightGray,
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
});

export default ProfileHeader;