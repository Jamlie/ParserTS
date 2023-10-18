import { TokenType } from "../tokenizer/tokentype";

type NodeType = 
| "Program"
| "VariableDeclaration"
| "AssignmentExpression"
| "MemberExpression"
| "CallExpression"
| "ConditionalStatement"
| "WhileStatement"
| "LoopStatement"
| "ForEachStatement"
| "ForStatement"
| "FunctionDeclaration"
| "ReturnStatement"
| "BreakStatement"
| "ImportStatement"
| "ClassDeclaration"
| "Comment"
| "Property"
| "ObjectLiteral"
| "ArrayLiteral"
| "NumericLiteral"
| "Identifier"
| "BinaryExpression"
| "UnaryExpression"
| "LogicalExpression"
| "StringLiteral"
| "NullLiteral";

export interface Statement {
    get type(): NodeType;
    toString(): string;
}

export interface Expression extends Statement {}

export class Program implements Statement {
    constructor(public body: Statement[]) {}

    toString() {
        return this.body.map((statement) => statement.toString()).join("\n");
    }

    get type(): NodeType {
        return "Program";
    }
}

export class VariableDeclaration implements Statement {
    constructor(public constant: boolean, public identifier: string, public value: Expression) {}

    toString() {
        return `${this.constant ? "const" : "let"} ${this.identifier} = ${this.value.toString()};`;
    }

    get type(): NodeType {
        return "VariableDeclaration";
    }
}

export class FunctionDeclaration implements Statement {
    constructor(
        public name: string,
        public parameters: string[],
        public body: Statement[],
        public isAnonymous: boolean = false
    ) {}

    toString() {
        return `function ${this.name}(${this.parameters.join(", ")}) {\n${this.body
            .map((statement) => statement.toString())
            .join("\n")}\n}`;
    }

    cloneBody(): Statement[] {
        return structuredClone(this.body);
    }

    cloneParameters(): string[] {
        return structuredClone(this.parameters);
    }

    get type(): NodeType {
        return "FunctionDeclaration";
    }
}

export class ReturnStatement implements Statement {
    constructor(public value: Expression) {}

    toString() {
        return `return ${this.value.toString()};`;
    }

    get type(): NodeType {
        return "ReturnStatement";
    }
}

export class BreakStatement implements Statement {
    toString() {
        return "break";
    }

    get type(): NodeType {
        return "BreakStatement";
    }
}

export class ImportStatement implements Statement {
    constructor(public path: string) {}

    toString() {
        return `import ${this.path}`;
    }

    get type(): NodeType {
        return "ImportStatement";
    }
}

export class ClassDeclaration implements Statement {
    constructor(public name: string, public body: Statement[]) {}

    toString() {
        return `export class ${this.name} {\n${this.body.map((statement) => statement.toString()).join("\n")}\n}`;
    }

    get type(): NodeType {
        return "ClassDeclaration";
    }
}

export class Comment implements Statement {
    constructor(public text: string) {}

    toString() {
        return `/* ${this.text} */`;
    }

    get type(): NodeType {
        return "Comment";
    }
}

export class ConditionalStatement implements Statement {
    constructor(public condition: Expression, public body: Statement[], public alternate: Statement[] = []) {}

    toString() {
        return `if (${this.condition.toString()}) {\n${this.body
            .map((statement) => statement.toString())
            .join("\n")}\n} else {\n${this.alternate.map((statement) => statement.toString()).join("\n")}\n}`;
    }

    get type(): NodeType {
        return "ConditionalStatement";
    }
}

export class WhileStatement implements Statement {
    constructor(public condition: Expression, public body: Statement[]) {}

    toString() {
        return `while (${this.condition.toString()}) {\n${this.body.map((statement) => statement.toString()).join("\n")}\n}`;
    }

    get type(): NodeType {
        return "WhileStatement";
    }
}

export class LoopStatement implements Statement {
    constructor(public body: Statement[]) {}

    toString() {
        return `loop {\n${this.body.map((statement) => statement.toString()).join("\n")}\n}`;
    }

    get type(): NodeType {
        return "LoopStatement";
    }
}

