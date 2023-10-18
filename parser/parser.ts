import { Token, tokenize } from "../tokenizer/tokenizer.js";
import { TokenType } from "../tokenizer/tokentype.js";
import {
    Program,
    Statement,
    Expression,
    VariableDeclaration,
    FunctionDeclaration,
    ReturnStatement,
    BreakStatement,
    ImportStatement,
    ClassDeclaration,
    Comment,
    ConditionalStatement,
    WhileStatement,
    LoopStatement,
    ForEachStatement,
    ForStatement,
    AssignmentExpression,
    BinaryExpression,
    UnaryExpression,
    LogicalExpression,
    Identifier,
    NumericLiteral,
    StringLiteral,
    NullLiteral,
    Property,
    ObjectLiteral,
    ArrayLiteral,
    CallExpression,
    MemberExpression,
} from "../ast/ast.js";

export class Parser {
    private tokens: Token[] = [];
    private isFunction: boolean = false;
    private isLoop: boolean = false;

    constructor() {}

    public produceAST(sourceCode: string): Program {
        this.tokens = tokenize(sourceCode);
        const program = new Program([]);

        while (this.notEndOfFile()) {
            if (this.at().type === TokenType.Whitespace) {
                this.eat();
                continue;
            }
            program.body.push(this.parseStatement());
        }

        return program;
    }

    private parseStatement(): Statement {
        switch (this.at().type) {
            case TokenType.OpenComment:
                return this.parseComment();
            case TokenType.Let:
                return this.parseVariableDeclaration();
            case TokenType.Constant:
                return this.parseVariableDeclaration();
            case TokenType.Function:
                return this.parseFunctionDeclaration();
            case TokenType.Return:
                if (!this.isFunction) {
                    console.log('Error: Return statement outside of function');
                    process.exit(0);
                }
                return this.parseReturnStatement();
            case TokenType.Class:
                return this.parseClassDeclaration();
            case TokenType.Break:
                if (!this.isLoop) {
                    console.log('Error: Break statement outside of loop');
                    process.exit(0);
                }
                return this.parseBreakStatement();
            case TokenType.If:
                return this.parseIfStatement();
            case TokenType.Else:
                return this.parseIfStatement();
            case TokenType.While:
                return this.parseWhileStatement();
            case TokenType.Loop:
                return this.parseLoopStatement();
            case TokenType.ForEach:
                return this.parseForEachStatement();
            case TokenType.For:
                return this.parseForStatement();
            case TokenType.Import:
                return this.parseImportStatement();
            case TokenType.SemiColon:
                this.eat();
                return new NullLiteral();
            default:
                return this.parseExpression();
        }
    }

    private parseComment(): Statement {
        while (this.at().type !== TokenType.CloseComment) {
            this.eat();
        }
        this.expect(TokenType.CloseComment, 'Error: Expected close comment');
        return new NullLiteral();
    }

    private parseImportStatement(): ImportStatement {
        this.eat();
        const path = this.expect(TokenType.String, 'Error: Expected string after import statement').value;
        return new ImportStatement(path);
    }

    private parseForStatement(): ForStatement {
        this.eat();
        this.isLoop = true;
        const init = this.parseStatement();
        this.expect(TokenType.SemiColon, 'Error: Expected \';\' after for statement');
        const condition = this.parseExpression();
        this.expect(TokenType.SemiColon, 'Error: Expected \';\' after for statement');
        const increment = this.parseExpression();
        this.expect(TokenType.LSquirly, 'Error: Expected \'{\' after for statement');
        const body: Statement[] = [];
        while (this.at().type !== TokenType.RSquirly) {
            body.push(this.parseStatement());
        }
        this.expect(TokenType.RSquirly, 'Error: Expected \'}\' after for statement');
        return new ForStatement(init, condition, increment, body);
    }

    private parseForEachStatement(): ForEachStatement {
        this.eat();
        this.isLoop = true;
        const value = this.expect(TokenType.Identifier, 'Error: Expected identifier in for each statement').value;
        this.expect(TokenType.In, 'Error: Expected in after identifier in for each statement');
        const array = this.parseExpression();
        this.expect(TokenType.LSquirly, 'Error: Expected { after for each statement');
        const body: Statement[] = [];
        while (this.at().type !== TokenType.RSquirly) {
            body.push(this.parseStatement());
        }
        this.expect(TokenType.RSquirly, 'Error: Expected } after for each statement');
        return new ForEachStatement(value, array, body);
    }

