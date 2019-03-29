import { Dictionary } from "./system-events";

class LocalStorage {
	public data: { scoreboard: Dictionary<{ score: number; power: number }> };

	constructor() {
		this.data = this.upgrade();
	}

	private upgrade() {
		return {
			scoreboard: this.upgradeScoreboard()
		};
	}

	private upgradeScoreboard() {
		let result = JSON.parse(localStorage.getItem("scoreboard") || "{}");
		Object.keys(result).forEach(k => {
			if (typeof result[k] === "number") {
				let score = result[k];
				result[k] = { score: score, power: 0 };
			}
		})
		return result;
	}

	private save() {
		localStorage.setItem("scoreboard", JSON.stringify(this.data.scoreboard));
	}

	public getScore(data: { question: string }) {
		return (this.data.scoreboard[data.question] || { score: 0 }).score;
	}

	public setScore(data: {
		question: string;
		score: number;
		power?: number;
	}) {
		this.data.scoreboard[data.question] = {
			score: this.getScore(data) + data.score,
			power: data.power || 0
		};
		this.save();
	}
}

export let storage = new LocalStorage();
