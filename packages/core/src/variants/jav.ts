import { Variant } from "./types"
import { encodeWithSyllable, decodeWithSyllable } from "../syllables"

export const jav: Variant = {
    syllable: "av",
    label: "Javanais classique",
    encodeSyllable: (word) => encodeWithSyllable(word, "av"),
    decodeSyllable: (word) => decodeWithSyllable(word, "av")
}
