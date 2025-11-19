# Configuración de Red para Desarrollo

## Problema
React Native no puede conectarse a `localhost` desde el emulador/dispositivo físico.

## Solución
Usar la IP local de tu computadora en lugar de localhost.

## Pasos para configurar:

### 1. Obtener tu IP local

**Windows:**
```bash
ipconfig
```
Busca la "Dirección IPv4" en tu adaptador de red activo (Wi-Fi o Ethernet).

**Mac/Linux:**
```bash
ifconfig
```
Busca la dirección IP en tu interfaz de red activa.

### 2. Actualizar configuración

Edita el archivo `src/config/api.js` y cambia la `LOCAL_IP`:

```javascript
const API_CONFIG = {
  LOCAL_IP: 'TU_IP_AQUI', // Ejemplo: '192.168.1.100'
  PORT: '5000',
  // ...
};
```

### 3. Reiniciar servicios

1. **Backend:** Reinicia el servidor Node.js
2. **Frontend:** Reinicia Metro bundler y la app

## IP Actual Configurada
- **IP:** `10.106.183.4`
- **Puerto:** `5000`
- **URL completa:** `http://10.106.183.4:5000`

## Verificar conexión

Prueba en tu navegador:
```
http://10.106.183.4:5000/api/profile/1
```

Deberías ver una respuesta JSON con los datos del perfil.

## Notas importantes

- La IP puede cambiar si te conectas a una red diferente
- Asegúrate de que tu firewall permita conexiones en el puerto 5000
- El servidor debe estar configurado para escuchar en `0.0.0.0` (todas las interfaces)

## Troubleshooting

### Error "Network request failed"
1. Verifica que el servidor esté corriendo
2. Confirma que la IP sea correcta
3. Prueba la URL en el navegador
4. Revisa el firewall/antivirus

### Error de CORS
El servidor ya está configurado con CORS habilitado para todas las origins.

### Error de timeout
Aumenta el timeout en las peticiones fetch si es necesario.