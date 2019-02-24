import { WebComponent, getComponent, cssin } from "./webcomponent";
import { SystemEvents } from "./system-events";
import { log } from "./console-log";
import { mapping } from "./keydown-as-keypress";

cssin(
	"qa-input",
	`qa-input {
	padding: 20px;
}
qa-input .correct {
	color: green;
	border: 1px solid green;
}
qa-input .wrong {
	border: 1px solid red;
}
qa-input label {
	font-size: xx-large;
	whitespace:wrap;
	margin-top: 20px;
	padding: 20px;
}
qa-input input {
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
	padding: 20px;
}
qa-input button {
    background: transparent;
    border: none;
    color: gray;
	position: relative;
    bottom: 3px;
	left: 10px;
}
qa-input button[disabled] {
	color: green;
}`
);

let sound = document.createElement("audio");
sound.src = "beep-07.wav";
sound.autoplay = false;

SystemEvents.watch("incorrect", () => sound.play());

function dump(o: KeyboardEvent) {
	let result = <any>{};
	for (let p in o) {
		if (p === p.toUpperCase()) continue;
		let v = (<any>o)[p];
		if (typeof v === "string" || typeof v === "number") result[p] = v + "";
	}
	log(JSON.stringify(result));
}

export class QaInput extends WebComponent {
	input: HTMLInputElement;
	label: HTMLLabelElement;
	help: HTMLButtonElement;
	score = [0, 0];

	constructor(domNode: HTMLElement) {
		super(domNode);
		this.label = document.createElement("label");
		this.input = document.createElement("input");
		this.input.type = "text";
		this.input.spellcheck = false;
		this.help = document.createElement("button");
		this.help.tabIndex = -1; // no tab
		this.help.type = "button";
		this.help.innerHTML = "�";
	}

	focus() {
		this.input.focus();
		this.play();
	}

	hint() {
		this.score[1]++;
		SystemEvents.trigger("hint", { hint: this.getAttribute("answer") });
		SystemEvents.trigger("play", { es: this.getAttribute("answer") });
	}

	play() {
		document.title = this.getAttribute("question") || "?";
		SystemEvents.trigger("play", { en: this.getAttribute("question") });
	}

	rightAnswer() {
		this.score[0]++;
		SystemEvents.trigger("correct", { value: 1 });
	}

	wrongAnswer() {
		this.score[1]++;
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
			this.help.disabled = true;
			input.readOnly = true;
			input.classList.remove("wrong");
			input.classList.add("correct");
			let score = this.score[0];
			// bonus points if no mistakes
			if (this.score[1] == 0) score += 5 * Math.min(10, input.value.length / 2);
			else score -= this.score[1];
			if (score > 0) {
				this.help.innerHTML = `+${score} ☑`;
			} else {
				this.help.innerHTML = `☑`;
			}
			SystemEvents.trigger("xp", { score, question: this.getAttribute("question") });
			SystemEvents.trigger("play", { es: this.getAttribute("answer") });
			let priorScore = parseFloat(this.getAttribute("score") || "0");
			this.label.title = score + priorScore + "";
			return true;
		}
		return false;
	}

	connectedCallback() {
		const input = this.input;
		const answer = this.getAttribute("answer") || "";
		const question = this.getAttribute("question") || "";
		const hint = this.getAttribute("hint") || "";
		const label = this.label;

		label.textContent = question;
		label.title = this.getAttribute("score") || "";

		input.maxLength = answer.length;

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
						this.hint();
						return false;
					case 113: // F2
						this.provideHelp();
						if (this.validate()) this.tab();
						return false;
				}

				let currentValue = input.value;
				let expectedKey = answer[currentValue.length];

				if (!ev.key || ev.key.length > 1) {
					dump(ev);
				}
				let currentKey = ev.key || mapping.get(ev);

				// log(
				// 	`${ev.key.charCodeAt(0)}->${currentKey.charCodeAt(0)}: currentKey=${currentKey}, keyCode=${
				// 		ev.keyCode
				// 	}, hint=${expectedKey}`
				// );
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
		label.appendChild(this.help);
		shadowRoot.appendChild(input);

		this.help.onclick = () => {
			this.input.focus();
			SystemEvents.trigger("hint", { hint: answer });
		};
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
		if (!s) {
			SystemEvents.trigger("no-more-input", {});
			return;
		}

		setTimeout(() => s && s.focus(), 200);
	}
}
