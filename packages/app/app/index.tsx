import { useState, useEffect, useRef, useMemo } from 'react'
import { View, Text, TextInput, TouchableOpacity, Share, KeyboardAvoidingView, Platform, ScrollView, Modal, Linking } from 'react-native'
import { useNavigation } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Ionicons } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import * as Speech from 'expo-speech'
import Slider from '@react-native-community/slider'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { encode, decode, getVariant } from '@javanizr/core'
import { getStyles } from '../lib/styles'
import { getColors, ACCENT_COLORS, type ThemeMode, type AccentKey } from '../lib/theme'

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
const FAVORITES_KEY = 'javanizr_favorites'
const THEME_KEY = 'javanizr_theme'
const VOICE_KEY = 'javanizr_voice'
const HISTORY_MAX = 50

function formatDate(ts: number): string {
    const d = new Date(ts)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const hours = String(d.getHours()).padStart(2, '0')
    const mins = String(d.getMinutes()).padStart(2, '0')
    return `${day}/${month} à ${hours}:${mins}`
}

function entryKey(e: HistoryEntry) {
    return `${e.input}|${e.variant}|${e.mode}`
}

export default function TranslatorScreen() {
    const navigation = useNavigation()
    const [input, setInput] = useState('')
    const [mode, setMode] = useState<Mode>('encode')
    const [variant, setVariant] = useState<VariantKey>('av')
    const [customSyllable, setCustomSyllable] = useState('')
    const [copied, setCopied] = useState(false)
    const [history, setHistory] = useState<HistoryEntry[]>([])
    const [favorites, setFavorites] = useState<HistoryEntry[]>([])
    const [showHistory, setShowHistory] = useState(false)
    const [showFavorites, setShowFavorites] = useState(false)
    const [showInfo, setShowInfo] = useState(false)
    const [showTheme, setShowTheme] = useState(false)
    const [showVoice, setShowVoice] = useState(false)
    const [themeMode, setThemeMode] = useState<ThemeMode>('dark')
    const [accentKey, setAccentKey] = useState<AccentKey>('orange')
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [availableVoices, setAvailableVoices] = useState<Speech.Voice[]>([])
    const [selectedVoice, setSelectedVoice] = useState<string | undefined>(undefined)
    const [voiceVolume, setVoiceVolume] = useState(1)
    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const syllable = variant === 'custom' ? customSyllable : variant

    const colors = useMemo(() => getColors(themeMode, accentKey), [themeMode, accentKey])
    const styles = useMemo(() => getStyles(colors), [colors])

    const favoriteKeys = useMemo(
        () => new Set(favorites.map(entryKey)),
        [favorites]
    )

    const result =
        input && syllable
            ? mode === 'encode'
                ? encode(input, syllable)
                : decode(input, syllable)
            : ''

    const isCurrentFavorite = favoriteKeys.has(`${input}|${syllable}|${mode}`) && !!result

    // Chargement historique + favoris + thème au démarrage
    useEffect(() => {
        Promise.all([
            AsyncStorage.getItem(HISTORY_KEY),
            AsyncStorage.getItem(FAVORITES_KEY),
            AsyncStorage.getItem(THEME_KEY),
            AsyncStorage.getItem(VOICE_KEY),
        ]).then(([rawHistory, rawFavorites, rawTheme, rawVoice]) => {
            if (rawHistory) setHistory(JSON.parse(rawHistory))
            if (rawFavorites) setFavorites(JSON.parse(rawFavorites))
            if (rawTheme) {
                const { mode: m, accent } = JSON.parse(rawTheme)
                setThemeMode(m)
                setAccentKey(accent)
            }
            if (rawVoice) {
                const { identifier, volume } = JSON.parse(rawVoice)
                if (identifier) setSelectedVoice(identifier)
                if (volume !== undefined) setVoiceVolume(volume)
            }
        })
    }, [])

    // Chargement des voix disponibles
    useEffect(() => {
        Speech.getAvailableVoicesAsync()
            .then(voices => setAvailableVoices(voices.filter(v => v.language.startsWith('fr'))))
            .catch(() => {})
    }, [])

    // Persistance du thème
    useEffect(() => {
        AsyncStorage.setItem(THEME_KEY, JSON.stringify({ mode: themeMode, accent: accentKey }))
    }, [themeMode, accentKey])

    // Persistance des préférences voix
    useEffect(() => {
        AsyncStorage.setItem(VOICE_KEY, JSON.stringify({ identifier: selectedVoice ?? null, volume: voiceVolume }))
    }, [selectedVoice, voiceVolume])

    // Arrêt de la lecture si le résultat change
    useEffect(() => {
        Speech.stop()
        setIsSpeaking(false)
    }, [result])

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
                    <TouchableOpacity onPress={() => setShowFavorites(true)}>
                        <Ionicons name="star-outline" size={22} color={colors.textMuted} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowHistory(true)}>
                        <Ionicons name="book-outline" size={22} color={colors.textMuted} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowTheme(true)}>
                        <Ionicons name="color-palette-outline" size={22} color={colors.textMuted} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowVoice(true)}>
                        <Ionicons name="mic-outline" size={22} color={colors.textMuted} />
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

    const handleSpeak = () => {
        if (!result) return
        Speech.speak(result, {
            language: 'fr-FR',
            voice: selectedVoice,
            volume: voiceVolume,
            onStart: () => setIsSpeaking(true),
            onDone: () => setIsSpeaking(false),
            onStopped: () => setIsSpeaking(false),
            onError: () => setIsSpeaking(false),
        })
    }

    const handleStopSpeech = () => {
        Speech.stop()
        setIsSpeaking(false)
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

    const handleToggleFavorite = (entry: HistoryEntry) => {
        const key = entryKey(entry)
        setFavorites(prev => {
            let updated: HistoryEntry[]
            if (prev.some(f => entryKey(f) === key)) {
                updated = prev.filter(f => entryKey(f) !== key)
            } else {
                updated = [{ ...entry, id: `fav_${Date.now()}`, createdAt: entry.createdAt }, ...prev]
            }
            AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated))
            return updated
        })
    }

    const handleFavoriteDelete = (id: string) => {
        const updated = favorites.filter(f => f.id !== id)
        setFavorites(updated)
        AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated))
    }

    const handleFavoriteClear = () => {
        setFavorites([])
        AsyncStorage.removeItem(FAVORITES_KEY)
    }

    const handleToggleCurrentFavorite = () => {
        if (!result) return
        handleToggleFavorite({
            id: Date.now().toString(),
            mode,
            variant: syllable,
            input,
            result,
            createdAt: Date.now(),
        })
    }

    const handleFavoriteSelect = (entry: HistoryEntry) => {
        setMode(entry.mode)
        if (VARIANTS.includes(entry.variant as VariantKey)) {
            setVariant(entry.variant as VariantKey)
        } else {
            setVariant('custom')
            setCustomSyllable(entry.variant)
        }
        setInput(entry.input)
        setShowFavorites(false)
    }

    const variantLabel = (v: string) => {
        if (v === 'av' || v === 'feu') return getVariant(v).label
        return `Custom · ${v}`
    }

    const renderHistoryItem = (item: HistoryEntry, opts: { showStar: boolean; onSelect: () => void; onDelete: () => void }) => (
        <TouchableOpacity style={styles.historyItem} onPress={opts.onSelect}>
            <View style={styles.historyMeta}>
                <Text style={styles.historyVariant}>{variantLabel(item.variant)}</Text>
                <Text style={styles.historyMode}>· {item.mode}</Text>
                <View style={styles.historyRowActions}>
                    {opts.showStar && (
                        <TouchableOpacity
                            onPress={() => handleToggleFavorite(item)}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                            <Ionicons
                                name={favoriteKeys.has(entryKey(item)) ? 'star' : 'star-outline'}
                                size={14}
                                color={favoriteKeys.has(entryKey(item)) ? colors.accent : colors.placeholder}
                            />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        onPress={opts.onDelete}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        <Ionicons name="trash-outline" size={14} color={colors.placeholder} />
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.historyDate}>{formatDate(item.createdAt)}</Text>
            <Text style={styles.historyText} numberOfLines={1}>
                {item.input} → {item.result}
            </Text>
        </TouchableOpacity>
    )

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
                                    onPress={handleToggleCurrentFavorite}
                                    disabled={!result}
                                    style={styles.actionBtn}
                                >
                                    <Ionicons
                                        name={isCurrentFavorite ? 'star' : 'star-outline'}
                                        size={18}
                                        color={result ? (isCurrentFavorite ? colors.accent : colors.textMuted) : colors.border}
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
                                <TouchableOpacity
                                    onPress={isSpeaking ? handleStopSpeech : handleSpeak}
                                    disabled={!result}
                                    style={styles.actionBtn}
                                >
                                    <Ionicons
                                        name={isSpeaking ? 'stop-circle-outline' : 'volume-high-outline'}
                                        size={18}
                                        color={result ? colors.textMuted : colors.border}
                                    />
                                </TouchableOpacity>
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
                                <ScrollView>
                                    {history.map((item, i) => (
                                        <View key={item.id}>
                                            {renderHistoryItem(item, {
                                                showStar: true,
                                                onSelect: () => handleHistorySelect(item),
                                                onDelete: () => handleHistoryDelete(item.id),
                                            })}
                                            {i < history.length - 1 && <View style={styles.historySeparator} />}
                                        </View>
                                    ))}
                                </ScrollView>
                            )}
                        </View>
                    </View>
                </Modal>

                {/* Modal favoris */}
                <Modal
                    visible={showFavorites}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShowFavorites(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalSheet}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Favoris</Text>
                                <View style={styles.resultActions}>
                                    {favorites.length > 0 && (
                                        <TouchableOpacity onPress={handleFavoriteClear} style={styles.actionBtn}>
                                            <Ionicons name="trash" size={20} color={colors.placeholder} />
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity onPress={() => setShowFavorites(false)} style={styles.actionBtn}>
                                        <Ionicons name="close" size={22} color={colors.textMuted} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {favorites.length === 0 ? (
                                <Text style={styles.historyEmpty}>Aucun favori pour l'instant</Text>
                            ) : (
                                <ScrollView>
                                    {favorites.map((item, i) => (
                                        <View key={item.id}>
                                            {renderHistoryItem(item, {
                                                showStar: false,
                                                onSelect: () => handleFavoriteSelect(item),
                                                onDelete: () => handleFavoriteDelete(item.id),
                                            })}
                                            {i < favorites.length - 1 && <View style={styles.historySeparator} />}
                                        </View>
                                    ))}
                                </ScrollView>
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

                {/* Modal voix */}
                <Modal
                    visible={showVoice}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShowVoice(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.themeModalSheet}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Voix</Text>
                                <TouchableOpacity onPress={() => setShowVoice(false)} style={styles.actionBtn}>
                                    <Ionicons name="close" size={22} color={colors.textMuted} />
                                </TouchableOpacity>
                            </View>
                            <ScrollView contentContainerStyle={styles.themeContent}>
                                <View>
                                    <Text style={styles.themeLabel}>Voix disponibles</Text>
                                    {availableVoices.length === 0 ? (
                                        <Text style={styles.historyEmpty}>
                                            Aucune voix française disponible sur cet appareil
                                        </Text>
                                    ) : (
                                        availableVoices.map(voice => (
                                            <TouchableOpacity
                                                key={voice.identifier}
                                                style={[styles.voiceItem, selectedVoice === voice.identifier && styles.voiceItemActive]}
                                                onPress={() => {
                                                    setSelectedVoice(voice.identifier)
                                                    Speech.speak("Bonjour, c'est moi.", {
                                                        language: 'fr-FR',
                                                        voice: voice.identifier,
                                                        volume: voiceVolume,
                                                    })
                                                }}
                                            >
                                                <Text style={[styles.voiceItemName, selectedVoice === voice.identifier && { color: colors.accent }]}>
                                                    {voice.name}
                                                </Text>
                                                {selectedVoice === voice.identifier && (
                                                    <Ionicons name="checkmark" size={16} color={colors.accent} />
                                                )}
                                            </TouchableOpacity>
                                        ))
                                    )}
                                </View>
                                <View>
                                    <Text style={styles.themeLabel}>Volume</Text>
                                    <View style={styles.volumeRow}>
                                        <Ionicons name="volume-low-outline" size={20} color={colors.textMuted} />
                                        <Slider
                                            style={styles.volumeSlider}
                                            minimumValue={0}
                                            maximumValue={1}
                                            value={voiceVolume}
                                            onValueChange={setVoiceVolume}
                                            minimumTrackTintColor={colors.accent}
                                            maximumTrackTintColor={colors.border}
                                            thumbTintColor={colors.accent}
                                        />
                                        <Ionicons name="volume-high-outline" size={20} color={colors.textMuted} />
                                    </View>
                                </View>
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
