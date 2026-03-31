import { Variant } from "./types"
import { COMPOUND_SOUNDS, CONSONANT_CLUSTERS, isVowel } from "../syllables"

const splitIntoSyllables = (word: string): string[] => {
    const syllables: string[] = []
    let current = ""

    for (let i = 0; i < word.length; i++) {
        current += word[i]

        const curr = word[i]
        const next = word[i + 1]
        const afterNext = word[i + 2]
        const hasVowel = current.split("").some(c => isVowel(c))

        if (!next || !hasVowel) continue

        const cutBetweenConsonants = !isVowel(curr) && !isVowel(next)
        const cutBeforeConsonantVowel =
            isVowel(curr) && !isVowel(next) && afterNext && isVowel(afterNext)

        if (cutBetweenConsonants || cutBeforeConsonantVowel) {
            syllables.push(current)
            current = ""
        }
    }

    if (current) {
        // Si le reste est uniquement un 'e' muet, on le fusionne avec la syllabe précédente
        if (current.toLowerCase() === "e" && syllables.length > 0) {
            syllables[syllables.length - 1] += current
        } else {
            syllables.push(current)
        }
    }

    return syllables
}

// Retourne [partie remplacée par f, partie gardée]
const getOpeningConsonants = (syllable: string): [string, string] => {
    // Voyelle initiale → pas de consonne à remplacer
    if (isVowel(syllable[0])) return ["", ""]

    // Son composé (ch, ph...) → on remplace tout le groupe
    const compound = COMPOUND_SOUNDS.find(s =>
                    syllable.toLowerCase().startsWith(s)
    )
    if (compound) return [compound, ""]

    // Cluster de consonnes distinctes (tr, br...) → on remplace la 1ère, garde le reste
    const cluster = CONSONANT_CLUSTERS.find(s =>
                    syllable.toLowerCase().startsWith(s)
    )
    if (cluster) return [cluster[0], cluster.slice(1)]

    // Consonne simple
    return [syllable[0], ""]
}

const encodeSyllable = (syllable: string): string => {
    const syllables = splitIntoSyllables(syllable)

    return syllables.map(syl => {
        const [replaced, kept] = getOpeningConsonants(syl)

        if (replaced === "" && kept === "") {
            // Voyelle initiale → "é" devient "é" + "f" + "é" = "éfé"
            // puis le reste de la syllabe suit normalement
            const firstVowel = syl[0]
            const rest = syl.slice(1)
            return firstVowel + "f" + firstVowel + rest
        }

        const rest = syl.slice(replaced.length + kept.length)
        const fPart = "f" + kept + rest
        return syl + fPart
    }).join("")
}

const decodeSyllable = (word: string): string => {
    let result = ""
    let i = 0

    while (i < word.length) {
        let found = false

        for (let len = Math.floor((word.length - i) / 2); len >= 1; len--) {
            const candidate = word.slice(i, i + len)
            const [replaced, kept] = getOpeningConsonants(candidate)

            let expectedF: string
            if (replaced === "" && kept === "") {
                const firstVowel = candidate[0]
                const rest = candidate.slice(1)
                expectedF = "f" + firstVowel + rest
            } else {
                const rest = candidate.slice(replaced.length + kept.length)
                expectedF = "f" + kept + rest
            }

            const after = word.slice(i + len, i + len + expectedF.length)

            if (after === expectedF) {
                result += candidate
                i += len + expectedF.length
                found = true
                break
            }
        }

        if (!found) {
            result += word[i]
            i++
        }
    }

    return result
}

export const feu: Variant = {
    syllable: "feu",
    label: "Langue de feu",
    encodeSyllable,
    decodeSyllable
}
