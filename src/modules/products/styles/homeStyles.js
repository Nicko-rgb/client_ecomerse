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
        flexGrow: 0,
    },
    chipsContent: {
        alignItems: 'center',
        flexGrow: 0,
    },
    chip: {
        paddingHorizontal: 14,
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
        textAlignVertical: 'center',
        color: colors.primary,
    },

    // Product Grid
    grid: { 
        paddingBottom: 16,
    },
    cardItem: {
        flex: 1,
        marginBottom: 8,
    },
});