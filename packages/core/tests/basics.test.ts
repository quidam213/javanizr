import { encode, decode, getVariant } from "../src/index"

// ─── SETUP ────────────────────────────────────────────────────────────────

test("setup OK", () => {
  expect(true).toBe(true)
})

// ─── VARIANTS ─────────────────────────────────────────────────────────────

test("getVariant retourne le javanais classique", () => {
  const v = getVariant("av")
  expect(v.syllable).toBe("av")
  expect(v.label).toBe("Javanais classique")
})

test("getVariant retourne la langue de feu", () => {
  const v = getVariant("feu")
  expect(v.syllable).toBe("feu")
  expect(v.label).toBe("Langue de feu")
})

test("getVariant retourne une variante custom pour une syllabe inconnue", () => {
  const v = getVariant("og")
  expect(v.custom).toBe(true)
  expect(v.syllable).toBe("og")
})

// ─── EDGE CASES GÉNÉRAUX ──────────────────────────────────────────────────

test("chaîne vide retourne chaîne vide", () => {
  expect(encode("", "av")).toBe("")
  expect(decode("", "av")).toBe("")
})

test("ponctuation seule est préservée", () => {
  expect(encode("!?.,;:", "av")).toBe("!?.,;:")
})

test("les espaces sont préservés", () => {
  expect(encode("bon jour", "av")).toBe("bavon javour")
})

test("phrase complète avec ponctuation", () => {
  expect(encode("bonjour, ami!", "av")).toBe("bavonjavour, avamavi!")
})

test("majuscules préservées", () => {
  expect(encode("Bonjour", "av")).toBe("Bavonjavour")
})

test("encode puis decode retourne le texte original (av)", () => {
  const original = "bonjour ami"
  expect(decode(encode(original, "av"), "av")).toBe(original)
})

test("encode puis decode retourne le texte original (feu)", () => {
  const original = "bonjour"
  expect(decode(encode(original, "feu"), "feu")).toBe(original)
})
