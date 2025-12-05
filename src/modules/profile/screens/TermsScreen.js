import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { colors } from '../../../theme/colors';
import Header from '../../../components/Header';

const TermsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Header title="Términos y Condiciones" onBack={() => navigation.goBack()} />
      <View style={styles.header}>
        <Text style={styles.lastUpdated}>Última actualización: 1 de enero de 2024</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Aceptación de los Términos</Text>
          <Text style={styles.sectionText}>
            Al acceder y utilizar esta aplicación, aceptas estar sujeto a estos términos y condiciones de uso. 
            Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestra aplicación.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Uso de la Aplicación</Text>
          <Text style={styles.sectionText}>
            Esta aplicación está destinada para uso personal y no comercial. Te comprometes a:
          </Text>
          <Text style={styles.bulletPoint}>• Proporcionar información precisa y actualizada</Text>
          <Text style={styles.bulletPoint}>• Mantener la seguridad de tu cuenta</Text>
          <Text style={styles.bulletPoint}>• No utilizar la aplicación para actividades ilegales</Text>
          <Text style={styles.bulletPoint}>• Respetar los derechos de otros usuarios</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Cuenta de Usuario</Text>
          <Text style={styles.sectionText}>
            Para utilizar ciertas funciones de la aplicación, debes crear una cuenta. Eres responsable de:
          </Text>
          <Text style={styles.bulletPoint}>• Mantener la confidencialidad de tu contraseña</Text>
          <Text style={styles.bulletPoint}>• Todas las actividades que ocurran bajo tu cuenta</Text>
          <Text style={styles.bulletPoint}>• Notificar inmediatamente cualquier uso no autorizado</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Compras y Pagos</Text>
          <Text style={styles.sectionText}>
            Al realizar una compra a través de nuestra aplicación:
          </Text>
          <Text style={styles.bulletPoint}>• Todos los precios están sujetos a cambios sin previo aviso</Text>
          <Text style={styles.bulletPoint}>• Los pagos se procesan de forma segura</Text>
          <Text style={styles.bulletPoint}>• Las transacciones están sujetas a verificación</Text>
          <Text style={styles.bulletPoint}>• Nos reservamos el derecho de rechazar pedidos</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Envíos y Entregas</Text>
          <Text style={styles.sectionText}>
            Los tiempos de entrega son estimados y pueden variar. No somos responsables por retrasos 
            causados por circunstancias fuera de nuestro control.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Devoluciones y Reembolsos</Text>
          <Text style={styles.sectionText}>
            Aceptamos devoluciones dentro de los 30 días posteriores a la compra, siempre que:
          </Text>
          <Text style={styles.bulletPoint}>• El producto esté en su estado original</Text>
          <Text style={styles.bulletPoint}>• Se incluya el empaque original</Text>
          <Text style={styles.bulletPoint}>• Se proporcione el comprobante de compra</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Propiedad Intelectual</Text>
          <Text style={styles.sectionText}>
            Todo el contenido de la aplicación, incluyendo textos, imágenes, logos y software, 
            está protegido por derechos de autor y otras leyes de propiedad intelectual.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Privacidad</Text>
          <Text style={styles.sectionText}>
            Tu privacidad es importante para nosotros. Consulta nuestra Política de Privacidad 
            para obtener información sobre cómo recopilamos, utilizamos y protegemos tu información.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Limitación de Responsabilidad</Text>
          <Text style={styles.sectionText}>
            En ningún caso seremos responsables por daños indirectos, incidentales, especiales 
            o consecuentes que resulten del uso de nuestra aplicación.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Modificaciones</Text>
          <Text style={styles.sectionText}>
            Nos reservamos el derecho de modificar estos términos en cualquier momento. 
            Las modificaciones entrarán en vigor inmediatamente después de su publicación.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. Contacto</Text>
          <Text style={styles.sectionText}>
            Si tienes preguntas sobre estos términos, puedes contactarnos en:
          </Text>
          <Text style={styles.contactInfo}>Email: legal@tutienda.com</Text>
          <Text style={styles.contactInfo}>Teléfono: +1 (234) 567-890</Text>
        </View>
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
  header: {
    padding: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 4,
  },
  lastUpdated: {
    fontSize: 14,
    color: colors.gray,
  },
  content: {
    padding: 0,
    marginTop: 10
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: colors.dark,
    lineHeight: 20,
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 14,
    color: colors.dark,
    lineHeight: 20,
    marginLeft: 16,
    marginBottom: 4,
  },
  contactInfo: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 16,
    marginBottom: 4,
  },
});

export default TermsScreen;
