class Mapping {
	mapping = <any>{
		"8": 66,
		"9": 84,
		"13": 69,
		"32": 32,
		"48": 48,
		"49": 49,
		"50": 50,
		"51": 51,
		"52": 52,
		"53": 53,
		"54": 54,
		"55": 55,
		"56": 56,
		"57": 57,
		"65": 97,
		"66": 98,
		"67": 99,
		"68": 100,
		"69": 101,
		"70": 102,
		"71": 103,
		"72": 104,
		"73": 105,
		"74": 106,
		"75": 107,
		"76": 108,
		"77": 109,
		"78": 110,
		"79": 111,
		"80": 112,
		"81": 113,
		"82": 114,
		"83": 115,
		"84": 116,
		"85": 117,
		"86": 118,
		"87": 119,
		"88": 120,
		"89": 121,
		"90": 122,
		"97": 49,
		"98": 50,
		"99": 51,
		"100": 52,
		"101": 53,
		"102": 54,
		"103": 55,
		"104": 56,
		"105": 57,
		"106": 42,
		"107": 43,
		"109": 45,
		"111": 47,
		"112": 70,
		"186": 59,
		"187": 61,
		"188": 44,
		"189": 45,
		"190": 46,
		"191": 47,
		"219": 91,
		"220": 92,
		"221": 93,
		"222": 39
	};

	shift_mapping = <any>{
		"16": 83,
		"32": 32,
		"47": 63, // safari on iphone ?->/
		"48": 41,
		"49": 33,
		"50": 64,
		"51": 35,
		"52": 36,
		"53": 37,
		"54": 94,
		"55": 38,
		"56": 42,
		"57": 40,
		"65": 65,
		"66": 66,
		"67": 67,
		"68": 68,
		"69": 69,
		"70": 70,
		"71": 71,
		"72": 72,
		"73": 73,
		"74": 74,
		"75": 75,
		"76": 76,
		"77": 77,
		"78": 78,
		"79": 79,
		"80": 80,
		"81": 81,
		"82": 82,
		"83": 83,
		"84": 84,
		"85": 85,
		"86": 86,
		"87": 87,
		"88": 88,
		"89": 89,
		"90": 90,
		"186": 58,
		"187": 43,
		"188": 60,
		"189": 95,
		"190": 62,
		"191": 63,
		"219": 123,
		"220": 124,
		"221": 125,
		"222": 34
	};

	get(ev: KeyboardEvent): string {
		let key = ev.shiftKey ? this.shift_mapping[ev.keyCode] : this.mapping[ev.keyCode];
		return String.fromCharCode(key);
	}

	record(e: KeyboardEvent) {
		let target = e.key.charCodeAt(0);
		if (e.shiftKey) {
			this.shift_mapping[e.keyCode] = target;
		} else {
			this.mapping[e.keyCode] = target;
		}
	}

	play() {
		console.log(JSON.stringify({ mapping: this.mapping, shift_mapping: this.shift_mapping }, null, "\t"));
	}
}

export let mapping = new Mapping();
