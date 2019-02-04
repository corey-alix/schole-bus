"use strict";
var Dom = /** @class */ (function () {
    function Dom() {
    }
    Dom.asArray = function (list) {
        var result = [];
        for (var i = 0; i < list.length; i++)
            result.push(list[i]);
        return result;
    };
    Dom.on = function (element, event, listener) {
        element.addEventListener(event, listener);
    };
    return Dom;
}());
var sampleInput = {
    fields: [
        {
            name: "Field1",
            type: ""
        },
        {
            name: "Field2",
            type: 0
        },
        {
            name: "Field3",
            type: new Date()
        },
        {
            name: "Field4",
            type: true
        },
    ]
};
var sampleOutput = {
    and: {
        left: {
            equal: {
                left: "Field1",
                right: { value: "" }
            }
        },
        right: {
            and: {
                left: {
                    not: {
                        equal: {
                            left: "Field2",
                            right: { value: 0 }
                        }
                    }
                },
                right: {
                    not: {
                        equal: {
                            left: "Field2",
                            right: { value: 0 }
                        }
                    }
                }
            }
        }
    }
};
var sampleResult = "Field1 = '' AND ()";
var ops;
(function (ops) {
    ops["scalar"] = "scalar";
    ops["field"] = "field";
    ops["equal"] = "=";
    ops["and"] = "and";
    ops["or"] = "or";
    ops["not"] = "not";
    ops["notequal"] = "!=";
    ops["lt"] = "<";
    ops["gt"] = ">";
    ops["lte"] = "<=";
    ops["gte"] = ">=";
    ops["like"] = "like";
})(ops || (ops = {}));
var Operator = /** @class */ (function () {
    function Operator() {
    }
    Operator.create = function (name, first, second) {
        if (first === undefined) {
            first = name;
            name = ops.scalar;
        }
        var result = new Operator();
        result.operator = name;
        result.operands = [first];
        second && result.operands.push(second);
        return result;
    };
    Operator.prototype.render = function () {
        switch (this.operator) {
            case ops.scalar:
                return this.operands[0];
            default:
                switch (this.operands.length) {
                    case 1:
                        return this.operator + "(" + this.operands[0].render() + ")";
                    case 2:
                        return this.operands[0].render() + " " + this.operator + " " + this.operands[1].render();
                    default:
                        throw "Invalid Expression";
                }
        }
    };
    return Operator;
}());
console.log(Operator.create(0).toString());
console.log(Operator.create(ops.equal, 1, 1).toString());
var Field = /** @class */ (function () {
    function Field() {
    }
    return Field;
}());
var Editor = /** @class */ (function () {
    function Editor() {
    }
    Editor.prototype.render = function (fields, filter) {
        var _this = this;
        var markup = function (op) {
            console.log(op);
            if (!op.operands)
                return scalarMarkup(op);
            switch (op.operands.length) {
                case 1:
                    switch (op.operator) {
                        case ops.scalar:
                            return scalarMarkup(op.operands[0]);
                    }
                    return unaryMarkup(op);
                case 2:
                    return binaryMarkup(op);
                default:
                    throw "Invalid Expression";
            }
        };
        var scalarMarkup = function (op) { return "<value>" + op + "</value>"; };
        var unaryMarkup = function (op) { return "\n        <operation><operator>" + op.operator + "</operator>\n        <operand>" + markup(op.operands[0]) + "</operand></operation>"; };
        var binaryMarkup = function (op) { return "\n        <operation ops=\"2\"><operand>" + markup(op.operands[0]) + "</operand>\n        <operator>" + op.operator + "</operator>\n        <operand>" + markup(op.operands[1]) + "</operand></operation>"; };
        var dom = document.createElement("expression");
        dom.innerHTML = markup(filter);
        Dom.asArray(dom.getElementsByTagName("operation")).forEach(function (node, i) {
            node.className = (i % 2) ? "inline" : "nested";
        });
        Dom.asArray(dom.getElementsByTagName("operator")).forEach(function (node, i) {
            Dom.on(node, "click", function () { return _this.operatorClicked(node); });
        });
        Dom.asArray(dom.getElementsByTagName("operand")).forEach(function (node, i) {
            if (node.getElementsByTagName("operand").length === 0) {
                Dom.on(node, "click", function () { return _this.operandClicked(node); });
            }
        });
        return dom;
    };
    Editor.prototype.operatorClicked = function (operator) {
        alert("operator clicked");
    };
    Editor.prototype.operandClicked = function (operator) {
        alert("operand clicked");
    };
    return Editor;
}());
var test1 = Operator.create(ops.equal, Operator.create(ops.field, "Field2"), Operator.create(0));
var test2 = Operator.create(ops.not, Operator.create(ops.notequal, Operator.create(ops.field, "Field1"), Operator.create(false)));
var test3 = Operator.create(ops.not, Operator.create(ops.like, Operator.create(ops.field, "Field1"), Operator.create(ops.scalar, "%HELLO%")));
var test4 = Operator.create(ops.not, Operator.create(ops.equal, Operator.create(true), Operator.create(false)));
test4 = Operator.create(ops.lt, 4, test4);
var test = Operator.create(ops.and, Operator.create(ops.not, Operator.create(ops.and, test1, test4)), Operator.create(ops.or, test2, test3));
console.log(JSON.stringify(test, null, '\t'));
console.log(test.toString());
var editor = new Editor();
var html = editor.render(sampleInput.fields, test);
console.log(html);
module.exports = html;
