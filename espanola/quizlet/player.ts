class Player {
	private audio = new Audio();
	private synth = new SpeechSynthesisUtterance();
	play(text: { en?: string; es?: string }) {
		if (text.en) {
			this.synth.lang = "en-US";
			this.synth.text = text.en;
			window.speechSynthesis.speak(this.synth);
		} else if (text.es) {
			debugger;
			this.synth.lang = "es-MX";
			this.synth.text = text.es;
			window.speechSynthesis.speak(this.synth);
		}
	}
}

export let player = new Player();
