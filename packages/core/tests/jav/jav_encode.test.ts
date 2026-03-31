import { encode } from "../../src/index"

test("mot simple", () => {
    expect(encode("bonjour", "av")).toBe("bavonjavour")
})

test("mot commençant par une voyelle", () => {
    expect(encode("ami", "av")).toBe("avamavi")
})

test("mot commençant par é", () => {
    expect(encode("école", "av")).toBe("avécavole")
})

test("groupe de voyelles 'ou'", () => {
    expect(encode("cours", "av")).toBe("cavours")
})

test("groupe de voyelles 'eau'", () => {
    expect(encode("beau", "av")).toBe("baveau")
})

test("groupe de voyelles 'ai'", () => {
    expect(encode("maison", "av")).toBe("mavaisavon")
})

test("mot avec e muet final", () => {
    expect(encode("tarte", "av")).toBe("tavarte")
})

test("mot avec y semi-consonne", () => {
    expect(encode("moyen", "av")).toBe("mavoyaven")
})

test("mot avec apostrophe", () => {
    expect(encode("j'aime", "av")).toBe("j'avaime")
})
