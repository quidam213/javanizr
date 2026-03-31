import { StyleSheet } from 'react-native'

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    variantRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
    },
    variantBtn: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    variantBtnActive: {
        backgroundColor: '#1a73e8',
        borderColor: '#1a73e8',
    },
    variantText: {
        color: '#444',
        fontWeight: '500',
    },
    variantTextActive: {
        color: '#fff',
    },
    customInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
        fontSize: 14,
    },
    textBox: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
    },
    label: {
        fontSize: 12,
        color: '#888',
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    input: {
        flex: 1,
        fontSize: 18,
        color: '#222',
    },
    swapBtn: {
        alignSelf: 'center',
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 24,
        backgroundColor: '#f1f3f4',
        marginVertical: 4,
    },
    swapText: {
        fontSize: 14,
        color: '#1a73e8',
        fontWeight: '600',
    },
    result: {
        flex: 1,
        fontSize: 18,
        color: '#222',
    },
    placeholder: {
        color: '#bbb',
    },
})
