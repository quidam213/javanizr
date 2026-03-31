import { Variant } from "./types"
import { COMPOUND_SOUNDS, CONSONANT_CLUSTERS } from "../syllables"

const getOpeningConsonants = (syllable: string): [string, string] => {
  // Cherche un son composé en premier (ch, ph...)
  const compound = COMPOUND_SOUNDS.find(s => syllable.toLowerCase().startsWith(s))
  if (compound) return [compound, ""] // son composé → on remplace tout, rien à garder

  // Cherche un cluster de consonnes distinctes (tr, br...)
  const cluster = CONSONANT_CLUSTERS.find(s => syllable.toLowerCase().startsWith(s))
  if (cluster) return [cluster[0], cluster.slice(1)] // ex: "tr" → remplace "t", garde "r"

  // Consonne simple
  if (syllable.length > 0) return [syllable[0], ""]

  return ["", ""]
}

const encodeSyllable = (syllable: string): string => {
  const [replaced, kept] = getOpeningConsonants(syllable)
  const fPart = "f" + kept + syllable.slice(replaced.length + kept.length)
  return syllable + fPart
}

const decodeSyllable = (syllable: string): string => {
  // On retire la seconde moitié répétée avec f
  const half = Math.ceil(syllable.length / 2)
  return syllable.slice(0, half)
}

export const feu: Variant = {
  syllable: "f_",
  label: "Langue de feu",
  encodeSyllable,
  decodeSyllable
}
