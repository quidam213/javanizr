import { decode } from "../../src/index"

test("consonne simple", () => {
    expect(decode("bonfonjourfour", "feu")).toBe("bonjour")
})

test("voyelle initiale", () => {
    expect(decode("éfécofolefe", "feu")).toBe("école")
})

test("son composé (ch)", () => {
    expect(decode("chatfat", "feu")).toBe("chat")
})

test("consonnes distinctes (tr)", () => {
    expect(decode("tréfrésorfor", "feu")).toBe("trésor")
})
