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
import { useProfile } from '../hooks/useProfile';
import { colors } from '../../../theme/colors';
import Header from '../../../components/Header';

const AddAddressScreen = ({ navigation }) => {
  const { addAddress, loading } = useProfile();
  const [formData, setFormData] = useState({
    type: 'home',
    address: '',
    reference: '',
    isPrimary: false,
  });
  const [loadingLocation, setLoadingLocation] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUseCurrentLocation = () => {
    setLoadingLocation(true);
    
    // Simular obtención de ubicación
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        address: 'Av. Principal 123, Colonia Centro, Ciudad de México, CDMX, México'
      }));
      setLoadingLocation(false);
      Alert.alert('✅ Ubicación obtenida', 'Se ha detectado tu ubicación actual');
    }, 2000);
  };

  const handleSave = async () => {
    // Validaciones simplificadas
    if (!formData.address.trim()) {
      Alert.alert('Error', 'Debes agregar una dirección');
      return;
    }

    const addressData = {
      type: formData.type,
      fullAddress: formData.address,
      reference: formData.reference,
      isPrimary: formData.isPrimary
    };

    const result = await addAddress(addressData);
    
    if (result.success) {
      Alert.alert('Éxito', 'Dirección agregada correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert('Error', result.error || 'Error al agregar la dirección');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Header title="Agregar Dirección" onBack={() => navigation.goBack()} />
      <View>
        <Text style={styles.title}>📍 Agregar Dirección</Text>
        <Text style={styles.subtitle}>Agrega tu dirección de forma rápida y sencilla</Text>
        
        {/* Botón de ubicación actual */}
        <TouchableOpacity 
          style={styles.locationButton}
          onPress={handleUseCurrentLocation}
          disabled={loadingLocation}
        >
          {loadingLocation ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.locationButtonText}>Usar mi ubicación actual</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>o ingresa manualmente</Text>
          <View style={styles.dividerLine} />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tipo de Dirección</Text>
          <View style={styles.typeContainer}>
            {[
              { key: 'home', label: '🏠 Casa' },
              { key: 'work', label: '🏢 Trabajo' },
              { key: 'other', label: '📍 Otro' }
            ].map((type) => (
              <TouchableOpacity
                key={type.key}
                style={[
                  styles.typeOption,
                  formData.type === type.key && styles.typeOptionSelected
                ]}
                onPress={() => handleInputChange('type', type.key)}
              >
                <Text style={[
                  styles.typeText,
                  formData.type === type.key && styles.typeTextSelected
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dirección Completa *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.address}
            onChangeText={(value) => handleInputChange('address', value)}
            placeholder="Ej: Av. Reforma 123, Col. Centro, Ciudad de México, CDMX"
            placeholderTextColor={colors.gray}
            multiline={true}
            numberOfLines={3}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Referencia (Opcional)</Text>
          <TextInput
            style={styles.input}
            value={formData.reference}
            onChangeText={(value) => handleInputChange('reference', value)}
            placeholder="Ej: Casa azul, entre farmacia y panadería"
            placeholderTextColor={colors.gray}
          />
        </View>

        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => handleInputChange('isPrimary', !formData.isPrimary)}
          >
            <View style={[
              styles.checkboxBox,
              formData.isPrimary && styles.checkboxBoxChecked
            ]}>
              {formData.isPrimary && <Text style={styles.checkboxCheck}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Establecer como dirección principal</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.saveButtonText}>Guardar Dirección</Text>
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
    paddingHorizontal: 10,
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
  },
  locationButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  locationIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  locationButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
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
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeOption: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  typeOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeText: {
    fontSize: 14,
    color: colors.dark,
  },
  typeTextSelected: {
    color: colors.white,
    fontWeight: '600',
  },
  checkboxContainer: {
    marginBottom: 20,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxBoxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxCheck: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: colors.dark,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
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

export default AddAddressScreen;
