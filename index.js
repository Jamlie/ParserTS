"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parser_js_1 = require("./parser/parser.js");
function main() {
    var src = "\nconst x = 5;\nfunc thisIsAVerySimpleInterpreter(a, b) {\n    return 5;\n}\nprintln(thisIsAVerySimpleInterpreter);\n";
    var parser = new parser_js_1.Parser();
    console.log(parser.produceAST(src));
}
main();
