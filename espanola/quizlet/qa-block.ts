import { WebComponent, getComponent } from "./webcomponent";
import data from "./qa";
import { SystemEvents } from "./system-events";
import { QaInput } from "./qa-input";

export class QaBlock extends WebComponent {
	constructor(domNode: HTMLElement) {
		super(domNode);
		this.load();
	}

	load() {
		const shadowRoot = this.attachShadow({ mode: "open" });
		let div = shadowRoot; // could create a div if real shadow
		let items = data.map(item => {
			let qaItem = document.createElement("qa-input");
			qaItem.setAttribute("question", item.q);
			qaItem.setAttribute("answer", item.a);
			qaItem.setAttribute("hint", (<any>item).hint || "");
			div.appendChild(qaItem);
			return qaItem;
		});
		SystemEvents.watch("start", () => {
			let input = getComponent(items[0]) as QaInput;
			input && input.focus();
		});
	}
}
