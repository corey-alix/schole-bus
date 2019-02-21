import { WebComponent, getComponent } from "./webcomponent";
import { SystemEvents } from "./system-events";
import { log } from "./console-log";
import { mapping } from "./keydown-as-keypress";

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

	provideHelp() {
		const answer = this.getAttribute("answer") || "";
		let input = this.input;
		let currentValue = input.value;
		input.value = answer.substring(0, currentValue.length + 1);
	}

	validate() {
		const answer = this.getAttribute("answer") || "";
		let input = this.input;
		let currentValue = input.value;
		if (answer.length === currentValue.length) {
			input.readOnly = true;
			input.classList.remove("wrong");
			input.classList.add("correct");
			return true;
		}
		return false;
	}

	connectedCallback() {
		const input = this.input;
		const answer = this.getAttribute("answer") || "";
		const label = this.label;

		label.textContent = this.getAttribute("question");
		label.title = this.getAttribute("hint") || answer;

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

		let shiftMap = [];
		input.onkeydown = ev => {
			// mapping.record(ev);
			try {
				ev.preventDefault();
				if (input.readOnly) return;
				switch (ev.keyCode) {
					case 8: // backspace
					case 9: // tab
					case 13: // enter
					case 16: // shift
					case 17: // ctrl
					case 18: // alt
					case 46: // del
						return false;
					case 112: // F1
						// mapping.play(); return false;
						this.provideHelp();
						if (this.validate()) this.tab();
						return false;
				}

				let currentValue = input.value;
				let expectedKey = answer[currentValue.length];

				let currentKey = mapping.get(ev);

				log(
					`${ev.key.charCodeAt(0)}->${currentKey.charCodeAt(0)}: currentKey=${currentKey}, keyCode=${
						ev.keyCode
					}, hint=${expectedKey}`
				);
				if (this.isMatch(currentKey, expectedKey)) {
					input.value = answer.substring(0, currentValue.length + 1);
					this.rightAnswer();
					if (this.validate()) {
						this.tab();
					}
					return false;
				} else {
					input.classList.add("wrong");
					this.wrongAnswer();
				}
				return false;
			} catch (ex) {
				log(ex);
			}
		};

		const shadowRoot = this.attachShadow({ mode: "open" });
		shadowRoot.appendChild(label);
		shadowRoot.appendChild(input);
	}

	tab() {
		let s = this as QaInput;

		s = s.nextElementSibling() as QaInput;
		while (s && s.input.readOnly) s = s.nextElementSibling() as QaInput;

		// scan again from the top
		if (!s) {
			if (this.domNode.parentElement) {
				if (this.domNode.parentElement.firstElementChild) {
					s = getComponent(this.domNode.parentElement.firstElementChild as HTMLElement) as QaInput;
					while (s && s.input.readOnly) s = s.nextElementSibling() as QaInput;
				}
			}
		}
		log(s ? "next found" : "no next input");
		if (!s) SystemEvents.trigger("no-more-input", {});
		else setTimeout(() => s && s.focus(), 200);
	}
}
