declare var wrongAnswer: Function;

export class QaInput extends HTMLElement {
	input: HTMLInputElement;
	label: HTMLLabelElement;

	constructor() {
		super();
		this.label = document.createElement("label");
		this.input = document.createElement("input");
		this.input.type = "text";
	}

	focus() {
		this.input.focus();
	}

	wrongAnswer() {
		// hack into method defined in index.html
		wrongAnswer();
	}

	isMatch(a: string, b: string) {
		if (a.toUpperCase() === b.toUpperCase()) return true;
		switch (b.toLocaleLowerCase()) {
			case "á":
				if (a.toUpperCase() == "A") return true;
			case "é":
				if (a.toUpperCase() == "E") return true;
			case "í":
				if (a.toUpperCase() == "I") return true;
			case "ñ":
				if (a.toUpperCase() == "N") return true;
			case "ó":
				if (a.toUpperCase() == "O") return true;
			case "ú":
				if (a.toUpperCase() == "U") return true;
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
            padding-right: 10px;
            display: inline-block;
            min-width: 240px;
            max-width: 240px;
            whitespace:wrap;
        }
        input {
            vertical-align: top;
            background-color: black;
            border: none;
            color: gray;
            padding-left: 10px;
            min-height: 64px;
            max-height: 64px;
            min-width: 320px;
            max-width: 320px;
            height: 48px;
        }
        </style>`;
		input.onkeypress = ev => {
			//ev.preventDefault = true;
			if (input.readOnly) return;
			let currentKey = ev.key;
			let currentValue = input.value;
			let expectedKey = answer[currentValue.length];
			console.log(currentKey, expectedKey);
			if (this.isMatch(currentKey, expectedKey)) {
				input.classList.remove("wrong");
				input.value = answer.substring(0, currentValue.length + 1);
				if (answer.length === currentValue.length + 1) {
					input.classList.add("correct");
					input.readOnly = true;
					let s = this.nextElementSibling as QaInput;
					console.log(s);
					setTimeout(() => s && s.focus(), 200);
					return false;
				}
				console.log("+");
				return false;
			} else {
				input.classList.add("wrong");
				this.wrongAnswer();
			}
			console.log("-");
			return false;
		};

		const shadowRoot = this.attachShadow({ mode: "open" });
		shadowRoot.appendChild(label);
		shadowRoot.appendChild(input);
	}
}
