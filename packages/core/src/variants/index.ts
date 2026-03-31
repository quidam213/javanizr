import { Variant } from "./types"
import { jav } from "./jav"
import { feu } from "./feu"
import { encodeWithSyllable, decodeWithSyllable } from "../syllables"

const VARIANTS: Record<string, Variant> = { av: jav, feu }

export const getVariant = (syllable: string): Variant =>
    VARIANTS[syllable] ?? {
        syllable,
        label: "Variante personnalisée",
        custom: true,
        encodeSyllable: (word) => encodeWithSyllable(word, syllable),
        decodeSyllable: (word) => decodeWithSyllable(word, syllable)
    }

export const encode = (text: string, syllable: string): string => {
    const variant = getVariant(syllable)
    return text
        .split(/(\s+|[^a-zA-ZÀ-ÿ]+)/)
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
