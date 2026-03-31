import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { encode, decode } from '@javanizr/core'
import styles from './styles'

type Mode = 'encode' | 'decode'
type VariantKey = 'av' | 'feu' | 'custom'

const VARIANTS: VariantKey[] = ['av', 'feu', 'custom']

export default function TranslatorScreen() {
    const [input, setInput] = useState('')
    const [mode, setMode] = useState<Mode>('encode')
    const [variant, setVariant] = useState<VariantKey>('av')
    const [customSyllable, setCustomSyllable] = useState('')

    const syllable = variant === 'custom' ? customSyllable : variant

    const result =
        input && syllable
            ? mode === 'encode'
                ? encode(input, syllable)
                : decode(input, syllable)
            : ''

    const handleSwap = () => {
        setMode(m => (m === 'encode' ? 'decode' : 'encode'))
        setInput(result)
    }

    return (
        <View style={styles.container}>
            {/* Sélecteur de variante */}
            <View style={styles.variantRow}>
                {VARIANTS.map(v => (
                    <TouchableOpacity
                        key={v}
                        style={[styles.variantBtn, variant === v && styles.variantBtnActive]}
                        onPress={() => setVariant(v)}
                    >
                        <Text style={[styles.variantText, variant === v && styles.variantTextActive]}>
                            {v}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {variant === 'custom' && (
                <TextInput
                    style={styles.customInput}
                    value={customSyllable}
                    onChangeText={setCustomSyllable}
                    placeholder="Entrez votre syllabe..."
                    autoCapitalize="none"
                />
            )}

            {/* Zone de saisie */}
            <View style={styles.textBox}>
                <Text style={styles.label}>
                    {mode === 'encode' ? 'Texte original' : 'Texte encodé'}
                </Text>
                <TextInput
                    style={styles.input}
                    value={input}
                    onChangeText={setInput}
                    multiline
                    placeholder={
                        mode === 'encode'
                            ? 'Entrez votre texte...'
                            : 'Entrez le texte encodé...'
                    }
                    textAlignVertical="top"
                />
            </View>

            {/* Bouton swap */}
            <TouchableOpacity style={styles.swapBtn} onPress={handleSwap}>
                <Text style={styles.swapText}>
                    {mode === 'encode' ? '⇅  Encoder → Décoder' : '⇅  Décoder → Encoder'}
                </Text>
            </TouchableOpacity>

            {/* Résultat */}
            <View style={styles.textBox}>
                <Text style={styles.label}>
                    {mode === 'encode' ? 'Texte encodé' : 'Texte décodé'}
                </Text>
                <Text selectable style={[styles.result, !result && styles.placeholder]}>
                    {result ||
                        (syllable
                            ? 'Le résultat apparaîtra ici...'
                            : 'Entrez une syllabe personnalisée...')}
                </Text>
            </View>
        </View>
    )
}
