"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenize = exports.Token = void 0;
var tokentype_js_1 = require("./tokentype.js");
var keywords = Object.freeze({
    "if": tokentype_js_1.TokenType.If,
    "return": tokentype_js_1.TokenType.Return,
    "class": tokentype_js_1.TokenType.Class,
    "import": tokentype_js_1.TokenType.Import,
    "xor": tokentype_js_1.TokenType.Xor,
    "or": tokentype_js_1.TokenType.Or,
    "and": tokentype_js_1.TokenType.And,
    "not": tokentype_js_1.TokenType.Not,
    "break": tokentype_js_1.TokenType.Break,
    "in": tokentype_js_1.TokenType.In,
    "for": tokentype_js_1.TokenType.For,
    "foreach": tokentype_js_1.TokenType.ForEach,
    "func": tokentype_js_1.TokenType.Function,
    "const": tokentype_js_1.TokenType.Constant,
    "let": tokentype_js_1.TokenType.Let,
    "while": tokentype_js_1.TokenType.While,
    "else": tokentype_js_1.TokenType.Else,
});
var Token = /** @class */ (function () {
    function Token(_type, _value) {
        this._type = _type;
        this._value = _value;
    }
    Object.defineProperty(Token.prototype, "type", {
        get: function () {
            return this._type;
        },
        set: function (type) {
            this._type = type;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Token.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (value) {
            this._value = value;
        },
        enumerable: false,
        configurable: true
    });
    return Token;
}());
exports.Token = Token;
function createToken(value, type) {
    return new Token(type, value);
}
function isAlpha(char) {
    return (char >= "a" && char <= "z") || (char >= "A" && char <= "Z") || char === "_" || (char >= "0" && char <= "9");
}
function isInt(char) {
    return char >= "0" && char <= "9";
}
function isFloat(src) {
    var dot = false;
    for (var _i = 0, src_1 = src; _i < src_1.length; _i++) {
        var char = src_1[_i];
        if (char === ".") {
            if (dot)
                return false;
            dot = true;
        }
        else if (!isInt(char)) {
            return false;
        }
    }
    return true;
}
function isWhitespace(src) {
    return src == " " || src == "\t" || src == "\n" || src == "\r";
}
function tokenize(sourceCode) {
    var tokens = [];
    var src = sourceCode.split("");
    while (src.length > 0) {
        if (src[0] === "(") {
            tokens.push(createToken(src[0], tokentype_js_1.TokenType.OpenParen));
            src.shift();
        }
        else if (src[0] === ")") {
            tokens.push(createToken(src[0], tokentype_js_1.TokenType.CloseParen));
            src.shift();
        }
        else if (src[0] === "{") {
            tokens.push(createToken(src[0], tokentype_js_1.TokenType.LSquirly));
            src.shift();
        }
        else if (src[0] === "}") {
            tokens.push(createToken(src[0], tokentype_js_1.TokenType.RSquirly));
            src.shift();
        }
        else if (src[0] === "[") {
            tokens.push(createToken(src[0], tokentype_js_1.TokenType.OpenBracket));
            src.shift();
        }
        else if (src[0] === "]") {
            tokens.push(createToken(src[0], tokentype_js_1.TokenType.CloseBracket));
            src.shift();
        }
        else if (src[0] == "+" || src[0] == "-" || src[0] == "*" || src[0] == "/" || src[0] == "%" || src[0] == "&" || src[0] == "|" || src[0] == "^") {
            if ((src[0] == "-" && isInt(src[1])) || (src[0] == "-" && isFloat(src[1])) || (src[0] == "-" && isAlpha(src[1]))) {
                tokens.push(createToken(src[0], tokentype_js_1.TokenType.UnaryOperator));
                src.shift();
                continue;
            }
            if (src[0] == "+" && src[1] == "+") {
                tokens.push(createToken("++", tokentype_js_1.TokenType.UnaryOperator));
                src.shift();
                src.shift();
                continue;
            }
            if (src[0] == "-" && src[1] == "-") {
                tokens.push(createToken("--", tokentype_js_1.TokenType.UnaryOperator));
                src.shift();
                src.shift();
                continue;
            }
            if (src[0] == "*" && src[1] == "*") {
                tokens.push(createToken("**", tokentype_js_1.TokenType.BinaryOperator));
                src.shift();
                src.shift();
                continue;
            }
            if (src[0] == "/" && src[1] == "*") {
                tokens.push(createToken("/*", tokentype_js_1.TokenType.OpenComment));
                src.shift();
                src.shift();
                continue;
            }
            if (src[0] == "*" && src[1] == "/") {
                tokens.push(createToken("*/", tokentype_js_1.TokenType.CloseComment));
                src.shift();
                src.shift();
                continue;
            }
            if (src[0] == "/" && src[1] == "/") {
                tokens.push(createToken("//", tokentype_js_1.TokenType.BinaryOperator));
                src.shift();
                src.shift();
                continue;
            }
            tokens.push(createToken(src[0], tokentype_js_1.TokenType.BinaryOperator));
            src.shift();
        }
        else if (src[0] == "=") {
            tokens.push(createToken(src[0], tokentype_js_1.TokenType.Equals));
            src.shift();
        }
        else if (src[0] == ">") {
            if (src[1] == ">") {
                tokens.push(createToken(">>", tokentype_js_1.TokenType.BinaryOperator));
                src.shift();
                src.shift();
                continue;
            }
            tokens.push(createToken(src[0], tokentype_js_1.TokenType.ComparisonOperator));
            src.shift();
        }
        else if (src[0] == "<") {
            if (src[1] == "<") {
                tokens.push(createToken("<<", tokentype_js_1.TokenType.ComparisonOperator));
                src.shift();
                src.shift();
                continue;
            }
            tokens.push(createToken(src[0], tokentype_js_1.TokenType.ComparisonOperator));
            src.shift();
        }
        else if (src[0] == ">" && src[1] == "=") {
            tokens.push(createToken(">=", tokentype_js_1.TokenType.ComparisonOperator));
            src.shift();
            src.shift();
        }
        else if (src[0] == "<" && src[1] == "=") {
            tokens.push(createToken("<=", tokentype_js_1.TokenType.ComparisonOperator));
            src.shift();
            src.shift();
        }
        else if (src[0] == "=" && src[1] == "=") {
            tokens.push(createToken("==", tokentype_js_1.TokenType.ComparisonOperator));
            src.shift();
            src.shift();
        }
        else if (src[0] == "!" && src[1] == "=") {
            tokens.push(createToken("!=", tokentype_js_1.TokenType.ComparisonOperator));
            src.shift();
            src.shift();
        }
        else if (src[0] == ";") {
            tokens.push(createToken(src[0], tokentype_js_1.TokenType.SemiColon));
            src.shift();
        }
        else if (src[0] == ",") {
            tokens.push(createToken(src[0], tokentype_js_1.TokenType.Comma));
            src.shift();
        }
        else if (src[0] == ".") {
            tokens.push(createToken(src[0], tokentype_js_1.TokenType.Dot));
            src.shift();
        }
        else if (src[0] == ":") {
            if (src[1] == ":") {
                tokens.push(createToken(":", tokentype_js_1.TokenType.ColonColon));
                src.shift();
                src.shift();
                continue;
            }
            tokens.push(createToken(src[0], tokentype_js_1.TokenType.Colon));
            src.shift();
        }
        else if (src[0] == "\"") {
            src.shift();
            var str = "";
            while (src.length > 0 && src[0] == "\"") {
                str += src[0];
                src.shift();
            }
            if (src.length == 0) {
                console.error("Error: Unterminated string");
                process.exit(0);
            }
            tokens.push(createToken(str, tokentype_js_1.TokenType.String));
            src.shift();
        }
        else {
            if (isInt(src[0]) || (src[0] == "-" && isInt(src[1]))) {
                var num = "";
                var isFloatNum = false;
                while (src.length > 0 && (isInt(src[0]) || (!isFloatNum && src[0] == "." && src.length > 1 && isInt(src[1])))) {
                    if (src[0] == ".") {
                        isFloatNum = true;
                    }
                    num += src[0];
                    src.shift();
                }
                while (src.length > 0 && isInt(src[0])) {
                    num += src[0];
                    src.shift();
                }
                tokens.push(createToken(num, tokentype_js_1.TokenType.Number));
            }
            else if (isAlpha(src[0])) {
                var identifier = "";
                while (src.length > 0 && isAlpha(src[0])) {
                    identifier += src[0];
                    src.shift();
                }
                var reserved = keywords[identifier];
                if (reserved !== undefined) {
                    tokens.push(createToken(identifier, reserved));
                }
                else {
                    tokens.push(createToken(identifier, tokentype_js_1.TokenType.Identifier));
                }
            }
            else if (isWhitespace(src[0])) {
                src.shift();
            }
            else {
                console.error("Error: Invalid character '" + src[0] + "'");
                process.exit(0);
            }
        }
    }
    tokens.push(createToken("EndOfFile", tokentype_js_1.TokenType.EndOfFile));
    return tokens;
}
exports.tokenize = tokenize;
