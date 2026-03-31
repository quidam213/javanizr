import { Variant } from "./types"
import { jav } from "./jav"
import { feu } from "./feu"

const VARIANTS: Record<string, Variant> = { av: jav, feu }

export const getVariant = (syllable: string): Variant =>
  VARIANTS[syllable] ?? {
    syllable,
    label: "Variante personnalisée",
    custom: true,
    encodeSyllable: (s) => s.replace(/([aeéèêiouàùy])/gi, `${syllable}$1`),
    decodeSyllable: (s) => s.replace(new RegExp(syllable + "([aeéèêiouàùy])", "gi"), "$1")
  }

export const encode = (text: string, syllable: string): string => {
  const variant = getVariant(syllable)
  return text
    .split(/(\s+|[^a-zA-ZÀ-ÿ]+)/) // sépare mots et espaces/ponctuation
    .map(token => /[a-zA-ZÀ-ÿ]/.test(token)
      ? variant.encodeSyllable(token)
      : token
    )
    .join("")
}

export const decode = (text: string, syllable: string): string => {
  const variant = getVariant(syllable)
  return text
    .split(/(\s+|[^a-zA-ZÀ-ÿ]+)/)
    .map(token => /[a-zA-ZÀ-ÿ]/.test(token)
      ? variant.decodeSyllable(token)
      : token
    )
    .join("")
}
