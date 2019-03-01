export function combine(a: Array<Array<{ en: string; es: string }>>): Array<{ en: string; es: string }> {
	if (1 === a.length) return a[0];
	let head = a[0];
	let tail = a[1];
	let result = [] as typeof tail;
	head.forEach(h => tail.forEach(t => result.push({ es: `${h.es} ${t.es}`, en: `${h.en} ${t.en}` })));
	a.splice(0, 2, result);
	return combine(a);
}

export function isMale(noun: string) {
	if (0 === noun.indexOf("el ")) return true;
	if (0 === noun.indexOf("la ")) return false;
	let last = noun.charAt(noun.length - 1);
	switch (last) {
		case "á":
		case "é":
		case "í":
		case "ó":
		case "ú":
		case "o":
			return true;
		case "a":
			return noun.charAt(noun.length - 2) === "m";
		case "d":
		case "z":
			return false;
	}
	return true;
}

export function forceGender(noun: string) {
	if (0 === noun.indexOf("el ")) return noun;
	if (0 === noun.indexOf("la ")) return noun;
	return (isMale(noun) ? "el " : "la ") + noun;
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
