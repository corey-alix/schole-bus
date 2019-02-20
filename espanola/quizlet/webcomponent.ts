let nextkey = 0;
const registry: Array<WebComponent> = [];

export class WebComponent {
	constructor(public domNode: HTMLElement) {
		domNode.setAttribute("registry-key", nextkey + "");
		registry[nextkey++] = this;
	}

	connectedCallback() {
		// added to dom
	}
	public attachShadow(options: { mode: "open" }) {
		return this.domNode;
	}

	public nextElementSibling(): WebComponent | null {
		let next = this.domNode.nextElementSibling as HTMLElement;
		if (!next) return null;
		let key = next.getAttribute("registry-key");
		if (!key) return null;
		return registry[parseInt(key)];
	}

	public getAttribute(name: string): string | null {
		return this.domNode.getAttribute(name);
	}

	public setAttribute(name: string, value: string) {
		this.domNode.setAttribute(name, value);
		this.attributeChangedCallback();
	}

	public attributeChangedCallback() {}
}

export function getComponent(domNode: HTMLElement) {
	let key = domNode.getAttribute("registry-key");
	if (!key) return null;
	return registry[parseInt(key)];
}
