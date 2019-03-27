import { ScoreBoard } from "./score-board";
import { QaInput } from "./qa-input";
import { QaBlock } from "./qa-block";
import { WebComponent, getComponent } from "./webcomponent";
import { SystemEvents } from "./system-events";
import { ConsoleLog } from "./console-log";
import { storage } from "./storage";
import { player } from "./player";
import { listener } from "./listener";

function from(nodes: HTMLCollection) {
	let result: Array<HTMLElement> = [];
	for (let i = 0; i < nodes.length; i++) {
		result[i] = nodes.item(i) as HTMLElement;
	}
	return result;
}

function visit(node: HTMLElement, cb: (node: HTMLElement) => boolean) {
	if (!cb(node)) return;
	from(node.children).forEach(n => visit(n, cb));
}

function showHint(hint: string) {
	from(document.getElementsByTagName("hint-slider")).forEach(n => {
		n.innerHTML = hint;
		n.classList.add("visible");
		n.classList.remove("hidden");
	});
}

{
	let mods: any = {
		"console-log": ConsoleLog,
		"qa-input": QaInput,
		"qa-block": QaBlock,
		"score-board": ScoreBoard
	};

	visit(document.body, node => {
		let className = node.tagName.toLowerCase();
		if (mods[className]) {
			let C = mods[className] as typeof WebComponent;
			let c = new C(node);
			c.connectedCallback();
		}
		return true;
	});

	// fade the screen before beginning
	setTimeout(() => SystemEvents.trigger("start", {}), 200);
}

let correct = 0;
let incorrect = 0;

function score(add: number) {
	if (0 > add) incorrect -= add;
	else correct += add;
	let elements = from(document.getElementsByTagName("score-board"));
	elements.forEach(e => {
		let score = getComponent(e);
		score && score.setAttribute("score", Math.round(100 * (correct / (correct + incorrect))) + "");
	});
}

SystemEvents.watch("correct", () => score(1));
SystemEvents.watch("incorrect", () => score(-1));
SystemEvents.watch("hint", (result: { hint: string }) => {
	showHint(result.hint);
});

SystemEvents.watch("no-more-input", () => {
	document.body.classList.add("hidden");
	setTimeout(() => location.reload(), 2000);
});

SystemEvents.watch("xp", (result: { question: string; score: number }) => {
	storage.setScore(result);
});

SystemEvents.watch("play", (data: { action?: string; es?: string; en?: string; avitar: "rita" | "clara" }) => {
	if (data.action === "stop") {
		player.stop();
		return;
	}
	player.play(data);
});

SystemEvents.watch("listen", () => {
	listener.listen();
});

SystemEvents.watch("speech-detected", (result: { result: string }) => {
	showHint(result.result);
});

//SystemEvents.watch("hint", (data: { hint: string }) => player.play({ en: data.hint }));