    private parseLoopStatement(): LoopStatement {
        this.eat();
        this.expect(TokenType.LSquirly, 'Error: Expected { after loop statement');
        this.isLoop = true;
        const body: Statement[] = [];
        while (this.at().type !== TokenType.RSquirly) {
            body.push(this.parseStatement());
        }
        this.expect(TokenType.RSquirly, 'Error: Expected } after loop statement');
        return new LoopStatement(body);
    }

    private parseWhileStatement(): WhileStatement {
        this.eat();
        const condition = this.parseExpression();
        this.expect(TokenType.LSquirly, 'Error: Expected { after while statement');
        this.isLoop = true;
        const body: Statement[] = [];
        while (this.at().type !== TokenType.RSquirly) {
            body.push(this.parseStatement());
        }
        this.expect(TokenType.RSquirly, 'Error: Expected } after while statement');
        return new WhileStatement(condition, body);
    }

    private parseIfStatement(): ConditionalStatement {
        this.eat();
        const condition = this.parseExpression();
        this.expect(TokenType.LSquirly, 'Error: Expected { after if statement');
        const body: Statement[] = [];
        while (this.at().type !== TokenType.RSquirly) {
            body.push(this.parseStatement());
        }
        this.expect(TokenType.RSquirly, 'Error: Expected } after if statement');
        let alternate: Statement[] = [];
        if (this.at().type === TokenType.Else) {
            this.eat();
            this.expect(TokenType.LSquirly, 'Error: Expected { after else statement');
            alternate = [];
            while (this.at().type !== TokenType.RSquirly) {
                alternate.push(this.parseStatement());
            }
            this.expect(TokenType.RSquirly, 'Error: Expected } after else statement');
        }
        return new ConditionalStatement(condition, body, alternate);
    }

    private parseClassDeclaration(): ClassDeclaration {
        this.eat();
        const name = this.expect(TokenType.Identifier, 'Error: Expected class name after class keyword').value;
        this.expect(TokenType.LSquirly, 'Error: Expected { after class name');
        const body: Statement[] = [];
        while (this.at().type !== TokenType.RSquirly) {
            body.push(this.parseStatement());
        }
        this.expect(TokenType.RSquirly, 'Error: Expected } after class declaration');
        return new ClassDeclaration(name, body);
    }

    private parseFunctionDeclaration(): FunctionDeclaration {
        this.eat();
        let name: string | undefined;

        if (this.at().type !== TokenType.OpenParen) {
            name = this.expect(TokenType.Identifier, 'Error: Expected function name after fn keyword').value;
        }

        const args = this.parseArgs();
        const params: string[] = [];

        for (const arg of args) {
            if (arg.type !== 'Identifier') {
                console.log(`Error: Expected function parameter to be of type string, got ${arg.type}`);
                process.exit(0);
            }

            const argIdentifier = arg as Identifier;
            params.push(argIdentifier.symbol);
        }

        this.expect(TokenType.LSquirly, 'Error: Expected \'{\' after function declaration');

        if (!this.isFunction) {
            this.isFunction = true;
            // defer is not available in TypeScript, but we can use a try-finally block for a similar effect
            try {
                const body: Statement[] = [];
                while (this.at().type !== TokenType.EndOfFile && this.at().type !== TokenType.RSquirly) {
                    body.push(this.parseStatement());
                }
                this.expect(TokenType.RSquirly, 'Error: Expected \'}\' after function declaration');
                return new FunctionDeclaration(name!, params, body);
            } finally {
                this.isFunction = false;
            }
        }

        const body: Statement[] = [];
        while (this.at().type !== TokenType.EndOfFile && this.at().type !== TokenType.RSquirly) {
            body.push(this.parseStatement());
        }
        this.expect(TokenType.RSquirly, 'Error: Expected \'}\' after function declaration');
        return new FunctionDeclaration(name!, params, body);
    }

    private parseBreakStatement(): BreakStatement {
        this.eat();
        return new BreakStatement();
    }

    private parseReturnStatement(): ReturnStatement {
        this.eat();
        return new ReturnStatement(this.parseExpression());
    }

