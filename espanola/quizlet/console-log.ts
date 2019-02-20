import { WebComponent } from "./webcomponent";
import { SystemEvents } from "./system-events";

export class ConsoleLog extends WebComponent {
	constructor(domNode: HTMLElement) {
		super(domNode);
		SystemEvents.watch("log", (value: { message: string }) => {
			let logItem = document.createElement("div");
			logItem.innerHTML = value.message;
			domNode.insertBefore(logItem, domNode.firstChild);
		});
	}
}

export function log(message: string) {
	SystemEvents.trigger("log", { message });
}
