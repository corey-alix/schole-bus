var keyboardEvent = document.createEvent("KeyboardEvent");
var initMethod = typeof keyboardEvent.initKeyboardEvent !== "undefined" ? "initKeyboardEvent" : "initKeyEvent";

keyboardEvent[initMethod](
	"keydown", // event type : keydown, keyup, keypress
	true, // bubbles
	true, // cancelable
	window, // viewArg: should be window
	false, // ctrlKeyArg
	false, // altKeyArg
	false, // shiftKeyArg
	false, // metaKeyArg
	40, // keyCodeArg : unsigned long the virtual key code, else 0
	0 // charCodeArgs : unsigned long the Unicode character associated with the depressed key, else 0
);
document.dispatchEvent(keyboardEvent);

/* a better way */

function fireKey(el, key) {
	if (document.createEventObject) {
		var eventObj = document.createEventObject();
		eventObj.keyCode = key;
		el.fireEvent("onkeydown", eventObj);
		eventObj.keyCode = key;
	} else if (document.createEvent) {
		var eventObj = document.createEvent("Events");
		eventObj.initEvent("keydown", true, true);
		eventObj.which = key;
		eventObj.keyCode = key;
		el.dispatchEvent(eventObj);
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
			}
			return false;
		}

		constructor() {
			super();

			const answer = this.getAttribute("answer");
			const label = document.createElement("label");
			label.textContent = this.getAttribute("question");
			label.title = this.getAttribute("hint") || this.getAttribute("answer");

			const input = (this.input = document.createElement("input"));
			input.type = "text";
			input.maxLength = answer.length;
			input.innerHTML = `<style>
			label {
				padding-right: 10px;
				display: inline-block;
				min-width: 240px;
			}
			input {
				background-color: black;
				border: none;
				color: gray;
				padding-left: 10px;
				min-width: 240px;
			}
			</style>`;
			input.onkeypress = ev => {
				//ev.preventDefault = true;
				let currentKey = ev.key;
				let currentValue = input.value;
				let expectedKey = answer[currentValue.length];
				console.log(currentKey, expectedKey);
				if (this.matches(currentKey, expectedKey)) {
					input.value = answer.substring(0, currentValue.length + 1);
					if (answer.length === currentValue.length + 1) {
						input.readOnly = true;
						let s = this.nextElementSibling;
						console.log(s);
						setTimeout(() => s && s.focus(), 200);
						return false;
					}
					console.log("+");
					return false;
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