    private parseVariableDeclaration(): VariableDeclaration {
        const isConstant = this.eat().type === TokenType.Constant;
        const identifier = this.expect(TokenType.Identifier, 'Error: Expected identifier name after let/const keyword').value;

        if (this.at().type === TokenType.SemiColon) {
            this.eat();
            if (isConstant) {
                console.log('Error: Constant declaration without assignment is not allowed');
                process.exit(0);
                // In TypeScript, we need to return a valid object, so return a new NullLiteral
                // return new VariableDeclaration(isConstant, identifier, new NullLiteral());
            }

            return new VariableDeclaration(isConstant, identifier, new NullLiteral());
        }

        this.expect(TokenType.Equals, 'Expected = after identifier name');
        const declaration = new VariableDeclaration(isConstant, identifier, this.parseExpression());

        if (!this.isLoop) {
            if (this.at().type === TokenType.SemiColon) {
                this.eat();
            }
        }
        return declaration;
    }

    private parseExpression(): Expression {
        return this.parseAssignmentExpression();
    }

    private parseLogicalExpression(): Expression {
        return this.parseOrExpression();
    }

    private parseOrExpression(): Expression {
        let left = this.parseAndExpression();

        while (this.at().value === 'or') {
            this.eat();
            const right = this.parseAndExpression();
            left = new LogicalExpression(left, right, 'or');
        }

        return left;
    }

    private parseAndExpression(): Expression {
        let left = this.parseXorExpression();

        while (this.at().value === 'and') {
            this.eat();
            const right = this.parseXorExpression();
            left = new LogicalExpression(left, right, 'and');
        }
        return left;
    }

    private parseXorExpression(): Expression {
        let left = this.parseNotExpression();

        while (this.at().value === 'xor') {
            this.eat();
            const right = this.parseNotExpression();
            left = new LogicalExpression(left, right, 'xor');
        }
        return left;
    }

    private parseNotExpression(): Expression {
        if (this.at().value === 'not') {
            this.eat();
            return new LogicalExpression(new NullLiteral(), this.parseNotExpression(), "not");
        }
        return this.parseComparisonExpression();
    }

    private parseArrayExpression(): Expression {
        if (this.at().type !== TokenType.OpenBracket) {
            return this.parseBitwise();
        }
        this.eat();
        const elements: Expression[] = [];
        while (this.at().type !== TokenType.CloseBracket) {
            elements.push(this.parseExpression());
            if (this.at().type === TokenType.Comma) {
                this.eat();
            }
        }
        this.expect(TokenType.CloseBracket, 'Expected closing bracket after array expression');
        return new ArrayLiteral(elements);
    }

    private parseAssignmentExpression(): Expression {
        let left = this.parseOrExpression();

        if (this.at().type === TokenType.Equals) {
            this.eat();
            const value = this.parseAssignmentExpression();
            return new AssignmentExpression(left, value);
        }

        return left;
    }

    private parseObjectExpression(): Expression {
        if (this.at().type !== TokenType.LSquirly) {
            return this.parseArrayExpression();
        }

        this.eat();
        const properties: Property[] = [];

        while (this.notEndOfFile() && this.at().type !== TokenType.RSquirly) {
            const key = this.expect(TokenType.Identifier, 'Expected identifier as object key').value;

            if (this.at().type === TokenType.Comma) {
                this.eat();
                properties.push(new Property(key, new NullLiteral()));
                continue;
            } else if (this.at().type === TokenType.RSquirly) {
                properties.push(new Property(key, new NullLiteral()));
                continue;
            }

            this.expect(TokenType.Colon, 'Expected : after object key');
            const value = this.parseExpression();
            properties.push(new Property(key, value));

            if (this.at().type !== TokenType.RSquirly) {
                this.expect(TokenType.Comma, 'Expected , after object property');
            }
        }

        this.expect(TokenType.RSquirly, 'Object literal must end with a }');
        return new ObjectLiteral(properties);
    }

    private parseComparisonExpression(): Expression {
        let left = this.parseObjectExpression();

        while (
            this.at().value === '>' ||
                this.at().value === '<' ||
                (this.at().value === '=' && this.peek().value === '=') ||
                this.at().value === '!='
        ) {
            let operator = this.eat().value;
            if (this.at().value === '=') {
                operator += this.eat().value;
            }

            const right = this.parseObjectExpression();

            left = new BinaryExpression(left, right, operator);
        }

        return left;
    }

    private parseBitwise(): Expression {
        let left = this.parseBitwiseShiftBit();

        while (this.at().value === '&' || this.at().value === '|' || this.at().value === '^') {
            const operator = this.eat().value;

            const right = this.parseBitwiseShiftBit();

            left = new BinaryExpression(left,right, operator);
        }

        return left;
    }

