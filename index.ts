import { Parser } from "./parser/parser.js";

function main() {
    const src = `
const x = 5;
func thisIsAVerySimpleInterpreter(a, b) {
    return 5;
}
println(thisIsAVerySimpleInterpreter);
`;

    const parser = new Parser();

    console.log(parser.produceAST(src));
}

main();
