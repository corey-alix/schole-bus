let score = 100;
function wrongAnswer() {
	score--;
	let elements = document.getElementsByTagName("score-board");
	for (let i = 0; i < elements.length; i++) {
		console.log("updating score to ", score);
		elements[i].setAttribute("score", score);
	}
}

customElements.define(
	"qa-input",
	class extends HTMLElement {
		focus() {
			this.input.focus();
		}

		matches(a, b) {
			if (a.toUpperCase() === b.toUpperCase()) return true;
			switch (b) {
				case "á":
					if (a.toUpperCase() == "A") return true;
				case "é":
					if (a.toUpperCase() == "E") return true;
				case "í":
					if (a.toUpperCase() == "I") return true;
				case "ñ":
					if (a.toUpperCase() == "N") return true;
				case "ú":
					if (a.toUpperCase() == "U") return true;
			}
			return false;
		}

		constructor() {
			super();
		}

		connectedCallback() {
			const answer = this.getAttribute("answer");
			const label = document.createElement("label");
			label.textContent = this.getAttribute("question");
			label.title = this.getAttribute("hint") || this.getAttribute("answer");

			const input = (this.input = document.createElement("input"));
			input.type = "text";
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
				if (this.matches(currentKey, expectedKey)) {
					input.classList.remove("wrong");
					input.value = answer.substring(0, currentValue.length + 1);
					if (answer.length === currentValue.length + 1) {
						input.classList.add("correct");
						input.readOnly = true;
						let s = this.nextElementSibling;
						console.log(s);
						setTimeout(() => s && s.focus(), 200);
						return false;
					}
					console.log("+");
					return false;
				} else {
					input.classList.add("wrong");
					wrongAnswer();
				}
				console.log("-");
				return false;
			};

			const shadowRoot = this.attachShadow({ mode: "open" });
			shadowRoot.appendChild(label);
			shadowRoot.appendChild(input);
		}
	}
);

class QaBlock extends HTMLElement {
	constructor() {
		super();
		this.src = this.getAttribute("src");
		this.load();
	}

	load() {
		const shadowRoot = this.attachShadow({ mode: "open" });
		if (this.src) {
			require([this.src], data => {
				let div = document.createElement("div");
				data.forEach(item => {
					let qaItem = document.createElement("qa-input", {
						question: item.q,
						answer: item.a
					});
					qaItem.setAttribute("question", item.q);
					qaItem.setAttribute("answer", item.a);
					div.appendChild(qaItem);
				});
				shadowRoot.innerHTML = div.innerHTML;
			});
		}
	}
}

customElements.define("qa-block", QaBlock);

class ScoreBoard extends HTMLElement {
	static get observedAttributes() {
		return ["score"];
	}

	connectedCallback() {
		this.innerHTML = this.getAttribute("score");
	}

	attributeChangedCallback(name, oldValue, newValue) {
		console.log("update score");
		this.innerHTML = this.getAttribute("score");
	}
}

customElements.define("score-board", ScoreBoard);
