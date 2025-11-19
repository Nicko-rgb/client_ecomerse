import { StyleSheet } from 'react-native';
import colors from '../../../theme/colors';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  chipsRow: { marginTop: 12, paddingHorizontal: 16 },
  grid: { paddingHorizontal: 12, paddingBottom: 16 },
});