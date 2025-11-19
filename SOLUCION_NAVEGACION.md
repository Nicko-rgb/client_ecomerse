# 🔧 Solución: Navegación y Edición de Perfil

## Problema Actual
- No se puede navegar a las pantallas del perfil
- No se puede editar el perfil

## ✅ Solución Paso a Paso

### 1. Verificar que el AppNavigator esté actualizado
El archivo `src/navigation/AppNavigator.js` ya está actualizado con todas las pantallas.

### 2. Reiniciar completamente la aplicación

```bash
# 1. Detener Metro bundler (Ctrl+C)
# 2. Limpiar caché y reiniciar
npx expo start --clear
```

### 3. Verificar que el servidor esté corriendo

```bash
# En otra terminal
cd server_ecomerse
npm start
```

### 4. Probar navegación paso a paso

#### Opción A: Usar ProfileScreen normal
1. Ve a la tab "Perfil"
2. Toca "Editar Perfil" → debe navegar a EditProfile
3. Toca "Direcciones" → debe navegar a AddressesScreen

#### Opción B: Usar ProfileScreen de debug (temporal)
Si la navegación no funciona, puedes usar temporalmente la versión de debug:

1. Abre `src/navigation/AppNavigator.js`
2. Cambia la importación:
```javascript
// Cambiar esta línea:
import ProfileScreen from '../modules/profile/screens/ProfileScreen';

// Por esta:
import ProfileScreen from '../modules/profile/screens/ProfileScreenDebug';
```

3. Reinicia la app y verás información de debug en la pantalla

### 5. Verificar errores comunes

#### Error: "Cannot read property 'navigate' of undefined"
**Causa**: El componente no recibe la prop `navigation`
**Solución**: Asegúrate de que ProfileScreen esté registrado en el Stack Navigator

#### Error: "The action 'NAVIGATE' with payload was not handled"
**Causa**: La pantalla de destino no está registrada
**Solución**: Verifica que todas las pantallas estén en AppNavigator.js

#### Error: "Network request failed"
**Causa**: El servidor no está corriendo o la IP es incorrecta
**Solución**: 
```bash
# Verificar servidor
curl http://10.106.183.4:5000/api/profile/1

# Si no funciona, actualizar IP en src/config/api.js
```

### 6. Test de navegación manual

Agrega este código temporal en ProfileScreen para probar:

```javascript
const testNavigation = () => {
  console.log('Navigation object:', navigation);
  console.log('Available routes:', navigation.getState?.());
  
  try {
    navigation.navigate('EditProfile');
    console.log('✅ Navigation successful');
  } catch (error) {
    console.error('❌ Navigation failed:', error);
  }
};

// Agregar botón de prueba
<TouchableOpacity onPress={testNavigation}>
  <Text>TEST NAVIGATION</Text>
</TouchableOpacity>
```

### 7. Verificar estructura de archivos

Asegúrate de que existan estos archivos:
```
src/modules/profile/screens/
├── ProfileScreen.js ✅
├── EditProfileScreen.js ✅
├── AddressesScreen.js ✅
├── AddAddressScreen.js ✅
├── PaymentMethodsScreen.js ✅
├── OrderHistoryScreen.js ✅
├── SettingsScreen.js ✅
├── HelpScreen.js ✅
└── TermsScreen.js ✅
```

### 8. Si nada funciona

1. **Revierte a una versión simple**:
   - Comenta todas las pantallas nuevas en AppNavigator.js
   - Deja solo ProfileScreen
   - Agrega las pantallas una por una

2. **Verifica las importaciones**:
   ```bash
   # Ejecuta este comando para verificar sintaxis
   npx expo doctor
   ```

3. **Usa la versión de debug**:
   - Cambia a ProfileScreenDebug.js temporalmente
   - Revisa los logs en la consola

## 🎯 Resultado Esperado

Después de seguir estos pasos:
- ✅ La navegación debe funcionar
- ✅ Puedes editar el perfil
- ✅ Todas las pantallas son accesibles
- ✅ Los datos se cargan correctamente

## 📞 Si sigues teniendo problemas

1. Comparte los logs de error específicos
2. Verifica que React Navigation esté instalado correctamente
3. Asegúrate de que todas las dependencias estén actualizadas