console.assert(!isMale("carnitas"));

export function startsWith(str: string, val: string) {
	return str.indexOf(val) === 0;
}

export function endsWith(str: string, val: string) {
	return str.lastIndexOf(val) === str.length - val.length;
}

export function combine(a: Array<Array<{ en: string; es: string }>>): Array<{ en: string; es: string }> {
	if (1 === a.length) return a[0];
	let head = a[0];
	let tail = a[1];
	let result = [] as typeof tail;
	head.forEach(h => tail.forEach(t => result.push({ es: `${h.es} ${t.es}`, en: `${h.en} ${t.en}` })));
	a.splice(0, 2, result);
	return combine(a);
}

export function isPlural(noun: string) {
	return noun.charAt(noun.length - 1) === "s";
}

export function isMale(noun: string): boolean {
	if (0 === noun.indexOf("el ")) return true;
	if (0 === noun.indexOf("la ")) return false;
	let head = noun.split(" ")[0];
	let last = head.charAt(noun.length - 1);
	switch (last) {
		case "a":
			return head.charAt(head.length - 2) === "m";
		case "á":
		case "é":
		case "í":
		case "ó":
		case "ú":
		case "o":
			return true;
		case "s":
			return isMale(head.substring(0, head.length - 1));
		case "d":
		case "z":
			return false;
	}
	return true;
}

export function forceGender(noun: string) {
	if (0 === noun.indexOf("el ")) return noun;
	if (0 === noun.indexOf("la ")) return noun;
	if (0 === noun.indexOf("las ")) return noun;
	if (0 === noun.indexOf("los ")) return noun;
	let head = noun.split(" ")[0];
	if (isMale(head)) {
		if (isPlural(head)) {
			noun = "los " + noun;
		} else {
			noun = "el " + noun;
		}
	} else {
		if (isPlural(head)) {
			noun = "las " + noun;
		} else {
			noun = "la " + noun;
		}
	}
	return noun;
}

export function shuffle<T>(array: Array<T>) {
	let currentIndex = array.length;
	while (0 !== currentIndex) {
		let randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		let temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}
