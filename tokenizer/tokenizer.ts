import { TokenType } from "./tokentype.js";

const keywords: Record<string, TokenType> = Object.freeze({
    "if": TokenType.If,
    "return": TokenType.Return,
    "class": TokenType.Class,
    "import": TokenType.Import,
    "xor": TokenType.Xor,
    "or": TokenType.Or,
    "and": TokenType.And,
    "not": TokenType.Not,
    "break": TokenType.Break,
    "in": TokenType.In,
    "for": TokenType.For,
    "foreach": TokenType.ForEach,
    "func": TokenType.Function,
    "const": TokenType.Constant,
    "let": TokenType.Let,
    "while": TokenType.While,
    "else": TokenType.Else,
});

export class Token {
    constructor(private _type: TokenType, private _value: string) {}

    get type() {
        return this._type;
    }

    get value() {
        return this._value;
    }

    set type(type: TokenType) {
        this._type = type;
    }

    set value(value: string) {
        this._value = value;
    }
}

function createToken(value: string, type: TokenType): Token {
    return new Token(type, value);
}

function isAlpha(char: string): boolean {
    return (char >= "a" && char <= "z") || (char >= "A" && char <= "Z") || char === "_" || (char >= "0" && char <= "9");
}

function isInt(char: string): boolean {
    return char >= "0" && char <= "9";
}

function isFloat(src: string): boolean {
    let dot = false;
    for (const char of src) {
        if (char === ".") {
            if (dot) return false;
            dot = true;
        } else if (!isInt(char)) {
            return false;
        }
    }
    return true;
}


function isWhitespace(src: string): boolean {
    return src == " " || src == "\t" || src == "\n" || src == "\r"
}

export function tokenize(sourceCode: string): Token[] {
    let tokens: Token[] = [];
    let src = sourceCode.split("");

    while (src.length > 0) {
        if (src[0] === "(") {
            tokens.push(createToken(src[0], TokenType.OpenParen));
            src.shift();
        } else if (src[0] === ")") {
            tokens.push(createToken(src[0], TokenType.CloseParen));
            src.shift();
        } else if (src[0] === "{") {
            tokens.push(createToken(src[0], TokenType.LSquirly));
            src.shift();
        } else if (src[0] === "}") {
            tokens.push(createToken(src[0], TokenType.RSquirly));
            src.shift();
        } else if (src[0] === "[") {
            tokens.push(createToken(src[0], TokenType.OpenBracket));
            src.shift();
        } else if (src[0] === "]") {
            tokens.push(createToken(src[0], TokenType.CloseBracket));
            src.shift();
        } else if (src[0] == "+" || src[0] == "-" || src[0] == "*" || src[0] == "/" || src[0] == "%" || src[0] == "&" || src[0] == "|" || src[0] == "^") {
            if ((src[0] == "-" && isInt(src[1])) || (src[0] == "-" && isFloat(src[1])) || (src[0] == "-" && isAlpha(src[1]))) {
                tokens.push(createToken(src[0], TokenType.UnaryOperator));
                src.shift();
                continue;
            }
            if (src[0] == "+" && src[1] == "+") {
                tokens.push(createToken("++", TokenType.UnaryOperator));
                src.shift();
                src.shift();
                continue;
            }
            if (src[0] == "-" && src[1] == "-") {
                tokens.push(createToken("--", TokenType.UnaryOperator));
                src.shift();
                src.shift();
                continue
            }
            if (src[0] == "*" && src[1] == "*") {
                tokens.push(createToken("**", TokenType.BinaryOperator));
                src.shift();
                src.shift();
                continue;
            }
            if (src[0] == "/" && src[1] == "*") {
                tokens.push(createToken("/*", TokenType.OpenComment));
                src.shift();
                src.shift();
                continue;
            }
            if (src[0] == "*" && src[1] == "/") {
                tokens.push(createToken("*/", TokenType.CloseComment));
                src.shift();
                src.shift();
                continue;
            }
            if (src[0] == "/" && src[1] == "/") {
                tokens.push(createToken("//", TokenType.BinaryOperator));
                src.shift();
                src.shift();
                continue;
            }
            tokens.push(createToken(src[0], TokenType.BinaryOperator))
            src.shift();
        } else if (src[0] == "=") {
            tokens.push(createToken(src[0], TokenType.Equals));
            src.shift();
        } else if (src[0] == ">") {
            if (src[1] == ">") {
                tokens.push(createToken(">>", TokenType.BinaryOperator))
                src.shift();
                src.shift();
                continue;
            }
            tokens.push(createToken(src[0], TokenType.ComparisonOperator))
            src.shift();
        } else if (src[0] == "<") {
            if (src[1] == "<") {
                tokens.push(createToken("<<", TokenType.ComparisonOperator))
                src.shift();
                src.shift();
                continue;
            }
            tokens.push(createToken(src[0], TokenType.ComparisonOperator))
            src.shift();
        } else if (src[0] == ">" && src[1] == "=") {
            tokens.push(createToken(">=", TokenType.ComparisonOperator));
            src.shift();
            src.shift();
        } else if (src[0] == "<" && src[1] == "=") {
            tokens.push(createToken("<=", TokenType.ComparisonOperator));
            src.shift();
            src.shift();
        } else if (src[0] == "=" && src[1] == "=") {
            tokens.push(createToken("==", TokenType.ComparisonOperator));
            src.shift();
            src.shift();
        } else if (src[0] == "!" && src[1] == "=") {
            tokens.push(createToken("!=", TokenType.ComparisonOperator));
            src.shift();
            src.shift();
        } else if (src[0] == ";") {
            tokens.push(createToken(src[0], TokenType.SemiColon));
            src.shift();
        } else if (src[0] == ",") {
            tokens.push(createToken(src[0], TokenType.Comma));
            src.shift();
        } else if (src[0] == ".") {
            tokens.push(createToken(src[0], TokenType.Dot));
            src.shift();
        } else if (src[0] == ":") {
            if (src[1] == ":") {
                tokens.push(createToken(":", TokenType.ColonColon));
                src.shift();
                src.shift();
                continue;
            }
            tokens.push(createToken(src[0], TokenType.Colon));
            src.shift();
        } else if (src[0] == "\"") {
            src.shift();
            let str = "";

            while (src.length > 0 && src[0] == "\"") {
                str += src[0];
                src.shift();
            }

            if (src.length == 0) {
                console.error("Error: Unterminated string");
                process.exit(0);
            }

            tokens.push(createToken(str, TokenType.String));
            src.shift();
        } else {
            if (isInt(src[0]) || (src[0] == "-" && isInt(src[1]))) {
                let num = "";
                let isFloatNum = false;

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

                tokens.push(createToken(num, TokenType.Number));
            } else if (isAlpha(src[0])) {
                let identifier = ""
                while (src.length > 0 && isAlpha(src[0])) {
                    identifier += src[0]
                    src.shift()
                }

                let reserved: TokenType | undefined = keywords[identifier];
                if (reserved !== undefined) {
                    tokens.push(createToken(identifier, reserved));
                } else {
                    tokens.push(createToken(identifier, TokenType.Identifier));
                }
            } else if (isWhitespace(src[0])) {
                src.shift();
            } else {
                console.error("Error: Invalid character '" + src[0] + "'")
                process.exit(0)
            }
        }
    }

    tokens.push(createToken("EndOfFile", TokenType.EndOfFile));
    return tokens;
}