export class ForEachStatement implements Statement {
    constructor(public identifier: string, public array: Expression, public body: Statement[]) {}

    toString() {
        return `foreach (${this.identifier} in ${this.array.toString()}) {\n${this.body
            .map((statement) => statement.toString())
            .join("\n")}\n}`;
    }

    get type(): NodeType {
        return "ForEachStatement";
    }
}

export class ForStatement implements Statement {
    constructor(
        public init: Statement,
        public condition: Expression,
        public update: Expression,
        public body: Statement[]
    ) {}

    toString() {
        return `for (${this.init.toString()}; ${this.condition.toString()}; ${this.update.toString()}) {\n${this.body
            .map((statement) => statement.toString())
            .join("\n")}\n}`;
    }

    get type(): NodeType {
        return "ForStatement";
    }
}

export class AssignmentExpression implements Expression {
    constructor(public asssigne: Expression, public value: Expression) {}

    toString() {
        return `${this.asssigne.toString()} = ${this.value.toString()}`;
    }

    get type(): NodeType {
        return "AssignmentExpression";
    }
}

export class BinaryExpression implements Expression {
    constructor(public left: Expression, public right: Expression, public operator: string) {}

    toString() {
        return `${this.left.toString()} ${this.operator} ${this.right.toString()}`;
    }

    get type(): NodeType {
        return "BinaryExpression";
    }
}

export class UnaryExpression implements Expression {
    constructor(public value: Expression, public operator: string) {}

    toString() {
        return `${this.operator}${this.value.toString()}`;
    }

    get type(): NodeType {
        return "UnaryExpression";
    }
}

export class LogicalExpression implements Expression {
    constructor(public left: Expression, public right: Expression, public operator: string) {}

    toString() {
        if (this.operator === "not") {
            return `${this.operator} ${this.left.toString()}`;
        }
        return `${this.left.toString()} ${this.operator} ${this.right.toString()}`;
    }

    get type(): NodeType {
        return "LogicalExpression";
    }
}

export class Identifier implements Expression {
    constructor(public symbol: string) {}

    toString() {
        return this.symbol;
    }

    get type(): NodeType {
        return "Identifier";
    }
}

export class NumericLiteral implements Expression {
    constructor(public value: number) {}

    toString() {
        return this.value.toString();
    }

    get type(): NodeType {
        return "NumericLiteral";
    }
}

export class StringLiteral implements Expression {
    constructor(public value: string) {}

    toString() {
        return `"${this.value}"`;
    }

    get type(): NodeType {
        return "StringLiteral";
    }
}

export class NullLiteral implements Expression {
    toString() {
        return "null";
    }

    get type(): NodeType {
        return "NullLiteral";
    }
}

export class Property implements Expression {
    constructor(public key: string, public value: Expression) {}

    toString() {
        return `${this.key}: ${this.value.toString()}`;
    }

    get type(): NodeType {
        return "Property";
    }
}

export class ObjectLiteral implements Expression {
    constructor(public properties: Property[]) {}

    toString() {
        return `{${this.properties.map((property) => property.toString()).join(", ")}}`;
    }

    get type(): NodeType {
        return "ObjectLiteral";
    }
}

export class ArrayLiteral implements Expression {
    constructor(public elements: Expression[]) {}

    toString() {
        return `[${this.elements.map((element) => element.toString()).join(", ")}]`;
    }

    get type(): NodeType {
        return "ArrayLiteral";
    }
}

export class CallExpression implements Expression {
    constructor(public args: Expression[], public callee: Expression) {}

    toString() {
        return `${this.callee.toString()}(${this.args.map((arg) => arg.toString()).join(", ")})`;
    }

    get type(): NodeType {
        return "CallExpression";
    }
}

export class MemberExpression implements Expression {
    constructor(public object: Expression, public property: Expression, public computed: boolean) {}

    toString() {
        if (this.computed) {
            return `${this.object.toString()}[${this.property.toString()}]`;
        }
        return `${this.object.toString()}.${this.property.toString()}`;
    }

    get type(): NodeType {
        return "MemberExpression";
    }
}
