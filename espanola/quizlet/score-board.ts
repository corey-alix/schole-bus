export class ScoreBoard extends HTMLElement {
	static get observedAttributes() {
		return ["score"];
	}

	private updateScore() {
		this.innerHTML = this.getAttribute("score") || "0";
	}

	connectedCallback() {
		this.updateScore();
	}

	attributeChangedCallback() {
		this.updateScore();
	}
}
