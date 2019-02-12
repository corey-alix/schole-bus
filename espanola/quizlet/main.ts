import { ScoreBoard } from "./score-board";
import { QaInput } from "./qa-input";
import { QaBlock } from "./qa-block";

{
	let mods: any = {
		"qa-input": QaInput,
		"qa-block": QaBlock,
		"score-board": ScoreBoard
	};

	Object.keys(mods).forEach(key => customElements.define(key, mods[key]));
}
