import { decode } from "../../src/index"

test("decode avec syllabe custom 'og'", () => {
    expect(decode("bogonjogour", "og")).toBe("bonjour")
})

test("decode avec syllabe custom 'iz'", () => {
    expect(decode("izamizi", "iz")).toBe("ami")
})
