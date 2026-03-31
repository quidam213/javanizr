import { encode } from "../../src/index"

test("encode avec syllabe custom 'og'", () => {
    expect(encode("bonjour", "og")).toBe("bogonjogour")
})

test("encode avec syllabe custom 'iz'", () => {
    expect(encode("ami", "iz")).toBe("izamizi")
})

test("encode avec syllabe custom longue 'zig'", () => {
    expect(encode("bonjour", "zig")).toBe("bzigonjzigour")
})
