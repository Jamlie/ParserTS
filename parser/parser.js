"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
var tokenizer_js_1 = require("../tokenizer/tokenizer.js");
var tokentype_js_1 = require("../tokenizer/tokentype.js");
var ast_js_1 = require("../ast/ast.js");
var Parser = /** @class */ (function () {
    function Parser() {
        this.tokens = [];
        this.isFunction = false;
        this.isLoop = false;
    }
    Parser.prototype.produceAST = function (sourceCode) {
        this.tokens = (0, tokenizer_js_1.tokenize)(sourceCode);
        var program = new ast_js_1.Program([]);
        while (this.notEndOfFile()) {
            if (this.at().type === tokentype_js_1.TokenType.Whitespace) {
                this.eat();
                continue;
            }
            program.body.push(this.parseStatement());
        }
        return program;
    };
    Parser.prototype.parseStatement = function () {
        switch (this.at().type) {
            case tokentype_js_1.TokenType.OpenComment:
                return this.parseComment();
            case tokentype_js_1.TokenType.Let:
                return this.parseVariableDeclaration();
            case tokentype_js_1.TokenType.Constant:
                return this.parseVariableDeclaration();
            case tokentype_js_1.TokenType.Function:
                return this.parseFunctionDeclaration();
            case tokentype_js_1.TokenType.Return:
                if (!this.isFunction) {
                    console.log('Error: Return statement outside of function');
                    process.exit(0);
                }
                return this.parseReturnStatement();
            case tokentype_js_1.TokenType.Class:
                return this.parseClassDeclaration();
            case tokentype_js_1.TokenType.Break:
                if (!this.isLoop) {
                    console.log('Error: Break statement outside of loop');
                    process.exit(0);
                }
                return this.parseBreakStatement();
            case tokentype_js_1.TokenType.If:
                return this.parseIfStatement();
            case tokentype_js_1.TokenType.Else:
                return this.parseIfStatement();
            case tokentype_js_1.TokenType.While:
                return this.parseWhileStatement();
            case tokentype_js_1.TokenType.Loop:
                return this.parseLoopStatement();
            case tokentype_js_1.TokenType.ForEach:
                return this.parseForEachStatement();
            case tokentype_js_1.TokenType.For:
                return this.parseForStatement();
            case tokentype_js_1.TokenType.Import:
                return this.parseImportStatement();
            case tokentype_js_1.TokenType.SemiColon:
                this.eat();
                return new ast_js_1.NullLiteral();
            default:
                return this.parseExpression();
        }
    };
    Parser.prototype.parseComment = function () {
        while (this.at().type !== tokentype_js_1.TokenType.CloseComment) {
            this.eat();
        }
        this.expect(tokentype_js_1.TokenType.CloseComment, 'Error: Expected close comment');
        return new ast_js_1.NullLiteral();
    };
    Parser.prototype.parseImportStatement = function () {
        this.eat();
        var path = this.expect(tokentype_js_1.TokenType.String, 'Error: Expected string after import statement').value;
        return new ast_js_1.ImportStatement(path);
    };
    Parser.prototype.parseForStatement = function () {
        this.eat();
        this.isLoop = true;
        var init = this.parseStatement();
        this.expect(tokentype_js_1.TokenType.SemiColon, 'Error: Expected \';\' after for statement');
        var condition = this.parseExpression();
        this.expect(tokentype_js_1.TokenType.SemiColon, 'Error: Expected \';\' after for statement');
        var increment = this.parseExpression();
        this.expect(tokentype_js_1.TokenType.LSquirly, 'Error: Expected \'{\' after for statement');
        var body = [];
        while (this.at().type !== tokentype_js_1.TokenType.RSquirly) {
            body.push(this.parseStatement());
        }
        this.expect(tokentype_js_1.TokenType.RSquirly, 'Error: Expected \'}\' after for statement');
        return new ast_js_1.ForStatement(init, condition, increment, body);
    };
    Parser.prototype.parseForEachStatement = function () {
        this.eat();
        this.isLoop = true;
        var value = this.expect(tokentype_js_1.TokenType.Identifier, 'Error: Expected identifier in for each statement').value;
        this.expect(tokentype_js_1.TokenType.In, 'Error: Expected in after identifier in for each statement');
        var array = this.parseExpression();
        this.expect(tokentype_js_1.TokenType.LSquirly, 'Error: Expected { after for each statement');
        var body = [];
        while (this.at().type !== tokentype_js_1.TokenType.RSquirly) {
            body.push(this.parseStatement());
        }
        this.expect(tokentype_js_1.TokenType.RSquirly, 'Error: Expected } after for each statement');
        return new ast_js_1.ForEachStatement(value, array, body);
    };
    Parser.prototype.parseLoopStatement = function () {
        this.eat();
        this.expect(tokentype_js_1.TokenType.LSquirly, 'Error: Expected { after loop statement');
        this.isLoop = true;
        var body = [];
        while (this.at().type !== tokentype_js_1.TokenType.RSquirly) {
            body.push(this.parseStatement());
        }
        this.expect(tokentype_js_1.TokenType.RSquirly, 'Error: Expected } after loop statement');
        return new ast_js_1.LoopStatement(body);
    };
    Parser.prototype.parseWhileStatement = function () {
        this.eat();
        var condition = this.parseExpression();
        this.expect(tokentype_js_1.TokenType.LSquirly, 'Error: Expected { after while statement');
        this.isLoop = true;
        var body = [];
        while (this.at().type !== tokentype_js_1.TokenType.RSquirly) {
            body.push(this.parseStatement());
        }
        this.expect(tokentype_js_1.TokenType.RSquirly, 'Error: Expected } after while statement');
        return new ast_js_1.WhileStatement(condition, body);
    };
    Parser.prototype.parseIfStatement = function () {
        this.eat();
        var condition = this.parseExpression();
        this.expect(tokentype_js_1.TokenType.LSquirly, 'Error: Expected { after if statement');
        var body = [];
        while (this.at().type !== tokentype_js_1.TokenType.RSquirly) {
            body.push(this.parseStatement());
        }
        this.expect(tokentype_js_1.TokenType.RSquirly, 'Error: Expected } after if statement');
        var alternate = [];
        if (this.at().type === tokentype_js_1.TokenType.Else) {
            this.eat();
            this.expect(tokentype_js_1.TokenType.LSquirly, 'Error: Expected { after else statement');
            alternate = [];
            while (this.at().type !== tokentype_js_1.TokenType.RSquirly) {
                alternate.push(this.parseStatement());
            }
            this.expect(tokentype_js_1.TokenType.RSquirly, 'Error: Expected } after else statement');
        }
        return new ast_js_1.ConditionalStatement(condition, body, alternate);
    };
    Parser.prototype.parseClassDeclaration = function () {
        this.eat();
        var name = this.expect(tokentype_js_1.TokenType.Identifier, 'Error: Expected class name after class keyword').value;
        this.expect(tokentype_js_1.TokenType.LSquirly, 'Error: Expected { after class name');
        var body = [];
        while (this.at().type !== tokentype_js_1.TokenType.RSquirly) {
            body.push(this.parseStatement());
        }
        this.expect(tokentype_js_1.TokenType.RSquirly, 'Error: Expected } after class declaration');
        return new ast_js_1.ClassDeclaration(name, body);
    };
    Parser.prototype.parseFunctionDeclaration = function () {
        this.eat();
        var name;
        if (this.at().type !== tokentype_js_1.TokenType.OpenParen) {
            name = this.expect(tokentype_js_1.TokenType.Identifier, 'Error: Expected function name after fn keyword').value;
        }
        var args = this.parseArgs();
        var params = [];
        for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
            var arg = args_1[_i];
            if (arg.type !== 'Identifier') {
                console.log("Error: Expected function parameter to be of type string, got ".concat(arg.type));
                process.exit(0);
            }
            var argIdentifier = arg;
            params.push(argIdentifier.symbol);
        }
        this.expect(tokentype_js_1.TokenType.LSquirly, 'Error: Expected \'{\' after function declaration');
        if (!this.isFunction) {
            this.isFunction = true;
            // defer is not available in TypeScript, but we can use a try-finally block for a similar effect
            try {
                var body_1 = [];
                while (this.at().type !== tokentype_js_1.TokenType.EndOfFile && this.at().type !== tokentype_js_1.TokenType.RSquirly) {
                    body_1.push(this.parseStatement());
                }
                this.expect(tokentype_js_1.TokenType.RSquirly, 'Error: Expected \'}\' after function declaration');
                return new ast_js_1.FunctionDeclaration(name, params, body_1);
            }
            finally {
                this.isFunction = false;
            }
        }
        var body = [];
        while (this.at().type !== tokentype_js_1.TokenType.EndOfFile && this.at().type !== tokentype_js_1.TokenType.RSquirly) {
            body.push(this.parseStatement());
        }
        this.expect(tokentype_js_1.TokenType.RSquirly, 'Error: Expected \'}\' after function declaration');
        return new ast_js_1.FunctionDeclaration(name, params, body);
    };
    Parser.prototype.parseBreakStatement = function () {
        this.eat();
        return new ast_js_1.BreakStatement();
    };
    Parser.prototype.parseReturnStatement = function () {
        this.eat();
        return new ast_js_1.ReturnStatement(this.parseExpression());
    };
    Parser.prototype.parseVariableDeclaration = function () {
        var isConstant = this.eat().type === tokentype_js_1.TokenType.Constant;
        var identifier = this.expect(tokentype_js_1.TokenType.Identifier, 'Error: Expected identifier name after let/const keyword').value;
        if (this.at().type === tokentype_js_1.TokenType.SemiColon) {
            this.eat();
            if (isConstant) {
                console.log('Error: Constant declaration without assignment is not allowed');
                process.exit(0);
                // In TypeScript, we need to return a valid object, so return a new NullLiteral
                // return new VariableDeclaration(isConstant, identifier, new NullLiteral());
            }
            return new ast_js_1.VariableDeclaration(isConstant, identifier, new ast_js_1.NullLiteral());
        }
        this.expect(tokentype_js_1.TokenType.Equals, 'Expected = after identifier name');
        var declaration = new ast_js_1.VariableDeclaration(isConstant, identifier, this.parseExpression());
        if (!this.isLoop) {
            if (this.at().type === tokentype_js_1.TokenType.SemiColon) {
                this.eat();
            }
        }
        return declaration;
    };
    Parser.prototype.parseExpression = function () {
        return this.parseAssignmentExpression();
    };
    Parser.prototype.parseLogicalExpression = function () {
        return this.parseOrExpression();
    };
    Parser.prototype.parseOrExpression = function () {
        var left = this.parseAndExpression();
        while (this.at().value === 'or') {
            this.eat();
            var right = this.parseAndExpression();
            left = new ast_js_1.LogicalExpression(left, right, 'or');
        }
        return left;
    };
    Parser.prototype.parseAndExpression = function () {
        var left = this.parseXorExpression();
        while (this.at().value === 'and') {
            this.eat();
            var right = this.parseXorExpression();
            left = new ast_js_1.LogicalExpression(left, right, 'and');
        }
        return left;
    };
    Parser.prototype.parseXorExpression = function () {
        var left = this.parseNotExpression();
        while (this.at().value === 'xor') {
            this.eat();
            var right = this.parseNotExpression();
            left = new ast_js_1.LogicalExpression(left, right, 'xor');
        }
        return left;
    };
    Parser.prototype.parseNotExpression = function () {
        if (this.at().value === 'not') {
            this.eat();
            return new ast_js_1.LogicalExpression(new ast_js_1.NullLiteral(), this.parseNotExpression(), "not");
        }
        return this.parseComparisonExpression();
    };
    Parser.prototype.parseArrayExpression = function () {
        if (this.at().type !== tokentype_js_1.TokenType.OpenBracket) {
            return this.parseBitwise();
        }
        this.eat();
        var elements = [];
        while (this.at().type !== tokentype_js_1.TokenType.CloseBracket) {
            elements.push(this.parseExpression());
            if (this.at().type === tokentype_js_1.TokenType.Comma) {
                this.eat();
            }
        }
        this.expect(tokentype_js_1.TokenType.CloseBracket, 'Expected closing bracket after array expression');
        return new ast_js_1.ArrayLiteral(elements);
    };
    Parser.prototype.parseAssignmentExpression = function () {
        var left = this.parseOrExpression();
        if (this.at().type === tokentype_js_1.TokenType.Equals) {
            this.eat();
            var value = this.parseAssignmentExpression();
            return new ast_js_1.AssignmentExpression(left, value);
        }
        return left;
    };
    Parser.prototype.parseObjectExpression = function () {
        if (this.at().type !== tokentype_js_1.TokenType.LSquirly) {
            return this.parseArrayExpression();
        }
        this.eat();
        var properties = [];
        while (this.notEndOfFile() && this.at().type !== tokentype_js_1.TokenType.RSquirly) {
            var key = this.expect(tokentype_js_1.TokenType.Identifier, 'Expected identifier as object key').value;
            if (this.at().type === tokentype_js_1.TokenType.Comma) {
                this.eat();
                properties.push(new ast_js_1.Property(key, new ast_js_1.NullLiteral()));
                continue;
            }
            else if (this.at().type === tokentype_js_1.TokenType.RSquirly) {
                properties.push(new ast_js_1.Property(key, new ast_js_1.NullLiteral()));
                continue;
            }
            this.expect(tokentype_js_1.TokenType.Colon, 'Expected : after object key');
            var value = this.parseExpression();
            properties.push(new ast_js_1.Property(key, value));
            if (this.at().type !== tokentype_js_1.TokenType.RSquirly) {
                this.expect(tokentype_js_1.TokenType.Comma, 'Expected , after object property');
            }
        }
        this.expect(tokentype_js_1.TokenType.RSquirly, 'Object literal must end with a }');
        return new ast_js_1.ObjectLiteral(properties);
    };
    Parser.prototype.parseComparisonExpression = function () {
        var left = this.parseObjectExpression();
        while (this.at().value === '>' ||
            this.at().value === '<' ||
            (this.at().value === '=' && this.peek().value === '=') ||
            this.at().value === '!=') {
            var operator = this.eat().value;
            if (this.at().value === '=') {
                operator += this.eat().value;
            }
            var right = this.parseObjectExpression();
            left = new ast_js_1.BinaryExpression(left, right, operator);
        }
        return left;
    };
    Parser.prototype.parseBitwise = function () {
        var left = this.parseBitwiseShiftBit();
        while (this.at().value === '&' || this.at().value === '|' || this.at().value === '^') {
            var operator = this.eat().value;
            var right = this.parseBitwiseShiftBit();
            left = new ast_js_1.BinaryExpression(left, right, operator);
        }
        return left;
    };
    Parser.prototype.parseBitwiseShiftBit = function () {
        var left = this.parseAdditiveExpression();
        while (this.at().value === '<<' || this.at().value === '>>' || this.at().value === '>>>') {
            var operator = this.eat().value;
            var right = this.parseAdditiveExpression();
            left = new ast_js_1.BinaryExpression(left, right, operator);
        }
        return left;
    };
    Parser.prototype.parseAdditiveExpression = function () {
        var left = this.parseMultiplicativeExpression();
        while (this.at().value === '+' || this.at().value === '-') {
            var operator = this.eat().value;
            var right = this.parseMultiplicativeExpression();
            left = new ast_js_1.BinaryExpression(left, right, operator);
        }
        return left;
    };
    Parser.prototype.parseMultiplicativeExpression = function () {
        var left = this.parseCallMemberExpression();
        while (this.at().value === '*' || this.at().value === '/' || this.at().value === '%' || this.at().value === '**' || this.at().value === '//') {
            var operator = this.eat().value;
            var right = this.parseCallMemberExpression();
            left = new ast_js_1.BinaryExpression(left, right, operator);
        }
        return left;
    };
    Parser.prototype.parseCallMemberExpression = function () {
        var member = this.parseMemberExpression();
        if (this.at().type === tokentype_js_1.TokenType.OpenParen) {
            return this.parseCallExpression(member);
        }
        return member;
    };
    Parser.prototype.parseCallExpression = function (caller) {
        var callExpression = new ast_js_1.CallExpression(this.parseArgs(), caller);
        if (this.at().type === tokentype_js_1.TokenType.OpenParen) {
            callExpression = this.parseCallExpression(callExpression);
        }
        return callExpression;
    };
    Parser.prototype.parseArgs = function () {
        this.expect(tokentype_js_1.TokenType.OpenParen, 'Expected \'(\' after function name');
        var args;
        if (this.at().type === tokentype_js_1.TokenType.CloseParen) {
            args = [];
        }
        else {
            args = this.parseArgumentsList();
        }
        this.expect(tokentype_js_1.TokenType.CloseParen, 'Expected \')\' after function arguments');
        return args;
    };
    Parser.prototype.parseArgumentsList = function () {
        var args = [this.parseAssignmentExpression()];
        while (this.at().type === tokentype_js_1.TokenType.Comma) {
            this.eat();
            args.push(this.parseAssignmentExpression());
        }
        return args;
    };
    Parser.prototype.parseMemberExpression = function () {
        var object = this.parsePrimaryExpression();
        while (this.at().type === tokentype_js_1.TokenType.Dot || this.at().type === tokentype_js_1.TokenType.OpenBracket) {
            var operator = this.eat();
            var property = void 0;
            var computed = void 0;
            if (operator.type === tokentype_js_1.TokenType.Dot) {
                computed = false;
                property = this.parsePrimaryExpression();
                if (property.type !== 'Identifier') {
                    console.log('Expected identifier after \'.\'');
                    process.exit(0);
                }
            }
            else {
                computed = true;
                property = this.parseExpression();
                this.expect(tokentype_js_1.TokenType.CloseBracket, 'Expected \']\' after computed property');
            }
            object = new ast_js_1.MemberExpression(object, property, computed);
        }
        return object;
    };
    Parser.prototype.parsePrimaryExpression = function () {
        var token = this.at().type;
        switch (token) {
            case tokentype_js_1.TokenType.Identifier:
                return new ast_js_1.Identifier(this.eat().value);
            case tokentype_js_1.TokenType.Number:
                var value = parseFloat(this.eat().value);
                if (isNaN(value)) {
                    console.log('Error: Failed to parse numeric literal');
                    process.exit(0);
                }
                return new ast_js_1.NumericLiteral(value);
            case tokentype_js_1.TokenType.String:
                return new ast_js_1.StringLiteral(this.eat().value);
            case tokentype_js_1.TokenType.Whitespace:
                this.eat();
                return this.parsePrimaryExpression();
            case tokentype_js_1.TokenType.OpenParen:
                this.eat();
                var parsedExpression = this.parseExpression();
                this.expect(tokentype_js_1.TokenType.CloseParen, 'Expected closing parenthesis');
                return parsedExpression;
            case tokentype_js_1.TokenType.UnaryOperator:
                var unaryOperator = this.eat().value;
                var unaryValue = this.parsePrimaryExpression();
                return new ast_js_1.UnaryExpression(unaryValue, unaryOperator);
            case tokentype_js_1.TokenType.Function:
                return this.parseFunctionDeclaration();
            default:
                console.log('Unexpected token found: ', this.at());
                process.exit(0);
        }
    };
    Parser.prototype.at = function () {
        return this.tokens[0];
    };
    Parser.prototype.eat = function () {
        var prev = this.tokens[0];
        this.tokens = this.tokens.slice(1);
        return prev;
    };
    Parser.prototype.peek = function () {
        return this.tokens[1];
    };
    Parser.prototype.expect = function (token, message) {
        if (this.at().type !== token) {
            console.log(message);
            process.exit(0);
        }
        return this.eat();
    };
    Parser.prototype.notEndOfFile = function () {
        return this.tokens[0].type !== tokentype_js_1.TokenType.EndOfFile;
    };
    return Parser;
}());
exports.Parser = Parser;
