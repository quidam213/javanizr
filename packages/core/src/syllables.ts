// Groupes de voyelles à ne pas séparer
const VOWEL_GROUPS = ["eau", "au", "ou", "ai", "ei", "eu", "oi", "ui", "an", "en", "in", "on", "un"]
const VOWELS = ["a", "e", "é", "è", "ê", "i", "o", "u", "y", "à", "ù"]

// Groupes formant un son unique (pour la langue de feu)
export const COMPOUND_SOUNDS = ["ch", "ph", "gn", "qu"]

// Groupes de consonnes distinctes
export const CONSONANT_CLUSTERS = ["tr", "br", "pl", "gr", "cl", "fl", "pr", "dr", "cr", "bl"]

export const isVowel = (char: string): boolean =>
  VOWELS.includes(char.toLowerCase())

export const startsWithVowelGroup = (str: string): string | null => {
  const match = VOWEL_GROUPS.find(g => str.toLowerCase().startsWith(g))
  return match ?? null
}
