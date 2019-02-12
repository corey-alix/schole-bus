type WordMapHash = { [key: string]: string };
type WordMap = { en: string; es: string };

const verbs = {
	llamar: "call",
	confiar: "trust",
	esperar: "wait",
	amar: "love",
	quedar: "stay",
	comer: "eat",
	visitar: "visit",
	escuchar: "hear",
	caminar: "walk",
	limpiar: "clean",
	pagar: "pay",
	permanecer: "stay",
	"llevar {noun}": "wear {noun}",
	entrar: "enter",
	"nadar {adjective}": "swim {adjective}",
	"correr {adjective}": "run {adjective}"
};

const places = {
	"a casa": "home"
};

const colors = {
	anaranjado: "orange",
	azul: "blue",
	rojo: "red",
	verde: "green",
	negro: "black",
	marrón: "brown",
	rosado: "pint",
	amarillo: "yellow"
};

const nouns = {
	"una casa": "a house",
	"esa casa": "that house",
	"otra casa": "another house",
	"una bicicleta": "a bike",
	"una caminata": "a hike",
	"un libro": "a book",
	"una persona": "a person"
};

const adjectives = {
	rápido: "fast",
	"más rápido": "faster",
	"lo más rápido": "fastest"
};

const numbers = {
	dos: "two",
	tres: "three",
	quatro: "four",
	cinco: "five",
	seis: "six",
	siete: "seven",
	ocho: "eight",
	nuevo: "nine",
	diez: "ten",
	once: "eleven",
	doce: "twelve"
};

function startsWith(str: string, val: string) {
	return str.indexOf(val) === 0;
}

function endsWith(str: string, val: string) {
	return str.lastIndexOf(val) === str.length - val.length;
}

/*
If the singular definite article is "el" the plural is "los."
The plural of either "tú" or "usted" in Latin America is "ustedes"
and will take the same verb endings as "él/la and ellos/ellas respectively.
The plural (ellos/ellas) ending of verbs is "an" for "ar" verbs and "en" for "er/ir verbs.

If a noun ends in a vowel, simply add -s.
If a noun ends in a consonant, simply add -es.
If a noun ends in a -z, change the z to c before adding -es.
If a noun ends in ión, drop the written accent before adding -es.
If the plural refers to a mixed group, use the masculine.
 */
function pluralizeNoun(noun: WordMap) {
	let num = randomNumber();
	let es = noun.es;
	let en = noun.en;

	if (endsWith(es, "a")) es += "s";
	else if (endsWith(es, "e")) es += "s";
	else if (endsWith(es, "i")) es += "s";
	else if (endsWith(es, "o")) es += "s";
	else if (endsWith(es, "u")) es += "s";
	else if (endsWith(es, "z")) es = es.substring(0, es.length - 1) + "ces";
	else es += "es";

	if (startsWith(es, "el ")) {
		es = "los" + es.substring(2);
		en += " (plural)";
	} else if (startsWith(es, "tú ")) {
		es = "ustedes" + es.substring(2);
		en += " (plural)";
	} else if (startsWith(es, "esa ")) {
		es = "esas" + es.substring(3);
		en += " (plural)";
	} else if (startsWith(es, "usted ")) {
		es = "ustedes" + es.substring(5);
		en += " (plural)";
	} else if (startsWith(es, "un ")) {
		es = num.es + es.substring(2);
		en = `${noun.en} (${num.en} of them)`;
	} else if (startsWith(es, "una ")) {
		es = num.es + es.substring(3);
		en = `${noun.en} (${num.en} of them)`;
	} else {
		en += " (plural)";
	}

	return {
		es: es,
		en: en
	};
}
function randomItem(list: WordMapHash) {
	let keys = Object.keys(list);
	let index = Math.round(Math.random() * (keys.length - 1));
	let es = keys[index];
	return { es: es, en: list[es] || es };
}

function randomVerb() {
	return randomItem(verbs);
}

function randomPlace() {
	return randomItem(places);
}

