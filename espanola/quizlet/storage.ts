import { Dictionary } from "./system-events";

class LocalStorage {
	public data: { scoreboard: Dictionary<number> };

	constructor() {
		this.data = this.upgrade();
	}

	private upgrade() {
		return {
			scoreboard: this.upgradeScoreboard()
		};
	}

	private upgradeScoreboard() {
		return JSON.parse(localStorage.getItem("scoreboard") || "{}");
	}

	private save() {
		localStorage.setItem("scoreboard", JSON.stringify(this.data.scoreboard));
	}

	public getScore(data: { question: string }) {
		return this.data.scoreboard[data.question] || 0;
	}

	public setScore(data: { question: string; score: number }) {
		this.data.scoreboard[data.question] = (this.data.scoreboard[data.question] || 0) + data.score;
		this.save();
	}
}

export let storage = new LocalStorage();
