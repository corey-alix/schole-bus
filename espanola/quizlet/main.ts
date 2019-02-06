import { ScoreBoard } from "./score-board";
import { QaInput } from "./qa-input";
import { QaBlock } from "./qa-block";
import { SohoTimeline } from "./soho-timeline";
import { SohoWizard } from "./soho-wizard";

customElements.define("qa-input", QaInput);
customElements.define("qa-block", QaBlock);
customElements.define("score-board", ScoreBoard);
customElements.define("soho-timeline", SohoTimeline);

let mods: any = {
	"soho-wizard": SohoWizard
};

Object.keys(mods).forEach(key => customElements.define(key, mods[key]));
