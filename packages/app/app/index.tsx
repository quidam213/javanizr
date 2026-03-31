import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Share, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import { encode, decode, getVariant } from '@javanizr/core'
import styles from './styles'

type Mode = 'encode' | 'decode'
type VariantKey = 'av' | 'feu' | 'custom'

const VARIANTS: VariantKey[] = ['av', 'feu', 'custom']

export default function TranslatorScreen() {
    const [input, setInput] = useState('')
    const [mode, setMode] = useState<Mode>('encode')
    const [variant, setVariant] = useState<VariantKey>('av')
    const [customSyllable, setCustomSyllable] = useState('')
    const [copied, setCopied] = useState(false)

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

    const handleCopy = async () => {
        if (!result) return
        await Clipboard.setStringAsync(result)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleShare = async () => {
        if (!result) return
        await Share.share({ message: result })
    }

    return (
        <KeyboardAvoidingView
            style={styles.keyboardView}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {/* Sélecteur de variante */}
                <View style={styles.variantRow}>
                    {VARIANTS.map(v => (
                        <TouchableOpacity
                            key={v}
                            style={[styles.variantBtn, variant === v && styles.variantBtnActive]}
                            onPress={() => setVariant(v)}
                        >
                            <Text style={[styles.variantText, variant === v && styles.variantTextActive]}>
                                {getVariant(v).label}
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
                        placeholderTextColor="#5c6370"
                        autoCapitalize="none"
                    />
                )}

                {/* Zone de saisie */}
                <View style={styles.textBox}>
                    <View style={styles.boxHeader}>
                        <Text style={styles.label}>
                            {mode === 'encode' ? 'Texte original' : 'Texte encodé'}
                        </Text>
                        {input.length > 0 && (
                            <TouchableOpacity onPress={() => setInput('')} style={styles.clearBtn}>
                                <Ionicons name="close-circle" size={18} color="#5c6370" />
                            </TouchableOpacity>
                        )}
                    </View>
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
                        placeholderTextColor="#5c6370"
                        textAlignVertical="top"
                    />
                    {input.length > 0 && (
                        <Text style={styles.charCount}>{input.length}</Text>
                    )}
                </View>

                {/* Bouton swap */}
                <View style={styles.swapRow}>
                    <TouchableOpacity style={styles.swapBtn} onPress={handleSwap}>
                        <Ionicons name="swap-vertical" size={18} color="#f97316" />
                        <Text style={styles.swapText}>
                            {mode === 'encode' ? 'Encoder → Décoder' : 'Décoder → Encoder'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Résultat */}
                <View style={styles.textBox}>
                    <View style={styles.boxHeader}>
                        <Text style={styles.label}>
                            {mode === 'encode' ? 'Texte encodé' : 'Texte décodé'}
                        </Text>
                        <View style={styles.resultActions}>
                            <TouchableOpacity
                                onPress={handleShare}
                                disabled={!result}
                                style={styles.actionBtn}
                            >
                                <Ionicons
                                    name="share-social-outline"
                                    size={18}
                                    color={result ? '#949ba4' : '#3a3c40'}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleCopy}
                                disabled={!result}
                                style={styles.actionBtn}
                            >
                                <Ionicons
                                    name={copied ? 'checkmark' : 'copy-outline'}
                                    size={18}
                                    color={result ? (copied ? '#4ade80' : '#949ba4') : '#3a3c40'}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text selectable style={[styles.result, !result && styles.placeholder]}>
                        {result ||
                            (syllable
                                ? 'Le résultat apparaîtra ici...'
                                : 'Entrez une syllabe personnalisée...')}
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}
