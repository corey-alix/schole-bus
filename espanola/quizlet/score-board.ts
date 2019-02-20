import { WebComponent } from "./webcomponent";

export class ScoreBoard extends WebComponent {
	private updateScore() {
		this.domNode.innerHTML = this.getAttribute("score") || "0";
	}

	connectedCallback() {
		this.updateScore();
	}

	attributeChangedCallback() {
		this.updateScore();
	}
}
