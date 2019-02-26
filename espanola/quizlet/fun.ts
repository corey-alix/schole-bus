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
