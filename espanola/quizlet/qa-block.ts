import data from "./qa";

export class QaBlock extends HTMLElement {
	constructor() {
		super();
		this.load();
	}

	load() {
		const shadowRoot = this.attachShadow({ mode: "open" });
		let div = document.createElement("div");
		data.forEach(item => {
			let qaItem = document.createElement("qa-input");
			qaItem.setAttribute("question", item.q);
			qaItem.setAttribute("answer", item.a);
			div.appendChild(qaItem);
		});
		shadowRoot.innerHTML = div.innerHTML;
	}
}
