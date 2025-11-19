// Test de importaciones del módulo Profile
// Ejecuta este archivo para verificar que todas las pantallas se importen correctamente

console.log('=== Test de Importaciones del Módulo Profile ===');

try {
  // Importar todas las pantallas
  const {
    ProfileScreen,
    EditProfileScreen,
    AddressesScreen,
    AddAddressScreen,
    PaymentMethodsScreen,
    OrderHistoryScreen,
    SettingsScreen,
    HelpScreen,
    TermsScreen,
    useProfile,
    User,
  } = require('../index');

  console.log('✅ ProfileScreen:', typeof ProfileScreen);
  console.log('✅ EditProfileScreen:', typeof EditProfileScreen);
  console.log('✅ AddressesScreen:', typeof AddressesScreen);
  console.log('✅ AddAddressScreen:', typeof AddAddressScreen);
  console.log('✅ PaymentMethodsScreen:', typeof PaymentMethodsScreen);
  console.log('✅ OrderHistoryScreen:', typeof OrderHistoryScreen);
  console.log('✅ SettingsScreen:', typeof SettingsScreen);
  console.log('✅ HelpScreen:', typeof HelpScreen);
  console.log('✅ TermsScreen:', typeof TermsScreen);
  console.log('✅ useProfile:', typeof useProfile);
  console.log('✅ User:', typeof User);

  console.log('\n🎉 Todas las importaciones son exitosas!');
  
} catch (error) {
  console.error('❌ Error en las importaciones:', error.message);
  console.error('Stack:', error.stack);
}

console.log('=== Fin del Test ===');