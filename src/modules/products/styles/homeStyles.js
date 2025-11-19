import { StyleSheet } from 'react-native';
import colors from '../../../theme/colors';
import { fontNames } from '../../../theme/fonts';


export default StyleSheet.create({
    container: { 
        flex: 1,
        backgroundColor: colors.bg,
        paddingHorizontal: 10,
        flexDirection: 'column',
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.primary,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 0,
        backgroundColor: '#fff',
        marginTop: 5,
    },

    // Category Chips
    chipsRow: { 
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    chipsContent: {
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'red',
    },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 16,
        minHeight: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.primary,
        marginRight: 8,
    },
    chipText: {
        fontSize: 12,
        lineHeight: 14,
        textAlignVertical: 'center',
        color: colors.primary,
    },

    // Product Grid
    grid: { 
        paddingBottom: 16,
        borderWidth: 1,
        borderColor: 'red',
    },
    cardItem: {
        flex: 1,
        marginBottom: 8,
    },
});