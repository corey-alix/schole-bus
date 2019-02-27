import { Dictionary } from "../quizlet/system-events";

const regular_postfix = {
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
};

function regular(
	infinitive: string,
	en_base: { infinitive: string; i?: string; you?: string; he?: string; we?: string }
) {
	let ch2 = <"ar" | "er" | "ir">infinitive.substring(infinitive.length - 2).toLowerCase();
	let base = infinitive.substring(0, infinitive.length - 2);
	let postfix = regular_postfix[ch2];

	en_base.i = en_base.i || en_base.infinitive;
	en_base.you = en_base.you || en_base.i;
	en_base.he = en_base.he || en_base.you + "s";
	en_base.we = en_base.we || en_base.you;

	return {
		i: { es: infinitive, en: "to " + en_base.infinitive },
		yo: { es: base + postfix.yo, en: "I " + en_base.i },
		tú: { es: base + postfix.tú, en: "you " + en_base.you },
		él: { es: base + postfix.él, en: "he " + en_base.he },
		nosotros: { es: base + postfix.nosotros, en: "we " + en_base.we }
	};
}

// there are three types of verbs:
// those ending in er, ar and ir
type LanguageTuple = { en: string; es: string };
type Dict = Dictionary<LanguageTuple>;
export = <Array<Dict>>[
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
	},
	regular("caminar", { infinitive: "walk" }),
	regular("correr", { infinitive: "run" }),
	regular("escribir", { infinitive: "write" }),
	regular("esperar", { infinitive: "expect" }),
	regular("esparcir", { infinitive: "spread" }),
	regular("escuchar", { infinitive: "listen" }),
	regular("entregar", { infinitive: "deliver" }),
	regular("descubrir", { infinitive: "discover" })
];