function randomNoun() {
	return randomItem(nouns);
}

function randomNumber() {
	return randomItem(numbers);
}

function randomColor() {
	return randomItem(colors);
}

function randomAdjective() {
	return randomItem(adjectives);
}

function shuffle<T>(array: Array<T>) {
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

const qa = [
	{ a: "yo necesito", q: "I need" },
	{ a: "yo necesito {verb}", q: "I need to {verb}" },
	{ a: "yo necesito {noun}", q: "I need {noun}" },
	{ a: "yo necesito {plural-noun}", q: "I need {plural-noun}" },
	{ a: "yo necesito {verb} por favor", q: "I need to {verb} please" },
	{ a: "yo necesito {noun} por favor", q: "I need {noun} please" },
	{ a: "tú necesitas {verb}", q: "you need to {verb}" },
	{ a: "tú necesitas {noun}", q: "you need {noun}" },
	{ a: "nosotros necesitamos {noun}", q: "we need {noun}" },
	{ a: "nosotros necesitamos {verb}", q: "we need to {verb}" },
	{ a: "me gusta {verb}", q: "I like to {verb}" },
	{ a: "me gusta {noun}", q: "I like {noun}" },
	{ a: "te gusta {verb}", q: "you like to {verb}" },
	{ a: "te gusta {noun}", q: "you like {noun}" },
	{ a: "me gustan {plural-noun}", q: "I like {plural-noun}" },
	{ a: "me gustaría {verb}", q: "I would like to {verb}" },
	{ a: "me gusta {noun}", q: "I would like {noun}" },
	{ a: "me gustaría {verb} y {noun} {verb}", q: "I would like to {verb} and {noun} to {verb}" },
	{ a: "me encanta {noun}", q: "I love {noun}" },
	{ a: "me encantaría {noun}", q: "I would love {noun}" },
	{ a: "voy a {verb}", q: "I will {verb}" },
	{ a: "quiero {verb}", q: "I want to {verb}" },
	{ a: "quiero {noun}", q: "I want {noun}" },
	{ a: "quiero {noun} o {noun}", q: "I want {noun} or {noun}" },
	{ a: "me llamo es", q: "my name is" },
	{ a: "me voy {place}", q: "I am going {place}" },
	{ a: "I want to stay", q: "Quiero quedarme" },
	{ a: "nosotros queremos {verb} {noun} {color}", q: "we want to {verb} {noun} {color}" },
	{ a: "nosotros queremos {verb} {noun} {color}", q: "we want to {verb} {noun} {color}" },
	{ a: "nosotros queremos {verb} {noun} {color}", q: "we want to {verb} {noun} {color}" },
	{ a: "ellos quieren {verb} {noun} {color}", q: "they want to {verb} {noun} {color}" }
];

let questions = shuffle(qa).map(item => {
	let q = item.q;
	let a = item.a;
	let swap = 0.5 > Math.random();

	while (true) {
		let verb = randomVerb();
		let noun = randomNoun();
		let place = randomPlace();
		let num = randomNumber();
		let pluralNoun = pluralizeNoun(randomNoun());
		let adjective = randomAdjective();
		let color = randomColor();

		let q2 = q
			.replace("{verb}", verb.en)
			.replace("{plural-noun}", pluralNoun.en)
			.replace("{noun}", noun.en)
			.replace("{place}", place.en)
			.replace("{color}", color.en)
			.replace("{adjective}", adjective.en)
			.replace("{number}", num.en);

		let a2 = a
			.replace("{verb}", verb.es)
			.replace("{plural-noun}", pluralNoun.es)
			.replace("{noun}", noun.es)
			.replace("{place}", place.es)
			.replace("{color}", color.es)
			.replace("{adjective}", adjective.es)
			.replace("{number}", num.es);

		if (q2 == q) break;
		q = q2;
		a = a2;
	}

	return swap ? { q: a, a: q } : { q: q, a: a };
});

export = questions.slice(0, 10);
