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
export = [
	{
		i: { es: "caminar", en: "to walk" },
		yo: { es: "camino", en: "I walk" },
		tú: { es: "caminas", en: "you walk" },
		él: { es: "camina", en: "he walks" },
		ella: { es: "camina", en: "she walks" },
		nosotros: { es: "caminamos", en: "we walk" }
	},
	{
		i: { es: "correr", en: "to run" },
		yo: { es: "corro", en: "I run" },
		tú: { es: "corres", en: "you run" },
		él: { es: "corre", en: "he runs" },
		ella: { es: "corre", en: "she runs" },
		nosotros: { es: "corremos", en: "we run" }
	},
	{
		i: { es: "dicir", en: "to say" },
		yo: { es: "digo", en: "I say" },
		tú: { es: "dices", en: "you say" },
		él: { es: "dice", en: "he says" },
		ella: { es: "dice", en: "she says" },
		nosotros: { es: "dicimos", en: "we say" }
	},
	regular("escribir", { infinitive: "write" }),
	regular("esperar", { infinitive: "expect" }),
	regular("esparcir", { infinitive: "spread" }),
	regular("escuchar", { infinitive: "listen" }),
	regular("entregar", { infinitive: "deliver" }),
	regular("descubrir", { infinitive: "discover" })
];
