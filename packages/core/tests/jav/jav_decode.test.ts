import { decode } from "../../src/index"

test("mot simple", () => {
    expect(decode("bavonjavour", "av")).toBe("bonjour")
})

test("mot commençant par une voyelle", () => {
    expect(decode("avamavi", "av")).toBe("ami")
})

test("groupe de voyelles 'ou'", () => {
    expect(decode("cavours", "av")).toBe("cours")
})

test("groupe de voyelles 'eau'", () => {
    expect(decode("baveau", "av")).toBe("beau")
})

test("mot avec e muet final", () => {
    expect(decode("tavarte", "av")).toBe("tarte")
})
