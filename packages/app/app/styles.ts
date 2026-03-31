import { StyleSheet } from 'react-native'

const COLORS = {
    bg: '#1e1f22',
    surface: '#2b2d31',
    border: '#3a3c40',
    text: '#f2f2f2',
    textMuted: '#949ba4',
    accent: '#f97316',
    placeholder: '#5c6370',
}

export default StyleSheet.create({
    keyboardView: {
        flex: 1,
        backgroundColor: COLORS.bg,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        flexGrow: 1,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.bg,
        padding: 16,
    },
    variantRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
    },
    variantBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.surface,
    },
    variantBtnActive: {
        backgroundColor: COLORS.accent,
        borderColor: COLORS.accent,
    },
    variantText: {
        color: COLORS.textMuted,
        fontWeight: '500',
        fontSize: 13,
    },
    variantTextActive: {
        color: '#fff',
    },
    customInput: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
        fontSize: 14,
        backgroundColor: COLORS.surface,
        color: COLORS.text,
    },
    textBox: {
        flex: 1,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
        backgroundColor: COLORS.surface,
        minHeight: 140,
    },
    boxHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    label: {
        fontSize: 11,
        color: COLORS.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        fontWeight: '600',
    },
    clearBtn: {
        padding: 2,
    },
    input: {
        flex: 1,
        fontSize: 18,
        color: COLORS.text,
        minHeight: 80,
    },
    charCount: {
        fontSize: 11,
        color: COLORS.placeholder,
        textAlign: 'right',
        marginTop: 4,
    },
    swapRow: {
        alignItems: 'center',
        marginVertical: 4,
    },
    swapBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 24,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    swapText: {
        fontSize: 14,
        color: COLORS.accent,
        fontWeight: '600',
    },
    resultActions: {
        flexDirection: 'row',
        gap: 4,
    },
    actionBtn: {
        padding: 4,
    },
    // conservé pour compatibilité (utilisé dans résultat header précédent)
    resultHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    copyBtn: {
        padding: 4,
    },
    result: {
        flex: 1,
        fontSize: 18,
        color: COLORS.text,
        minHeight: 80,
    },
    placeholder: {
        color: COLORS.placeholder,
    },
})
