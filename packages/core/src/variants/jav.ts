import { Variant } from "./types"
import { isVowel, startsWithVowelGroup } from "../syllables"

const encodeSyllable = (syllable: string): string => {
  let result = ""
  let i = 0

  while (i < syllable.length) {
    const remaining = syllable.slice(i)
    const group = startsWithVowelGroup(remaining)

    if (group) {
      // Groupe de voyelles → on insère av avant
      result += "av" + syllable.slice(i, i + group.length)
      i += group.length
    } else if (isVowel(syllable[i])) {
      // Voyelle simple → on insère av avant
      result += "av" + syllable[i]
      i++
    } else {
      // Consonne → on garde telle quelle
      result += syllable[i]
      i++
    }
  }

  return result
}

const decodeSyllable = (syllable: string): string =>
  syllable.replace(/av([aeéèêiouàùy])/gi, "$1")

export const jav: Variant = {
  syllable: "av",
  label: "Javanais classique",
  encodeSyllable,
  decodeSyllable
}
