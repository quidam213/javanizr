import { encode } from "../../src/index"

test("consonne simple (b)", () => {
  expect(encode("bonjour", "feu")).toBe("bonfonjourfour")
})

test("voyelle initiale (é)", () => {
  expect(encode("école", "feu")).toBe("éfécolefole")
})

test("son composé (ch)", () => {
  expect(encode("chat", "feu")).toBe("chatfat")
})

test("consonnes distinctes (tr)", () => {
  expect(encode("trésor", "feu")).toBe("tréfrésorfor")
})

test("consonnes distinctes (br)", () => {
  expect(encode("bras", "feu")).toBe("brasfras")
})

test("consonnes distinctes (pl)", () => {
  expect(encode("plage", "feu")).toBe("plageflage")
})

test("son composé (ph)", () => {
  expect(encode("photo", "feu")).toBe("photofoto")
})
