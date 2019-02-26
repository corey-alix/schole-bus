import { log } from "./console-log";

class Player {
	private audio = new Audio();
	private synth = new SpeechSynthesisUtterance();

	constructor() {
		this.synth.rate = 1.1 + Math.random() * 0.1;
		this.synth.pitch = 0.6 + Math.random() * 0.1;
		///log(this.synth.voice.name);
	}
	stop(): any {
		window.speechSynthesis.cancel();
	}

	play(text: { en?: string; es?: string }) {
		this.synth.volume = 1;
		if (text.en) {
			this.synth.lang = "en-US";
			this.synth.text = text.en;
			window.speechSynthesis.speak(this.synth);
		} else if (text.es) {
			this.synth.lang = "es-US";
			this.synth.text = text.es;
			window.speechSynthesis.speak(this.synth);
		}
	}
}

export let player = new Player();
