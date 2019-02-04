class Dom {
	static asArray(list: NodeListOf<Element> | HTMLCollectionOf<Element>) {
		let result = <Array<HTMLElement>>[];
		for (let i = 0; i < list.length; i++) result.push(<HTMLElement>list[i]);
		return result;
	}

	static on(element: HTMLElement, event: string, listener: EventListener) {
		element.addEventListener(event, listener);
	}
}

let sampleInput = {
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
		}
	]
};

let sampleOutput = {
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

let sampleResult = "Field1 = '' AND ()";

enum ops {
	scalar = "scalar",
	field = "field",
	equal = "=",
	and = "and",
	or = "or",
	not = "not",
	notequal = "!=",
	lt = "<",
	gt = ">",
	lte = "<=",
	gte = ">=",
	like = "like"
}
class Operator {
	public operator: ops;
	public operands: Operator[];

	static create(name: ops, first?: any, second?: any);
	static create(name: any);
	static create(name: ops, first?: any, second?: any) {
		if (first === undefined) {
			first = name;
			name = ops.scalar;
		}
		let result = new Operator();
		result.operator = name;
		result.operands = [first];
		second && result.operands.push(second);
		return result;
	}

	public render() {
		switch (this.operator) {
			case ops.scalar:
				return this.operands[0];
			default:
				switch (this.operands.length) {
					case 1:
						return `${this.operator}(${this.operands[0].render()})`;
					case 2:
						return `${this.operands[0].render()} ${this.operator} ${this.operands[1].render()}`;
					default:
						throw "Invalid Expression";
				}
		}
	}
}

console.log(Operator.create(0).toString());
console.log(Operator.create(ops.equal, 1, 1).toString());

class Field {
	name: string;
	type: any;
}

class Editor {
	render(fields: Field[], filter: Operator) {
		let markup = (op: Operator) => {
			console.log(op);
			if (!op.operands) return scalarMarkup(op);
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

		let scalarMarkup = (op: Operator) => `<value>${op}</value>`;

		let unaryMarkup = (op: Operator) => `
        <operation><operator>${op.operator}</operator>
        <operand>${markup(op.operands[0])}</operand></operation>`;

		let binaryMarkup = (op: Operator) => `
        <operation ops="2"><operand>${markup(op.operands[0])}</operand>
        <operator>${op.operator}</operator>
        <operand>${markup(op.operands[1])}</operand></operation>`;

		let dom = document.createElement("expression");
		dom.innerHTML = markup(filter);
		Dom.asArray(dom.getElementsByTagName("operation")).forEach((node, i) => {
			node.className = i % 2 ? "inline" : "nested";
		});
		Dom.asArray(dom.getElementsByTagName("operator")).forEach((node, i) => {
			Dom.on(node, "click", () => this.operatorClicked(node));
		});
		Dom.asArray(dom.getElementsByTagName("operand")).forEach((node, i) => {
			if (node.getElementsByTagName("operand").length === 0) {
				Dom.on(node, "click", () => this.operandClicked(node));
			}
		});
		return dom;
	}

	operatorClicked(operator: HTMLElement) {
		alert("operator clicked");
	}

	operandClicked(operator: HTMLElement) {
		alert("operand clicked");
	}
}

let test1 = Operator.create(ops.equal, Operator.create(ops.field, "Field2"), Operator.create(0));

let test2 = Operator.create(
	ops.not,
	Operator.create(ops.notequal, Operator.create(ops.field, "Field1"), Operator.create(false))
);

let test3 = Operator.create(
	ops.not,
	Operator.create(ops.like, Operator.create(ops.field, "Field1"), Operator.create(ops.scalar, "%HELLO%"))
);

let test4 = Operator.create(ops.not, Operator.create(ops.equal, Operator.create(true), Operator.create(false)));

test4 = Operator.create(ops.lt, 4, test4);

let test = Operator.create(
	ops.and,
	Operator.create(ops.not, Operator.create(ops.and, test1, test4)),
	Operator.create(ops.or, test2, test3)
);

console.log(JSON.stringify(test, null, "\t"));
console.log(test.toString());

let editor = new Editor();
let html = editor.render(sampleInput.fields, test);
console.log(html);

export = html;
