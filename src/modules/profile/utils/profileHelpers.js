// Funciones helper para el perfil
export const getFullName = (profile) => {
  if (!profile) return '';
  return `${profile.firstName || ''} ${profile.lastName || ''}`.trim();
};

export const getPrimaryAddress = (addresses) => {
  if (!addresses || addresses.length === 0) return null;
  return addresses.find(addr => addr.isPrimary) || addresses[0];
};

export const getPrimaryPaymentMethod = (paymentMethods) => {
  if (!paymentMethods || paymentMethods.length === 0) return null;
  return paymentMethods.find(pm => pm.isPrimary) || paymentMethods[0];
};

export const formatMemberSince = (createdAt) => {
  if (!createdAt) return '';
  return `Miembro desde ${new Date(createdAt).getFullYear()}`;
};