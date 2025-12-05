import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import ProfileMenuItem from '../components/ProfileMenuItem';
import { colors } from '../../../theme/colors';
import Header from '../../../components/Header';

const FAQItem = ({ question, answer, isExpanded, onToggle }) => (
  <View style={styles.faqItem}>
    <TouchableOpacity style={styles.faqQuestion} onPress={onToggle}>
      <Text style={styles.questionText}>{question}</Text>
      <Text style={styles.expandIcon}>{isExpanded ? '−' : '+'}</Text>
    </TouchableOpacity>
    {isExpanded && (
      <View style={styles.faqAnswer}>
        <Text style={styles.answerText}>{answer}</Text>
      </View>
    )}
  </View>
);

const HelpScreen = ({ navigation }) => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqs = [
    {
      id: 1,
      question: '¿Cómo puedo realizar un pedido?',
      answer: 'Para realizar un pedido, navega por nuestros productos, agrega los artículos que desees al carrito y procede al checkout. Necesitarás una cuenta y un método de pago válido.'
    },
    {
      id: 2,
      question: '¿Cuáles son los métodos de pago aceptados?',
      answer: 'Aceptamos tarjetas de crédito y débito (Visa, MasterCard, American Express), PayPal y transferencias bancarias.'
    },
    {
      id: 3,
      question: '¿Cuánto tiempo tarda la entrega?',
      answer: 'El tiempo de entrega varía según tu ubicación. Generalmente, los pedidos se entregan entre 3-7 días hábiles. Recibirás un número de seguimiento una vez que tu pedido sea enviado.'
    },
    {
      id: 4,
      question: '¿Puedo devolver un producto?',
      answer: 'Sí, aceptamos devoluciones dentro de los 30 días posteriores a la compra. El producto debe estar en su estado original y con el empaque.'
    },
    {
      id: 5,
      question: '¿Cómo puedo rastrear mi pedido?',
      answer: 'Puedes rastrear tu pedido en la sección "Historial de Pedidos" de tu perfil. También recibirás actualizaciones por email con el número de seguimiento.'
    },
    {
      id: 6,
      question: '¿Cómo cambio mi contraseña?',
      answer: 'Ve a Configuración > Seguridad > Cambiar Contraseña. Necesitarás tu contraseña actual para establecer una nueva.'
    }
  ];

  const handleToggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contactar Soporte',
      'Elige cómo quieres contactarnos:',
      [
        { text: 'Email', onPress: () => Linking.openURL('mailto:soporte@tutienda.com') },
        { text: 'Teléfono', onPress: () => Linking.openURL('tel:+1234567890') },
        { text: 'Chat en vivo', onPress: () => console.log('Abrir chat') },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  const handleReportProblem = () => {
    Alert.alert(
      'Reportar Problema',
      'Puedes contactarnos por:\n\n📧 Email: soporte@ecommerce.com\n📱 WhatsApp: +1234567890\n🌐 Web: www.ecommerce.com/soporte',
      [{ text: 'OK' }]
    );
  };

  const handleViewTerms = () => {
    navigation.navigate('TermsScreen');
  };

  const handleViewPrivacy = () => {
    navigation.navigate('PrivacySettingsScreen');
  };

  return (
    <ScrollView style={styles.container}>
      <Header title="Ayuda y Soporte" onBack={() => navigation.goBack()} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contacto Rápido</Text>
        <View style={styles.contactContainer}>
          <TouchableOpacity style={styles.contactButton} onPress={handleContactSupport}>
            <Text style={styles.contactIcon}>💬</Text>
            <Text style={styles.contactText}>Contactar Soporte</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.contactButton} onPress={handleReportProblem}>
            <Text style={styles.contactIcon}>🐛</Text>
            <Text style={styles.contactText}>Reportar Problema</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preguntas Frecuentes</Text>
        <View style={styles.faqContainer}>
          {faqs.map((faq) => (
            <FAQItem
              key={faq.id}
              question={faq.question}
              answer={faq.answer}
              isExpanded={expandedFAQ === faq.id}
              onToggle={() => handleToggleFAQ(faq.id)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información Legal</Text>
        <View style={styles.menuContainer}>
          <ProfileMenuItem
            icon="📋"
            title="Términos y Condiciones"
            subtitle="Lee nuestros términos de servicio"
            onPress={handleViewTerms}
          />
          
          <ProfileMenuItem
            icon="🔒"
            title="Política de Privacidad"
            subtitle="Cómo protegemos tu información"
            onPress={handleViewPrivacy}
          />
          
          <ProfileMenuItem
            icon="↩️"
            title="Política de Devoluciones"
            subtitle="Información sobre devoluciones"
            onPress={() => console.log('Ver política de devoluciones')}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información de Contacto</Text>
        <View style={styles.contactInfo}>
          <View style={styles.contactInfoItem}>
            <Text style={styles.contactInfoIcon}>📧</Text>
            <View>
              <Text style={styles.contactInfoLabel}>Email</Text>
              <Text style={styles.contactInfoValue}>soporte@tutienda.com</Text>
            </View>
          </View>
          
          <View style={styles.contactInfoItem}>
            <Text style={styles.contactInfoIcon}>📞</Text>
            <View>
              <Text style={styles.contactInfoLabel}>Teléfono</Text>
              <Text style={styles.contactInfoValue}>+1 (234) 567-890</Text>
            </View>
          </View>
          
          <View style={styles.contactInfoItem}>
            <Text style={styles.contactInfoIcon}>🕒</Text>
            <View>
              <Text style={styles.contactInfoLabel}>Horario de Atención</Text>
              <Text style={styles.contactInfoValue}>Lun-Vie: 9:00 AM - 6:00 PM</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 10
  },
  section: {
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 8,
    marginTop: 8,
    paddingHorizontal: 5,
  },
  contactContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  contactButton: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  contactIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
    textAlign: 'center',
  },
  faqContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.dark,
    flex: 1,
    marginRight: 12,
  },
  expandIcon: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: 'bold',
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  answerText: {
    fontSize: 14,
    color: colors.gray,
    lineHeight: 20,
  },
  menuContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  contactInfo: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 16,
  },
  contactInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactInfoIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 30,
  },
  contactInfoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 2,
  },
  contactInfoValue: {
    fontSize: 14,
    color: colors.gray,
  },
});

export default HelpScreen;
