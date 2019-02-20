import { WebComponent } from "./webcomponent";
import { SystemEvents } from "./system-events";

export class QaInput extends WebComponent {
	input: HTMLInputElement;
	label: HTMLLabelElement;

	constructor(domNode: HTMLElement) {
		super(domNode);
		this.label = document.createElement("label");
		this.input = document.createElement("input");
		this.input.type = "text";
	}

	focus() {
		this.input.focus();
	}

	rightAnswer() {
		SystemEvents.trigger("correct", { value: 1 });
	}

	wrongAnswer() {
		SystemEvents.trigger("incorrect", { value: -1 });
	}

	isMatch(a: string, b: string) {
		let A = a.toUpperCase();
		let B = b.toUpperCase();
		if (A === B) return true;
		switch (b.toLocaleLowerCase()) {
			case "á":
				if (A == "A") return true;
			case "é":
				if (A == "E") return true;
			case "í":
				if (A == "I") return true;
			case "ñ":
				if (A == "N") return true;
			case "ó":
				if (A == "O") return true;
			case "ú":
				if (A == "U") return true;
			case "¡":
				if (A == "!") return true;
			case "¿":
				if (A == "?") return true;
			case "’":
				if (A == "'") return true;
		}
		return false;
	}

	connectedCallback() {
		const label = this.label;
		label.textContent = this.getAttribute("question");
		label.title = this.getAttribute("hint") || this.getAttribute("answer") || "";

		const input = this.input;
		const answer = this.getAttribute("answer") || "";
		input.maxLength = answer.length;
		input.innerHTML = `<style>
        .correct {
            color: green;
            border: 1px solid green;
        }
        .wrong {
            border: 1px solid red;
        }
        label {
			font-size: x-large;
            display: block;
			whitespace:wrap;
			margin-top: 20px;
        }
        input {
			font-size: x-large;
			display: block;
            vertical-align: top;
            background-color: black;
            border: none;
            color: gray;
            padding-left: 10px;
            min-height: 64px;
			max-height: 64px;
			width: 100%;
        }
        </style>`;
		input.onkeypress = ev => {
			ev.preventDefault();
			if (input.readOnly) return;
			let currentKey = ev.key;
			let currentValue = input.value;
			let expectedKey = answer[currentValue.length];
			console.log(currentKey, expectedKey);
			if (this.isMatch(currentKey, expectedKey)) {
				input.classList.remove("wrong");
				input.value = answer.substring(0, currentValue.length + 1);
				this.rightAnswer();
				if (answer.length === currentValue.length + 1) {
					input.classList.add("correct");
					input.readOnly = true;
					let s = this.nextElementSibling() as QaInput;
					console.log(s);
					setTimeout(() => s && s.focus(), 200);
					return false;
				}
				return false;
			} else {
				input.classList.add("wrong");
				this.wrongAnswer();
				input.value = answer.substring(0, currentValue.length + 1);
			}
			return false;
		};

		const shadowRoot = this.attachShadow({ mode: "open" });
		shadowRoot.appendChild(label);
		shadowRoot.appendChild(input);
	}
}
