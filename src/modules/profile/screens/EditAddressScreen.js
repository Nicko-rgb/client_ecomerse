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
import { colors } from '../../../theme/colors';
import Header from '../../../components/Header';

const EditAddressScreen = ({ navigation, route }) => {
  const { address } = route.params;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'home',
    fullAddress: '',
    reference: '',
    isPrimary: false,
  });

  useEffect(() => {
    if (address) {
      setFormData({
        type: address.type || 'home',
        fullAddress: address.fullAddress || '',
        reference: address.reference || '',
        isPrimary: address.isPrimary || false,
      });
    }
  }, [address]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    // Validaciones
    if (!formData.fullAddress.trim()) {
      Alert.alert('Error', 'La dirección es obligatoria');
      return;
    }

    setLoading(true);
    
    try {
      // Simular actualización de dirección
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert('Éxito', 'Dirección actualizada correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Error al actualizar la dirección');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Dirección',
      '¿Estás seguro de que quieres eliminar esta dirección?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive', 
          onPress: () => {
            // Lógica para eliminar dirección
            console.log('Eliminar dirección:', address.id);
            navigation.goBack();
          }
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Header title="Editar Dirección" onBack={() => navigation.goBack()} />
      <View style={styles.form}>
        <Text style={styles.title}>Editar Dirección</Text>
        
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
            value={formData.fullAddress}
            onChangeText={(value) => handleInputChange('fullAddress', value)}
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
            <Text style={styles.saveButtonText}>Guardar Cambios</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Text style={styles.deleteButtonText}>Eliminar Dirección</Text>
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
    marginBottom: 24,
    textAlign: 'center',
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
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
  deleteButton: {
    backgroundColor: colors.error || '#FF6B6B',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  deleteButtonText: {
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

export default EditAddressScreen;
