import { infinitives as haberInfinitive, builder as haberBuilder } from "../verbos/haber";
import { infinitives as poderInfinitive, builder as poderBuilder } from "../verbos/poder";
import { infinitives as quererInfinitive, builder as quererBuilder } from "../verbos/querer";
import { infinitives as tenerInfinitive, builder as tenerBuilder } from "../verbos/tener";
import sentences from "../sentences/index";

function build(infinitives: Array<{ es: string; en: string }>, builder: Array<{ es: string; en: string }>) {
	let qa: Array<{ q: string; a: string }> = [];
	infinitives.forEach(verb => {
		builder.forEach(b =>
			qa.push({
				a: b.es.replace("{verb}", verb.es),
				q: b.en.replace("{verb}", verb.en)
			})
		);
	});
	return qa;
}

let haberQa = build(haberInfinitive, haberBuilder);
let poderQa = build(poderInfinitive, poderBuilder);
let quererQa = build(quererInfinitive, quererBuilder);
let tenerQa = build(tenerInfinitive, tenerBuilder);

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
	llevar: "wear",
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
	rosado: "pink",
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

const QA = [
	{ a: "yo necesito", q: "I need" },
	{ a: "tú necesitas", q: "you need" },
	{ a: "me gusta", q: "I like" },
	{ a: "nosotros necesitamos", q: "we need" },
	{ a: "necesito {verb}", q: "I need to {verb}" },
	{ a: "necesito {noun}", q: "I need {noun}" },
	{ a: "necesito {verb} por favor", q: "I need to {verb} please" },
	{ a: "necesito {noun} por favor", q: "I need {noun} please" },
	{ a: "necesitas {verb}", q: "you need to {verb}" },
	{ a: "necesitas {noun}", q: "you need {noun}" },
	{ a: "necesitamos {noun}", q: "we need {noun}" },
	{ a: "necesitamos {verb}", q: "we need to {verb}" },
	{ a: "me gusta {verb}", q: "I like to {verb}" },
	{ a: "me gusta {noun}", q: "I like {noun}" },
	{ a: "te gusta {verb}", q: "you like to {verb}" },
	{ a: "te gusta {noun}", q: "you like {noun}" },
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
	{ a: "nosotros queremos {verb} en otro {noun} {color}", q: "we want to {verb} at {noun} that is {color}" },
	{ a: "ellos quieren {verb} {noun} {adjective}", q: "they want to {verb} {noun} {adjective}" },
	{ a: "es dos mas pequeño que cinco?", q: "is two smaller than five?" },
	{ a: "es {number} mas pequeño que {number}?", q: "is {number} smaller than {number}?" },
	{ a: "es {number} mas mayor que {number}?", q: "is {number} larger than {number}?" },
	{ a: "Que tengas una buena mañana", q: "have a good morning" },
	{ a: "¡Que tengas una buena semana!", q: "have a good week!" }
];

let qa = QA.concat(
	haberQa,
	poderQa,
	quererQa,
	tenerQa,
	sentences.filter(v => !!v.es && !!v.en).map(v => ({ a: v.es, q: v.en }))
);

let questions = shuffle(qa).map(item => {
	let q = item.q;
	let a = item.a;

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

	return { q: q, a: a };
});

function remove(v: string, chars: string) {
	let result = v;
	chars.split("").forEach(c => (result = result.replace(new RegExp(`\\${c}`, "g"), "")));
	result = result.replace(/  /g, " ");
	return result;
}

function spacesIn(v: string) {
	let result = 0;
	for (let i = 0; i < v.length; i++) if (v.charAt(i) === " ") result++;
	return result;
}

let scoreboard = JSON.parse(localStorage.getItem("scoreboard") || ({} as any));

function getScore(question: string) {
	let score = scoreboard[question] || 0;
	console.log(question, score);
	return score;
}

questions = questions
	//.sort((a, b) => (a.a < b.a ? -1 : 0))
	//.sort((a, b) => spacesIn(a.a) - spacesIn(b.a))
	.map(v => {
		let [q, a] = [remove(v.q, "!."), remove(v.a, "!.¿¡")];
		let swap = 0.1 > Math.random(); // show spanish 10% of the time
		return swap ? { q: a, a: q, hint: getScore(a) } : { q, a, hint: getScore(q) };
	})
	.filter(a => 100 > getScore(a.q))
	.sort((a, b) => -(getScore(a.q) - getScore(b.q)));

console.log(questions.map(q => `${q.q} = ${getScore(q.q)}`));

export = questions.slice(0, 5);
