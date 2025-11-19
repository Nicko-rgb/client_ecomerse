// Configuración de la API
// Cambia esta IP por la IP de tu computadora cuando desarrolles
// Para obtener tu IP: ejecuta 'ipconfig' en Windows o 'ifconfig' en Mac/Linux

const API_CONFIG = {
  // IP local de desarrollo - cambiar según tu red
  LOCAL_IP: '10.106.183.4',
  PORT: '5000',
  
  // URLs de la API
  get BASE_URL() {
    return `http://${this.LOCAL_IP}:${this.PORT}/api`;
  },
  
  // Endpoints
  ENDPOINTS: {
    PROFILE: '/profile',
    ADDRESSES: '/addresses',
    PAYMENT_METHODS: '/payment-methods',
  }
};

export default API_CONFIG;