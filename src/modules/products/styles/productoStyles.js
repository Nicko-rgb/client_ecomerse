import { StyleSheet } from 'react-native';
import colors from '../../../theme/colors';
import { fontNames } from '../../../theme/fonts';

export default StyleSheet.create({
    container: { backgroundColor: colors.bg, paddingHorizontal: 12 },
    headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8 },
    headerTitle: { fontFamily: fontNames.playpenBold, color: colors.primary, fontSize: 18 },
    mediaRow: { flexDirection: 'row', gap: 12, paddingVertical: 8 },
    thumbsCol: { width: 72, gap: 8 },
    thumbItem: { borderRadius: 8, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
    thumbItemActive: { borderColor: colors.primary, borderWidth: 2 },
    thumbImg: { width: 72, height: 72 },
    mainImageBox: { flex: 1, borderRadius: 12, overflow: 'hidden', backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border },
    mainImage: { width: '100%', height: 220 },
    titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
    titleText: { fontFamily: fontNames.playpenBold, fontSize: 18, color: colors.text, flex: 1, marginRight: 8 },
    pricePill: { backgroundColor: '#E9F6F1', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6 },
    priceText: { color: colors.primary, fontFamily: fontNames.playpenBold },
    actionsRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
    btn: { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
    btnOutline: { borderWidth: 1, borderColor: colors.primary, backgroundColor: '#fff' },
    btnFill: { backgroundColor: colors.primary },
    btnText: { fontFamily: fontNames.playpenBold },
    description: { marginTop: 12, color: colors.text },
    similaresTitle: { marginTop: 16, fontFamily: fontNames.playpenBold, color: colors.text },
    similaresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 },
    similarCard: { width: '48%', backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 8 },
    similarImg: { width: '100%', height: 90, borderRadius: 8 },
    similarTitle: { marginTop: 6, fontFamily: fontNames.playpenBold, color: colors.text },
    similarPrice: { marginTop: 2, color: colors.text },
});