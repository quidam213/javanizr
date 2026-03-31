import { StyleSheet } from 'react-native'
import type { ThemeColors } from './theme'

export function getStyles(C: ThemeColors) {
    return StyleSheet.create({
        keyboardView: {
            flex: 1,
            backgroundColor: C.bg,
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
            backgroundColor: C.bg,
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
            borderColor: C.border,
            backgroundColor: C.surface,
        },
        variantBtnActive: {
            backgroundColor: C.accent,
            borderColor: C.accent,
        },
        variantText: {
            color: C.textMuted,
            fontWeight: '500',
            fontSize: 13,
        },
        variantTextActive: {
            color: '#fff',
        },
        customInput: {
            borderWidth: 1,
            borderColor: C.border,
            borderRadius: 8,
            padding: 10,
            marginBottom: 12,
            fontSize: 14,
            backgroundColor: C.surface,
            color: C.text,
        },
        textBox: {
            flex: 1,
            borderWidth: 1,
            borderColor: C.border,
            borderRadius: 12,
            padding: 12,
            marginBottom: 8,
            backgroundColor: C.surface,
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
            color: C.textMuted,
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
            color: C.text,
            minHeight: 80,
        },
        charCount: {
            fontSize: 11,
            color: C.placeholder,
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
            backgroundColor: C.surface,
            borderWidth: 1,
            borderColor: C.border,
        },
        swapText: {
            fontSize: 14,
            color: C.accent,
            fontWeight: '600',
        },
        resultActions: {
            flexDirection: 'row',
            gap: 4,
        },
        actionBtn: {
            padding: 4,
        },
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
            color: C.text,
            minHeight: 80,
        },
        placeholder: {
            color: C.placeholder,
        },

        // Modal partagé
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'flex-end',
        },
        modalSheet: {
            backgroundColor: C.surface,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            height: '70%',
            paddingBottom: 24,
        },
        modalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: C.border,
        },
        modalTitle: {
            color: C.text,
            fontSize: 16,
            fontWeight: '700',
        },

        // Modal historique
        historyEmpty: {
            color: C.placeholder,
            textAlign: 'center',
            marginTop: 40,
            fontSize: 14,
        },
        historyItem: {
            paddingHorizontal: 16,
            paddingVertical: 12,
        },
        historyMeta: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            marginBottom: 4,
        },
        historyVariant: {
            color: C.accent,
            fontSize: 12,
            fontWeight: '600',
        },
        historyMode: {
            color: C.textMuted,
            fontSize: 12,
        },
        historyDeleteBtn: {
            marginLeft: 'auto',
        },
        historyDate: {
            color: C.placeholder,
            fontSize: 11,
            marginBottom: 2,
        },
        historyRowActions: {
            marginLeft: 'auto',
            flexDirection: 'row',
            gap: 8,
            alignItems: 'center',
        },
        historyText: {
            color: C.text,
            fontSize: 14,
        },
        historySeparator: {
            height: 1,
            backgroundColor: C.border,
            marginHorizontal: 16,
        },

        // Modal info
        infoContent: {
            padding: 16,
            gap: 6,
        },
        infoSection: {
            color: C.accent,
            fontSize: 15,
            fontWeight: '700',
            letterSpacing: 0.5,
            marginTop: 20,
            marginBottom: 4,
        },
        infoText: {
            color: C.textMuted,
            fontSize: 14,
            lineHeight: 20,
        },
        infoLink: {
            color: C.accent,
            fontSize: 14,
            marginTop: 4,
        },
        infoVersion: {
            color: C.placeholder,
            fontSize: 12,
            textAlign: 'center',
            marginTop: 24,
            marginBottom: 8,
        },

        // Modal thème
        themeModalSheet: {
            backgroundColor: C.surface,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            paddingBottom: 32,
        },
        themeContent: {
            padding: 16,
            gap: 16,
        },
        themeLabel: {
            fontSize: 12,
            color: C.textMuted,
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: 0.8,
            marginBottom: 4,
        },
        themeModeRow: {
            flexDirection: 'row',
            gap: 8,
        },
        themeModeBtn: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            paddingVertical: 12,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: C.border,
            backgroundColor: C.bg,
        },
        themeModeBtnActive: {
            borderColor: C.accent,
            backgroundColor: C.accent + '1a',
        },
        themeModeBtnText: {
            color: C.textMuted,
            fontWeight: '600',
            fontSize: 14,
        },
        themeModeBtnTextActive: {
            color: C.accent,
        },
        accentRow: {
            flexDirection: 'row',
            gap: 12,
            alignItems: 'center',
        },
        accentDot: {
            width: 36,
            height: 36,
            borderRadius: 18,
            borderWidth: 3,
            borderColor: 'transparent',
        },
        accentDotActive: {
            borderColor: C.text,
        },
    })
}
