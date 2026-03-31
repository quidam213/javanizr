export interface Variant {
    syllable: string
    label: string
    custom?: boolean
    encodeSyllable: (syllable: string) => string
    decodeSyllable: (syllable: string) => string
}