    private parseBitwiseShiftBit(): Expression {
        let left = this.parseAdditiveExpression();

        while (this.at().value === '<<' || this.at().value === '>>' || this.at().value === '>>>') {
            const operator = this.eat().value;

            const right = this.parseAdditiveExpression();

            left = new BinaryExpression(left, right, operator);
        }

        return left;
    }

    private parseAdditiveExpression(): Expression {
        let left = this.parseMultiplicativeExpression();

        while (this.at().value === '+' || this.at().value === '-') {
            const operator = this.eat().value;

            const right = this.parseMultiplicativeExpression();
            left = new BinaryExpression(left, right, operator);
        }

        return left;
    }

    private parseMultiplicativeExpression(): Expression {
        let left = this.parseCallMemberExpression();

        while (this.at().value === '*' || this.at().value === '/' || this.at().value === '%' || this.at().value === '**' || this.at().value === '//') {
            const operator = this.eat().value;

            const right = this.parseCallMemberExpression();
            left = new BinaryExpression(left, right, operator);
        }

        return left;
    }

    private parseCallMemberExpression(): Expression {
        const member = this.parseMemberExpression();

        if (this.at().type === TokenType.OpenParen) {
            return this.parseCallExpression(member);
        }

        return member;
    }

    private parseCallExpression(caller: Expression): Expression {
        let callExpression: Expression = new CallExpression(this.parseArgs(), caller);

        if (this.at().type === TokenType.OpenParen) {
            callExpression = this.parseCallExpression(callExpression);
        }

        return callExpression;
    }

    private parseArgs(): Expression[] {
        this.expect(TokenType.OpenParen, 'Expected \'(\' after function name');

        let args: Expression[];
        if (this.at().type === TokenType.CloseParen) {
            args = [];
        } else {
            args = this.parseArgumentsList();
        }

        this.expect(TokenType.CloseParen, 'Expected \')\' after function arguments');

        return args;
    }

    private parseArgumentsList(): Expression[] {
        const args: Expression[] = [this.parseAssignmentExpression()];

        while (this.at().type === TokenType.Comma) {
            this.eat();
            args.push(this.parseAssignmentExpression());
        }

        return args;
    }

    private parseMemberExpression(): Expression {
        let object = this.parsePrimaryExpression();

        while (this.at().type === TokenType.Dot || this.at().type === TokenType.OpenBracket) {
            const operator = this.eat();
            let property: Expression;
            let computed: boolean;

            if (operator.type === TokenType.Dot) {
                computed = false;
                property = this.parsePrimaryExpression();

                if (property.type !== 'Identifier') {
                    console.log('Expected identifier after \'.\'');
                    process.exit(0);
                }
            } else {
                computed = true;
                property = this.parseExpression();
                this.expect(TokenType.CloseBracket, 'Expected \']\' after computed property');
            }

            object = new MemberExpression(object, property, computed);
        }

        return object;
    }

    private parsePrimaryExpression(): Expression {
        const token = this.at().type;

        switch (token) {
            case TokenType.Identifier:
                return new Identifier(this.eat().value);
            case TokenType.Number:
                const value = parseFloat(this.eat().value);
                if (isNaN(value)) {
                    console.log('Error: Failed to parse numeric literal');
                    process.exit(0);
                }
                return new NumericLiteral(value);
            case TokenType.String:
                return new StringLiteral(this.eat().value);
            case TokenType.Whitespace:
                this.eat();
                return this.parsePrimaryExpression();
            case TokenType.OpenParen:
                this.eat();
                const parsedExpression = this.parseExpression();
                this.expect(TokenType.CloseParen, 'Expected closing parenthesis');
                return parsedExpression;
            case TokenType.UnaryOperator:
                const unaryOperator = this.eat().value;
                const unaryValue = this.parsePrimaryExpression();
                return new UnaryExpression(unaryValue, unaryOperator);
            case TokenType.Function:
                return this.parseFunctionDeclaration();
            default:
                console.log('Unexpected token found: ', this.at());
                process.exit(0);
        }
    }

    private at(): Token {
        return this.tokens[0];
    }

    private eat(): Token {
        const prev = this.tokens[0];
        this.tokens = this.tokens.slice(1);
        return prev;
    }

    private peek(): Token {
        return this.tokens[1];
    }

    private expect(token: TokenType, message: string): Token {
        if (this.at().type !== token) {
            console.log(message);
            process.exit(0);
        }
        return this.eat();
    }

    private notEndOfFile(): boolean {
        return this.tokens[0].type !== TokenType.EndOfFile;
    }
}
