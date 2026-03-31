import { useState, useEffect, useRef, useMemo } from 'react'
import { View, Text, TextInput, TouchableOpacity, Share, KeyboardAvoidingView, Platform, ScrollView, Modal, FlatList, Linking } from 'react-native'
import { useNavigation } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Ionicons } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { encode, decode, getVariant } from '@javanizr/core'
import { getStyles } from './styles'
import { getColors, ACCENT_COLORS, type ThemeMode, type AccentKey } from './theme'

type Mode = 'encode' | 'decode'
type VariantKey = 'av' | 'feu' | 'custom'

type HistoryEntry = {
    id: string
    mode: Mode
    variant: string
    input: string
    result: string
    createdAt: number
}

const VARIANTS: VariantKey[] = ['av', 'feu', 'custom']
const HISTORY_KEY = 'javanizr_history'
const THEME_KEY = 'javanizr_theme'
const HISTORY_MAX = 50

export default function TranslatorScreen() {
    const navigation = useNavigation()
    const [input, setInput] = useState('')
    const [mode, setMode] = useState<Mode>('encode')
    const [variant, setVariant] = useState<VariantKey>('av')
    const [customSyllable, setCustomSyllable] = useState('')
    const [copied, setCopied] = useState(false)
    const [history, setHistory] = useState<HistoryEntry[]>([])
    const [showHistory, setShowHistory] = useState(false)
    const [showInfo, setShowInfo] = useState(false)
    const [showTheme, setShowTheme] = useState(false)
    const [themeMode, setThemeMode] = useState<ThemeMode>('dark')
    const [accentKey, setAccentKey] = useState<AccentKey>('orange')
    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const syllable = variant === 'custom' ? customSyllable : variant

    const colors = useMemo(() => getColors(themeMode, accentKey), [themeMode, accentKey])
    const styles = useMemo(() => getStyles(colors), [colors])

    const result =
        input && syllable
            ? mode === 'encode'
                ? encode(input, syllable)
                : decode(input, syllable)
            : ''

    // Chargement historique + thème au démarrage
    useEffect(() => {
        Promise.all([
            AsyncStorage.getItem(HISTORY_KEY),
            AsyncStorage.getItem(THEME_KEY),
        ]).then(([rawHistory, rawTheme]) => {
            if (rawHistory) setHistory(JSON.parse(rawHistory))
            if (rawTheme) {
                const { mode: m, accent } = JSON.parse(rawTheme)
                setThemeMode(m)
                setAccentKey(accent)
            }
        })
    }, [])

    // Persistance du thème
    useEffect(() => {
        AsyncStorage.setItem(THEME_KEY, JSON.stringify({ mode: themeMode, accent: accentKey }))
    }, [themeMode, accentKey])

    // Header : titre + boutons + couleurs dynamiques
    useEffect(() => {
        navigation.setOptions({
            headerStyle: { backgroundColor: colors.bg },
            headerTintColor: colors.accent,
            headerTitle: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons name="flame" size={22} color={colors.accent} />
                    <Text style={{ color: colors.accent, fontWeight: 'bold', fontSize: 18 }}>
                        Javanizr
                    </Text>
                </View>
            ),
            headerRight: () => (
                <View style={{ flexDirection: 'row', gap: 16, marginRight: 16 }}>
                    <TouchableOpacity onPress={() => setShowTheme(true)}>
                        <Ionicons name="color-palette-outline" size={22} color={colors.textMuted} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowHistory(true)}>
                        <Ionicons name="book-outline" size={22} color={colors.textMuted} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowInfo(true)}>
                        <Ionicons name="information-circle-outline" size={22} color={colors.textMuted} />
                    </TouchableOpacity>
                </View>
            ),
        })
    }, [navigation, colors])

    // Sauvegarde avec debounce (1s après la dernière frappe)
    useEffect(() => {
        if (!result || !input) return
        if (saveTimer.current) clearTimeout(saveTimer.current)
        saveTimer.current = setTimeout(() => {
            setHistory(prev => {
                const entry: HistoryEntry = {
                    id: Date.now().toString(),
                    mode,
                    variant: syllable,
                    input,
                    result,
                    createdAt: Date.now(),
                }
                const deduped = prev.filter(
                    e => !(e.input === input && e.variant === syllable && e.mode === mode)
                )
                const updated = [entry, ...deduped].slice(0, HISTORY_MAX)
                AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
                return updated
            })
        }, 1000)
        return () => {
            if (saveTimer.current) clearTimeout(saveTimer.current)
        }
    }, [result, input, mode, syllable])

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

    const handleHistorySelect = (entry: HistoryEntry) => {
        const updated = history.filter(e => e.id !== entry.id)
        setHistory(updated)
        AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
        setMode(entry.mode)
        if (VARIANTS.includes(entry.variant as VariantKey)) {
            setVariant(entry.variant as VariantKey)
        } else {
            setVariant('custom')
            setCustomSyllable(entry.variant)
        }
        setInput(entry.input)
        setShowHistory(false)
    }

    const handleHistoryDelete = (id: string) => {
        const updated = history.filter(e => e.id !== id)
        setHistory(updated)
        AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
    }

    const handleHistoryClear = () => {
        setHistory([])
        AsyncStorage.removeItem(HISTORY_KEY)
    }

    const variantLabel = (v: string) => {
        if (v === 'av' || v === 'feu') return getVariant(v).label
        return `Custom · ${v}`
    }

    return (
        <>
            <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
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
                            placeholderTextColor={colors.placeholder}
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
                                    <Ionicons name="close-circle" size={18} color={colors.placeholder} />
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
                            placeholderTextColor={colors.placeholder}
                            textAlignVertical="top"
                        />
                        {input.length > 0 && (
                            <Text style={styles.charCount}>{input.length}</Text>
                        )}
                    </View>

                    {/* Bouton swap */}
                    <View style={styles.swapRow}>
                        <TouchableOpacity style={styles.swapBtn} onPress={handleSwap}>
                            <Ionicons name="swap-vertical" size={18} color={colors.accent} />
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
                                        color={result ? colors.textMuted : colors.border}
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
                                        color={result ? (copied ? '#4ade80' : colors.textMuted) : colors.border}
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

                {/* Modal historique */}
                <Modal
                    visible={showHistory}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShowHistory(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalSheet}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Historique</Text>
                                <View style={styles.resultActions}>
                                    {history.length > 0 && (
                                        <TouchableOpacity onPress={handleHistoryClear} style={styles.actionBtn}>
                                            <Ionicons name="trash" size={20} color={colors.placeholder} />
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity onPress={() => setShowHistory(false)} style={styles.actionBtn}>
                                        <Ionicons name="close" size={22} color={colors.textMuted} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {history.length === 0 ? (
                                <Text style={styles.historyEmpty}>Aucun historique pour l'instant</Text>
                            ) : (
                                <FlatList
                                    data={history}
                                    keyExtractor={item => item.id}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={styles.historyItem}
                                            onPress={() => handleHistorySelect(item)}
                                        >
                                            <View style={styles.historyMeta}>
                                                <Text style={styles.historyVariant}>{variantLabel(item.variant)}</Text>
                                                <Text style={styles.historyMode}>· {item.mode}</Text>
                                                <TouchableOpacity
                                                    onPress={() => handleHistoryDelete(item.id)}
                                                    style={styles.historyDeleteBtn}
                                                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                                >
                                                    <Ionicons name="trash-outline" size={14} color={colors.placeholder} />
                                                </TouchableOpacity>
                                            </View>
                                            <Text style={styles.historyText} numberOfLines={1}>
                                                {item.input} → {item.result}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                    ItemSeparatorComponent={() => <View style={styles.historySeparator} />}
                                />
                            )}
                        </View>
                    </View>
                </Modal>

                {/* Modal info */}
                <Modal
                    visible={showInfo}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShowInfo(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalSheet}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>À propos</Text>
                                <TouchableOpacity onPress={() => setShowInfo(false)} style={styles.actionBtn}>
                                    <Ionicons name="close" size={22} color={colors.textMuted} />
                                </TouchableOpacity>
                            </View>
                            <ScrollView contentContainerStyle={styles.infoContent}>
                                <Text style={styles.infoSection}>✦ Projet</Text>
                                <Text style={styles.infoText}>
                                    Javanizr est un encodeur / décodeur d'argots français codés : javanais classique, langue de feu, et variantes personnalisées.
                                </Text>
                                <Text style={styles.infoText}>
                                    Fait pour le fun, pour tester jusqu'où Claude peut aller dans un projet from scratch.
                                </Text>

                                <Text style={styles.infoSection}>✦ Auteurs</Text>
                                <Text style={styles.infoText}>dam (coucou)</Text>
                                <Text style={styles.infoText}>Claude (Anthropic)</Text>

                                <Text style={styles.infoSection}>✦ Le javanais</Text>
                                <Text style={styles.infoText}>
                                    Argot verlan du XIXe siècle consistant à insérer une syllabe (av, oc, ul...) avant chaque voyelle des mots. Très populaire en France dans les années 70-80.
                                </Text>
                                <TouchableOpacity onPress={() => Linking.openURL('https://fr.wikipedia.org/wiki/Javanais_(argot)')}>
                                    <Text style={styles.infoLink}>Lire l'article Wikipédia →</Text>
                                </TouchableOpacity>

                                <Text style={styles.infoSection}>✦ Liens</Text>
                                <TouchableOpacity onPress={() => Linking.openURL('https://github.com/quidam213/javanizr')}>
                                    <Text style={styles.infoLink}>GitHub — quidam213/javanizr →</Text>
                                </TouchableOpacity>

                                <Text style={styles.infoVersion}>v1.0.0</Text>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>

                {/* Modal thème */}
                <Modal
                    visible={showTheme}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShowTheme(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.themeModalSheet}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Thème</Text>
                                <TouchableOpacity onPress={() => setShowTheme(false)} style={styles.actionBtn}>
                                    <Ionicons name="close" size={22} color={colors.textMuted} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.themeContent}>
                                <View>
                                    <Text style={styles.themeLabel}>Mode</Text>
                                    <View style={styles.themeModeRow}>
                                        {(['light', 'dark'] as ThemeMode[]).map(m => (
                                            <TouchableOpacity
                                                key={m}
                                                style={[styles.themeModeBtn, themeMode === m && styles.themeModeBtnActive]}
                                                onPress={() => setThemeMode(m)}
                                            >
                                                <Ionicons
                                                    name={m === 'light' ? 'sunny-outline' : 'moon-outline'}
                                                    size={18}
                                                    color={themeMode === m ? colors.accent : colors.textMuted}
                                                />
                                                <Text style={[styles.themeModeBtnText, themeMode === m && styles.themeModeBtnTextActive]}>
                                                    {m === 'light' ? 'Clair' : 'Sombre'}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                                <View>
                                    <Text style={styles.themeLabel}>Couleur</Text>
                                    <View style={styles.accentRow}>
                                        {(Object.keys(ACCENT_COLORS) as AccentKey[]).map(key => (
                                            <TouchableOpacity
                                                key={key}
                                                style={[
                                                    styles.accentDot,
                                                    { backgroundColor: ACCENT_COLORS[key] },
                                                    accentKey === key && styles.accentDotActive,
                                                ]}
                                                onPress={() => setAccentKey(key)}
                                            />
                                        ))}
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </KeyboardAvoidingView>
        </>
    )
}
