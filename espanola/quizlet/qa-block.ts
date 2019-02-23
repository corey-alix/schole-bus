import { WebComponent } from "./webcomponent";
import data from "./qa";

export class QaBlock extends WebComponent {
	constructor(domNode: HTMLElement) {
		super(domNode);
		this.load();
	}

	load() {
		const shadowRoot = this.attachShadow({ mode: "open" });
		let div = document.createElement("div");
		data.forEach(item => {
			let qaItem = document.createElement("qa-input");
			qaItem.setAttribute("question", item.q);
			qaItem.setAttribute("answer", item.a);
			qaItem.setAttribute("hint", (<any>item).hint || "");
			div.appendChild(qaItem);
		});
		shadowRoot.innerHTML = div.innerHTML;
	}
}
