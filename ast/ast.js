"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberExpression = exports.CallExpression = exports.ArrayLiteral = exports.ObjectLiteral = exports.Property = exports.NullLiteral = exports.StringLiteral = exports.NumericLiteral = exports.Identifier = exports.LogicalExpression = exports.UnaryExpression = exports.BinaryExpression = exports.AssignmentExpression = exports.ForStatement = exports.ForEachStatement = exports.LoopStatement = exports.WhileStatement = exports.ConditionalStatement = exports.Comment = exports.ClassDeclaration = exports.ImportStatement = exports.BreakStatement = exports.ReturnStatement = exports.FunctionDeclaration = exports.VariableDeclaration = exports.Program = void 0;
var Program = /** @class */ (function () {
    function Program(body) {
        this.body = body;
    }
    Program.prototype.toString = function () {
        return this.body.map(function (statement) { return statement.toString(); }).join("\n");
    };
    Object.defineProperty(Program.prototype, "type", {
        get: function () {
            return "Program";
        },
        enumerable: false,
        configurable: true
    });
    return Program;
}());
exports.Program = Program;
var VariableDeclaration = /** @class */ (function () {
    function VariableDeclaration(constant, identifier, value) {
        this.constant = constant;
        this.identifier = identifier;
        this.value = value;
    }
    VariableDeclaration.prototype.toString = function () {
        return "".concat(this.constant ? "const" : "let", " ").concat(this.identifier, " = ").concat(this.value.toString(), ";");
    };
    Object.defineProperty(VariableDeclaration.prototype, "type", {
        get: function () {
            return "VariableDeclaration";
        },
        enumerable: false,
        configurable: true
    });
    return VariableDeclaration;
}());
exports.VariableDeclaration = VariableDeclaration;
var FunctionDeclaration = /** @class */ (function () {
    function FunctionDeclaration(name, parameters, body, isAnonymous) {
        if (isAnonymous === void 0) { isAnonymous = false; }
        this.name = name;
        this.parameters = parameters;
        this.body = body;
        this.isAnonymous = isAnonymous;
    }
    FunctionDeclaration.prototype.toString = function () {
        return "function ".concat(this.name, "(").concat(this.parameters.join(", "), ") {\n").concat(this.body
            .map(function (statement) { return statement.toString(); })
            .join("\n"), "\n}");
    };
    FunctionDeclaration.prototype.cloneBody = function () {
        return structuredClone(this.body);
    };
    FunctionDeclaration.prototype.cloneParameters = function () {
        return structuredClone(this.parameters);
    };
    Object.defineProperty(FunctionDeclaration.prototype, "type", {
        get: function () {
            return "FunctionDeclaration";
        },
        enumerable: false,
        configurable: true
    });
    return FunctionDeclaration;
}());
exports.FunctionDeclaration = FunctionDeclaration;
var ReturnStatement = /** @class */ (function () {
    function ReturnStatement(value) {
        this.value = value;
    }
    ReturnStatement.prototype.toString = function () {
        return "return ".concat(this.value.toString(), ";");
    };
    Object.defineProperty(ReturnStatement.prototype, "type", {
        get: function () {
            return "ReturnStatement";
        },
        enumerable: false,
        configurable: true
    });
    return ReturnStatement;
}());
exports.ReturnStatement = ReturnStatement;
var BreakStatement = /** @class */ (function () {
    function BreakStatement() {
    }
    BreakStatement.prototype.toString = function () {
        return "break";
    };
    Object.defineProperty(BreakStatement.prototype, "type", {
        get: function () {
            return "BreakStatement";
        },
        enumerable: false,
        configurable: true
    });
    return BreakStatement;
}());
exports.BreakStatement = BreakStatement;
var ImportStatement = /** @class */ (function () {
    function ImportStatement(path) {
        this.path = path;
    }
    ImportStatement.prototype.toString = function () {
        return "import ".concat(this.path);
    };
    Object.defineProperty(ImportStatement.prototype, "type", {
        get: function () {
            return "ImportStatement";
        },
        enumerable: false,
        configurable: true
    });
    return ImportStatement;
}());
exports.ImportStatement = ImportStatement;
var ClassDeclaration = /** @class */ (function () {
    function ClassDeclaration(name, body) {
        this.name = name;
        this.body = body;
    }
    ClassDeclaration.prototype.toString = function () {
        return "export class ".concat(this.name, " {\n").concat(this.body.map(function (statement) { return statement.toString(); }).join("\n"), "\n}");
    };
    Object.defineProperty(ClassDeclaration.prototype, "type", {
        get: function () {
            return "ClassDeclaration";
        },
        enumerable: false,
        configurable: true
    });
    return ClassDeclaration;
}());
exports.ClassDeclaration = ClassDeclaration;
var Comment = /** @class */ (function () {
    function Comment(text) {
        this.text = text;
    }
    Comment.prototype.toString = function () {
        return "/* ".concat(this.text, " */");
    };
    Object.defineProperty(Comment.prototype, "type", {
        get: function () {
            return "Comment";
        },
        enumerable: false,
        configurable: true
    });
    return Comment;
}());
exports.Comment = Comment;
var ConditionalStatement = /** @class */ (function () {
    function ConditionalStatement(condition, body, alternate) {
        if (alternate === void 0) { alternate = []; }
        this.condition = condition;
        this.body = body;
        this.alternate = alternate;
    }
    ConditionalStatement.prototype.toString = function () {
        return "if (".concat(this.condition.toString(), ") {\n").concat(this.body
            .map(function (statement) { return statement.toString(); })
            .join("\n"), "\n} else {\n").concat(this.alternate.map(function (statement) { return statement.toString(); }).join("\n"), "\n}");
    };
    Object.defineProperty(ConditionalStatement.prototype, "type", {
        get: function () {
            return "ConditionalStatement";
        },
        enumerable: false,
        configurable: true
    });
    return ConditionalStatement;
}());
exports.ConditionalStatement = ConditionalStatement;
var WhileStatement = /** @class */ (function () {
    function WhileStatement(condition, body) {
        this.condition = condition;
        this.body = body;
    }
    WhileStatement.prototype.toString = function () {
        return "while (".concat(this.condition.toString(), ") {\n").concat(this.body.map(function (statement) { return statement.toString(); }).join("\n"), "\n}");
    };
    Object.defineProperty(WhileStatement.prototype, "type", {
        get: function () {
            return "WhileStatement";
        },
        enumerable: false,
        configurable: true
    });
    return WhileStatement;
}());
exports.WhileStatement = WhileStatement;
var LoopStatement = /** @class */ (function () {
    function LoopStatement(body) {
        this.body = body;
    }
    LoopStatement.prototype.toString = function () {
        return "loop {\n".concat(this.body.map(function (statement) { return statement.toString(); }).join("\n"), "\n}");
    };
    Object.defineProperty(LoopStatement.prototype, "type", {
        get: function () {
            return "LoopStatement";
        },
        enumerable: false,
        configurable: true
    });
    return LoopStatement;
}());
exports.LoopStatement = LoopStatement;
var ForEachStatement = /** @class */ (function () {
    function ForEachStatement(identifier, array, body) {
        this.identifier = identifier;
        this.array = array;
        this.body = body;
    }
    ForEachStatement.prototype.toString = function () {
        return "foreach (".concat(this.identifier, " in ").concat(this.array.toString(), ") {\n").concat(this.body
            .map(function (statement) { return statement.toString(); })
            .join("\n"), "\n}");
    };
    Object.defineProperty(ForEachStatement.prototype, "type", {
        get: function () {
            return "ForEachStatement";
        },
        enumerable: false,
        configurable: true
    });
    return ForEachStatement;
}());
exports.ForEachStatement = ForEachStatement;
var ForStatement = /** @class */ (function () {
    function ForStatement(init, condition, update, body) {
        this.init = init;
        this.condition = condition;
        this.update = update;
        this.body = body;
    }
    ForStatement.prototype.toString = function () {
        return "for (".concat(this.init.toString(), "; ").concat(this.condition.toString(), "; ").concat(this.update.toString(), ") {\n").concat(this.body
            .map(function (statement) { return statement.toString(); })
            .join("\n"), "\n}");
    };
    Object.defineProperty(ForStatement.prototype, "type", {
        get: function () {
            return "ForStatement";
        },
        enumerable: false,
        configurable: true
    });
    return ForStatement;
}());
exports.ForStatement = ForStatement;
var AssignmentExpression = /** @class */ (function () {
    function AssignmentExpression(asssigne, value) {
        this.asssigne = asssigne;
        this.value = value;
    }
    AssignmentExpression.prototype.toString = function () {
        return "".concat(this.asssigne.toString(), " = ").concat(this.value.toString());
    };
    Object.defineProperty(AssignmentExpression.prototype, "type", {
        get: function () {
            return "AssignmentExpression";
        },
        enumerable: false,
        configurable: true
    });
    return AssignmentExpression;
}());
exports.AssignmentExpression = AssignmentExpression;
var BinaryExpression = /** @class */ (function () {
    function BinaryExpression(left, right, operator) {
        this.left = left;
        this.right = right;
        this.operator = operator;
    }
    BinaryExpression.prototype.toString = function () {
        return "".concat(this.left.toString(), " ").concat(this.operator, " ").concat(this.right.toString());
    };
    Object.defineProperty(BinaryExpression.prototype, "type", {
        get: function () {
            return "BinaryExpression";
        },
        enumerable: false,
        configurable: true
    });
    return BinaryExpression;
}());
exports.BinaryExpression = BinaryExpression;
var UnaryExpression = /** @class */ (function () {
    function UnaryExpression(value, operator) {
        this.value = value;
        this.operator = operator;
    }
    UnaryExpression.prototype.toString = function () {
        return "".concat(this.operator).concat(this.value.toString());
    };
    Object.defineProperty(UnaryExpression.prototype, "type", {
        get: function () {
            return "UnaryExpression";
        },
        enumerable: false,
        configurable: true
    });
    return UnaryExpression;
}());
exports.UnaryExpression = UnaryExpression;
var LogicalExpression = /** @class */ (function () {
    function LogicalExpression(left, right, operator) {
        this.left = left;
        this.right = right;
        this.operator = operator;
    }
    LogicalExpression.prototype.toString = function () {
        if (this.operator === "not") {
            return "".concat(this.operator, " ").concat(this.left.toString());
        }
        return "".concat(this.left.toString(), " ").concat(this.operator, " ").concat(this.right.toString());
    };
    Object.defineProperty(LogicalExpression.prototype, "type", {
        get: function () {
            return "LogicalExpression";
        },
        enumerable: false,
        configurable: true
    });
    return LogicalExpression;
}());
exports.LogicalExpression = LogicalExpression;
var Identifier = /** @class */ (function () {
    function Identifier(symbol) {
        this.symbol = symbol;
    }
    Identifier.prototype.toString = function () {
        return this.symbol;
    };
    Object.defineProperty(Identifier.prototype, "type", {
        get: function () {
            return "Identifier";
        },
        enumerable: false,
        configurable: true
    });
    return Identifier;
}());
exports.Identifier = Identifier;
var NumericLiteral = /** @class */ (function () {
    function NumericLiteral(value) {
        this.value = value;
    }
    NumericLiteral.prototype.toString = function () {
        return this.value.toString();
    };
    Object.defineProperty(NumericLiteral.prototype, "type", {
        get: function () {
            return "NumericLiteral";
        },
        enumerable: false,
        configurable: true
    });
    return NumericLiteral;
}());
exports.NumericLiteral = NumericLiteral;
var StringLiteral = /** @class */ (function () {
    function StringLiteral(value) {
        this.value = value;
    }
    StringLiteral.prototype.toString = function () {
        return "\"".concat(this.value, "\"");
    };
    Object.defineProperty(StringLiteral.prototype, "type", {
        get: function () {
            return "StringLiteral";
        },
        enumerable: false,
        configurable: true
    });
    return StringLiteral;
}());
exports.StringLiteral = StringLiteral;
var NullLiteral = /** @class */ (function () {
    function NullLiteral() {
    }
    NullLiteral.prototype.toString = function () {
        return "null";
    };
    Object.defineProperty(NullLiteral.prototype, "type", {
        get: function () {
            return "NullLiteral";
        },
        enumerable: false,
        configurable: true
    });
    return NullLiteral;
}());
exports.NullLiteral = NullLiteral;
var Property = /** @class */ (function () {
    function Property(key, value) {
        this.key = key;
        this.value = value;
    }
    Property.prototype.toString = function () {
        return "".concat(this.key, ": ").concat(this.value.toString());
    };
    Object.defineProperty(Property.prototype, "type", {
        get: function () {
            return "Property";
        },
        enumerable: false,
        configurable: true
    });
    return Property;
}());
exports.Property = Property;
var ObjectLiteral = /** @class */ (function () {
    function ObjectLiteral(properties) {
        this.properties = properties;
    }
    ObjectLiteral.prototype.toString = function () {
        return "{".concat(this.properties.map(function (property) { return property.toString(); }).join(", "), "}");
    };
    Object.defineProperty(ObjectLiteral.prototype, "type", {
        get: function () {
            return "ObjectLiteral";
        },
        enumerable: false,
        configurable: true
    });
    return ObjectLiteral;
}());
exports.ObjectLiteral = ObjectLiteral;
var ArrayLiteral = /** @class */ (function () {
    function ArrayLiteral(elements) {
        this.elements = elements;
    }
    ArrayLiteral.prototype.toString = function () {
        return "[".concat(this.elements.map(function (element) { return element.toString(); }).join(", "), "]");
    };
    Object.defineProperty(ArrayLiteral.prototype, "type", {
        get: function () {
            return "ArrayLiteral";
        },
        enumerable: false,
        configurable: true
    });
    return ArrayLiteral;
}());
exports.ArrayLiteral = ArrayLiteral;
var CallExpression = /** @class */ (function () {
    function CallExpression(args, callee) {
        this.args = args;
        this.callee = callee;
    }
    CallExpression.prototype.toString = function () {
        return "".concat(this.callee.toString(), "(").concat(this.args.map(function (arg) { return arg.toString(); }).join(", "), ")");
    };
    Object.defineProperty(CallExpression.prototype, "type", {
        get: function () {
            return "CallExpression";
        },
        enumerable: false,
        configurable: true
    });
    return CallExpression;
}());
exports.CallExpression = CallExpression;
var MemberExpression = /** @class */ (function () {
    function MemberExpression(object, property, computed) {
        this.object = object;
        this.property = property;
        this.computed = computed;
    }
    MemberExpression.prototype.toString = function () {
        if (this.computed) {
            return "".concat(this.object.toString(), "[").concat(this.property.toString(), "]");
        }
        return "".concat(this.object.toString(), ".").concat(this.property.toString());
    };
    Object.defineProperty(MemberExpression.prototype, "type", {
        get: function () {
            return "MemberExpression";
        },
        enumerable: false,
        configurable: true
    });
    return MemberExpression;
}());
exports.MemberExpression = MemberExpression;
