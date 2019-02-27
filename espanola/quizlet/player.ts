const avitars = {
	default: {
		rate: 1,
		pitch: 1
	},
	rita: {
		rate: 0.9,
		pitch: 0.8
	},
	clara: {
		rate: 1.1,
		pitch: 1.1
	}
};

class Player {
	private audio = new Audio();
	private synth = new SpeechSynthesisUtterance();
	private rate: number;
	private pitch: number;

	constructor() {
		this.rate = 0.9 + Math.random() * 0.4;
		this.pitch = 0 + Math.random() * 1.5;
		///log(this.synth.voice.name);
	}
	stop(): any {
		window.speechSynthesis.cancel();
	}

	play(text: { en?: string; es?: string; avitar?: "rita" | "clara" }) {
		this.synth.volume = 1;
		if (text.avitar) {
			let avitar = avitars[text.avitar] || avitars.default;
			this.synth.rate = avitar.rate;
			this.synth.pitch = avitar.pitch;
		} else {
			this.synth.rate = this.rate;
			this.synth.pitch = this.pitch;
		}
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
