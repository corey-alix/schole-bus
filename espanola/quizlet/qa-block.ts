import { WebComponent } from "./webcomponent";
import { SystemEvents } from "./system-events";
import { QaInput } from "./qa-input";
import { shuffle } from "./fun";
import { storage } from "./storage";
import { log } from "./console-log";

function score(question: string) {
	return storage.getScore({ question: question });
}
export class QaBlock extends WebComponent {
	constructor(domNode: HTMLElement) {
		super(domNode);
		this.load();
	}

	load() {
		let packet = this.getAttribute("packet");
		SystemEvents.watch("start", () => {
			require([`quizlet/packs/${packet}`], (data: Array<{ q: string; a: string }>) => {
				const shadowRoot = this.attachShadow({ mode: "open" });
				let div = shadowRoot; // could create a div if real shadow
				let qa = data.map(d => ({ a: d.a, q: d.q, score: score(d.q) }));
				let minScore = qa[0].score;
				qa.forEach(d => (minScore = Math.min(minScore, d.score)));
				qa = qa.filter(d => d.score <= minScore + 100);
				if (qa.length > 10) {
					qa = qa.slice(1, 10);
				}
				qa = shuffle(qa).slice(0, 5);
				let items = qa.map(item => {
					let qaItem = document.createElement("qa-input");
					qaItem.setAttribute("question", item.q);
					qaItem.setAttribute("answer", item.a);
					qaItem.setAttribute("score", item.score + "");
					let input = new QaInput(qaItem);
					div.appendChild(qaItem);
					input.connectedCallback();
					return input;
				});
				let input = items[0];
				input && input.focus();
			});
		});
	}
}
