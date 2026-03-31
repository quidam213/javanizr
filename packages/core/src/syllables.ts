const VOWEL_GROUPS = ["eau", "au", "ou", "ai", "ei", "eu", "oi", "ui", "an", "en", "in", "on", "un"]
const VOWELS = ["a", "e", "é", "è", "ê", "i", "o", "u", "y", "à", "ù"]

export const COMPOUND_SOUNDS = ["ch", "ph", "gn", "qu"]
export const CONSONANT_CLUSTERS = ["tr", "br", "pl", "gr", "cl", "fl", "pr", "dr", "cr", "bl"]

export const isVowel = (char: string): boolean =>
    VOWELS.includes(char.toLowerCase())

export const startsWithVowelGroup = (str: string): string | null => {
    const match = VOWEL_GROUPS.find(g => str.toLowerCase().startsWith(g))
    return match ?? null
}

export const isMuteE = (char: string, index: number, word: string): boolean =>
    char.toLowerCase() === "e" && index === word.length - 1

export const isYConsonant = (str: string): boolean =>
    str[0].toLowerCase() === "y" && str.length > 1 && isVowel(str[1])

export const encodeWithSyllable = (word: string, syllable: string): string => {
    let result = ""
    let i = 0

    while (i < word.length) {
        const remaining = word.slice(i)
        const group = startsWithVowelGroup(remaining)

        if (isYConsonant(remaining)) {
            result += word[i]
            i++
        } else if (isMuteE(word[i], i, word)) {
            result += word[i]
            i++
        } else if (group) {
            result += syllable + word.slice(i, i + group.length)
            i += group.length
        } else if (isVowel(word[i])) {
            result += syllable + word[i]
            i++
        } else {
            result += word[i]
            i++
        }
    }

    return result
}

export const decodeWithSyllable = (word: string, syllable: string): string =>
    word.replace(new RegExp(syllable + "([aeéèêiouàùy])", "gi"), "$1")
