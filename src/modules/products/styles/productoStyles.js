import { StyleSheet } from 'react-native';
import colors from '../../../theme/colors';
import { fontNames } from '../../../theme/fonts';

export default StyleSheet.create({
    container: {
        backgroundColor: colors.bg,
        paddingHorizontal: 10
    },

    // Header
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 8 
    },
    headerTitle: {
        fontFamily: fontNames.playpenBold,
        color: colors.primary,
        fontSize: 18
    },

    // Caja de imagenes
    mediaBox: {
        flexDirection: 'row',
        gap: 12,
        position: 'relative',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        overflow: 'hidden',
        height: 350
    },
    thumbsCol: {
        position: 'absolute',
        top: 5,
        left: 5,
        bottom: 5,
        width: 70,
        gap: 6,
        zIndex: 100,
        justifyContent: 'center',
    },
    thumbItem: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
        flex: 1
    },
    thumbItemActive: {
        borderColor: colors.primary,
        borderWidth: 2
    },
    thumbImg: {
        flex: 1,
        objectFit: 'cover'
    },
    mainImageContainer: {
        flex: 1,
    },
    mainImage: {
        flex: 1,
        objectFit: 'contain',
    },
    // Nombre titulo
    titleText: {
        fontFamily: fontNames.playpenBold,
        fontSize: 18,
        color: colors.text,
        flex: 1,
        marginRight: 8
    },

    // Precio y calificacion
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    stars: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontFamily: fontNames.spartanRegular,
        color: colors.muted,
        fontSize: 16
    },
    prices: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    oldPriceText: {
        fontFamily: fontNames.spartanRegular,
        color: colors.muted,
        fontSize: 16,
        textDecorationLine: 'line-through'
    },
    priceText: { 
        backgroundColor: '#E9F6F1',
        borderRadius: 16,
        fontSize: 16,
        paddingHorizontal: 12,
        paddingVertical: 4,
        color: colors.primary,
        fontFamily: fontNames.playpenBold
    },
    actionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 5
    },
    btn: {
        flex: 1,
        borderRadius: 12,
        paddingVertical: 10,
        alignItems: 'center'
    },
    btnOutline: {
        borderWidth: 1,
        borderColor: colors.primary,
        backgroundColor: '#fff'
    },
    btnFill: {
        backgroundColor: colors.primary
    },
    btnText: {
        color: colors.primary,
        fontFamily: fontNames.playpenBold
    },
    description: {
        marginTop: 5,
        color: colors.text,
        textAlign: 'justify',
        fontSize: 18,
        fontFamily: fontNames.spartanRegular
    },
    similaresTitle: { 
        fontFamily: fontNames.playpenBold,
        color: colors.primary
    },
    similaresGrid: { 
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 8,
    },
    similarCard: { 
        width: '48.7%',
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 8
    },
    similarImg: {
        width: '100%',
        height: 90,
        borderRadius: 8,
        objectFit: 'contain'
    },
    similarTitle: {
        marginTop: 6,
        fontFamily: fontNames.playpenBold,
        color: colors.text
    },
    similarPrice: {
        marginTop: 2,
        color: colors.text
    },
})