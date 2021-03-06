import { log } from "./console-log";
import { SystemEvents } from "./system-events";

function asPercent(value: number) {
	return `${Math.round(value * 100)}%`;
}
class Listener {
	recognition: SpeechRecognition;
	stopped: boolean = true;
	autostart: boolean = true;

	constructor() {
		this.recognition = new (<any>window)["webkitSpeechRecognition"]();
		let recognition = this.recognition;
		recognition.interimResults = false;
		recognition.continuous = false;
		recognition.lang = "es";
		recognition.maxAlternatives = 5;

		recognition.addEventListener("start", e => {
			this.stopped = false;
		});

		recognition.addEventListener("end", e => {
			this.stopped = false;
			if (this.autostart) recognition.start();
		});

		recognition.addEventListener("result", e => {
			for (let i = 0; i < e.results.length; i++) {
				let result = e.results[i];
				if (result.isFinal) {
					for (let j = 0; j < result.length; j++) {
						let transcript = result[j].transcript;
						console.log(transcript, result[j]);
						let confidence = result[j].confidence;
						log(`${transcript} (${asPercent(confidence)})`);
						SystemEvents.trigger("speech-detected", {
							result: transcript,
							power: confidence * 100
						});
						return;
					}
				}
			}
		});
	}

	listen() {
		if (this.stopped) this.recognition.start();
	}
}

export let listener = new Listener();
