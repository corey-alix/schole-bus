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

const nouns = {
	"una casa": "a house",
	"esa casa": "that house",
	"otra casa": "another house",
	"una bicicleta": "a bike",
	"una caminata": "a hike",
	"un libro": "a book",
	"{number} personas": "{number} people"
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

function startsWith(str, val) {
    return str.indexOf(val) === 0;
}

function endsWith(str, val) {
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
function pluralizeNoun(noun) {
    let num = randomNumber();
    let es = noun.es;
    let en = noun.en;

    if (endsWith(es, "a")) es += "s";
    else if (endsWith(es, "e")) es += "s";
    else if (endsWith(es, "i")) es += "s";
    else if (endsWith(es, "o")) es += "s";
    else if (endsWith(es, "u")) es += "s";
    else if (endsWith(es, "z")) es.substring(0, es.length - 1) += "ces";
    else es += "es";
    
    if (startsWith(es, "el ")) es = "los" + es.substring(2);
    else if (startsWith(es, "tú ")) es = "ustedes" + es.substring(2);
    else if (startsWith(es, "esa ")) es = "esas" + es.substring(3);
    else if (startsWith(es, "usted ")) es = "ustedes" + es.substring(5);
    else if (startsWith(es, "un ")) {
        es = num.es + es.substring(2);
        en = `${noun.en} (${num.en} of them)`;
    }
    else if (startsWith(es, "una ")) {
        es = num.es + es.substring(3);
        en = `${noun.en} (${num.en} of them)`;
    }
    
	return {
		es: es,
		en: en
	};
}
function randomItem(list) {
	let keys = Object.keys(list);
	let index = Math.round(Math.random() * (keys.length - 1));
	let es = keys[index];
	return { es: es, en: list[es] || es };
}

function randomVerb() {
	return randomItem(verbs);
}

function randomNoun() {
	return randomItem(nouns);
}

function randomNumber() {
	return randomItem(numbers);
}

function randomAdjective() {
	return randomItem(adjectives);
}

function shuffle(array) {
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
	{ a: "que ero {verb}", q: "I want to {verb}" },
	{ a: "que ero {noun}", q: "I want to {noun}" },
	{ a: "me llamo es", q: "my name is" }
];

let questions = shuffle(qa).map(item => {
	let verb = randomVerb();
	let verb2 = randomVerb();
	let noun = randomNoun();
	let noun2 = randomNoun();
	let num = randomNumber();
	let pluralNoun = pluralizeNoun(noun);
	let adjective = randomAdjective();

	console.log(verb, noun, adjective, num);
	let result = {
		q: item.q
		.replace("{verb}", verb.en)
		.replace("{verb}", verb2.en)
		.replace("{plural-noun}", pluralNoun.en)
		.replace("{noun}", noun.en)
		.replace("{noun}", noun2.en)
			.replace("{adjective}", adjective.en)
			.replace("{number}", num.en),
		a: item.a
		.replace("{verb}", verb.es)
		.replace("{verb}", verb2.es)
		.replace("{plural-noun}", pluralNoun.es)
		.replace("{noun}", noun.es)
		.replace("{noun}", noun2.es)
		.replace("{adjective}", adjective.es)
			.replace("{number}", num.es)
	};
	console.log(item, result);
	return result;
});

define(() => questions.slice(0, 10));
