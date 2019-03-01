import { Dictionary } from "../quizlet/system-events";

const tenses = [
	{
		ar: {
			yo: "o",
			tú: "as",
			él: "a",
			nosotros: "amos"
		},
		er: {
			yo: "o",
			tú: "es",
			él: "e",
			nosotros: "imos"
		},
		ir: {
			yo: "o",
			tú: "es",
			él: "e",
			nosotros: "imos"
		}
	},
	{
		ar: {
			yo: "aba",
			tú: "abas",
			él: "aba",
			nosotros: "ábamos"
		},
		er: {
			yo: "ía",
			tú: "ías",
			él: "ía",
			nosotros: "íamos"
		},
		ir: {
			yo: "ía",
			tú: "ías",
			él: "ía",
			nosotros: "íamos"
		}
	},
	{
		ar: {
			yo: "é",
			tú: "aste",
			él: "ó",
			nosotros: "amos"
		},
		er: {
			yo: "í",
			tú: "iste",
			él: "ió",
			nosotros: "imos"
		},
		ir: {
			yo: "í",
			tú: "iste",
			él: "ió",
			nosotros: "ímos"
		}
	},
	{
		ar: {
			yo: "aré",
			tú: "arás",
			él: "ara",
			nosotros: "aremos"
		},
		er: {
			yo: "eré",
			tú: "erás",
			él: "era",
			nosotros: "eremos"
		},
		ir: {
			yo: "iré",
			tú: "irás",
			él: "ira",
			nosotros: "iremos"
		}
	}
];

const tenses_en = [
	{
		yo: "I",
		tú: "you",
		él: "he",
		nosotros: "we"
	},
	{
		yo: "I used to",
		tú: "you used to",
		él: "he used to",
		nosotros: "we used to"
	},
	{
		yo: "I did",
		tú: "you did",
		él: "he did",
		nosotros: "we did"
	},
	{
		yo: "I will",
		tú: "you will",
		él: "he will",
		nosotros: "we will"
	}
];

function regular(
	infinitive: string,
	en_base: { infinitive?: string; i?: string; you?: string; he?: string; we?: string; ing?: string }
): Array<Dict> {
	if (!infinitive) throw "must provide a spanish infinitive";
	if (!en_base.infinitive) throw "must provide an english infinitive";
	let ch2 = <"ar" | "er" | "ir">infinitive.substring(infinitive.length - 2).toLowerCase();
	let base = infinitive.substring(0, infinitive.length - 2);

	en_base.i = en_base.i || en_base.infinitive;
	en_base.you = en_base.you || en_base.i;
	en_base.he = en_base.he || en_base.you + "s";
	en_base.we = en_base.we || en_base.you;
	en_base.ing = en_base.ing || en_base.infinitive + "ing";

	let postfix = tenses[0][ch2];
	let en = tenses_en[0];
	let result = [
		{
			i: { es: infinitive, en: `to ${en_base.infinitive}` },
			yo: { es: base + postfix.yo, en: `${en.yo} ${en_base.i}` },
			tú: { es: base + postfix.tú, en: `${en.tú} ${en_base.you}` },
			él: { es: base + postfix.él, en: `${en.él} ${en_base.he}` },
			nosotros: { es: base + postfix.nosotros, en: `${en.nosotros} ${en_base.we}` }
		}
	];

	for (let tense = 1; tense < tenses.length; tense++) {
		let postfix = tenses[tense][ch2];
		let en = tenses_en[tense];
		result.push({
			i: { es: infinitive, en: `to ${en_base.infinitive}` },
			yo: { es: base + postfix.yo, en: `${en.yo} ${en_base.infinitive}` },
			tú: { es: base + postfix.tú, en: `${en.tú} ${en_base.infinitive}` },
			él: { es: base + postfix.él, en: `${en.él} ${en_base.infinitive}` },
			nosotros: { es: base + postfix.nosotros, en: `${en.nosotros} ${en_base.infinitive}` }
		});
	}

	if (en_base.ing) {
		let ndo = base;
		switch (ch2) {
			case "ar":
				ndo += "ando";
				break;
			default:
				ndo += "iendo";
		}
		result.push({
			i: { es: infinitive, en: `to ${en_base.infinitive}` },
			yo: { es: `estoy ${ndo}`, en: `I am ${en_base.ing}` },
			tú: { es: `estas ${ndo}`, en: `You are ${en_base.ing}` },
			él: { es: `él está ${ndo}`, en: `He is ${en_base.ing}` },
			nosotros: { es: `estamos ${ndo}`, en: `We are ${en_base.we}` }
		});
	}

	return result;
}

// there are three types of verbs:
// those ending in er, ar and ir
type LanguageTuple = { en: string; es: string };
type Dict = Dictionary<LanguageTuple>;
let verbos = <Array<Dict>>[
	{
		i: { es: "ir", en: "to go" },
		yo: { es: "voy", en: "I go" },
		tú: { es: "vas", en: "you go" },
		él: { es: "va", en: "he goes" },
		nosotros: { es: "vemos", en: "we go" },
		he: { es: "ido", en: "I have gone" },
		has: { es: "ido", en: "you have gone" },
		hemos: { es: "ido", en: "we have gone" }
	},
	{
		i: { es: "ser", en: "to be" },
		yo: { es: "soy", en: "I am" },
		tú: { es: "eres", en: "you are" },
		él: { es: "es", en: "he is" },
		nosotros: { es: "somos", en: "we are" },
		he: { es: "sido", en: "I have been" },
		has: { es: "sido", en: "you have been" },
		hemos: { es: "sido", en: "we have been" }
	},
	{
		i: { es: "estar", en: "to be" },
		yo: { es: "estoy", en: "I am" },
		tú: { es: "estás", en: "you are" },
		él: { es: "está", en: "he is" },
		nosotros: { es: "estamos", en: "we are" },
		he: { es: "estado", en: "I have been" },
		has: { es: "estado", en: "you have been" },
		hemos: { es: "estado", en: "we have been" }
	},
	{
		i: { es: "tener", en: "to have" },
		yo: { es: "tengo", en: "I have" },
		tú: { es: "tienes", en: "you have" },
		él: { es: "tiene", en: "he has" },
		nosotros: { es: "tienemos", en: "we have" },
		he: { es: "tenido", en: "I have had" },
		has: { es: "tenido", en: "you have had" },
		hemos: { es: "tenido", en: "we had" }
	},
	{
		i: { es: "decir", en: "to say" },
		yo: { es: "digo", en: "I say" },
		tú: { es: "dices", en: "you say" },
		él: { es: "dice", en: "he says" },
		ella: { es: "dice", en: "she says" },
		nosotros: { es: "dicimos", en: "we say" },
		he: { es: "dicho", en: "I have said" },
		has: { es: "dicho", en: "you have said" },
		hemos: { es: "dicho", en: "we have said" }
	}
];

export = verbos.concat(
	regular("caminar", { infinitive: "walk" }),
	regular("correr", { infinitive: "run", ing: "running" }),
	regular("escribir", { infinitive: "write", ing: "writing" }),
	regular("esperar", { infinitive: "expect" }),
	regular("esparcir", { infinitive: "spread" }),
	regular("escuchar", { infinitive: "listen" }),
	regular("entregar", { infinitive: "deliver" }),
	regular("descubrir", { infinitive: "discover" }),
	regular("comer", { infinitive: "eat" })
);
