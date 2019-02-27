import yo from "./yo-packet";
import tú from "./tú-packet";
import él from "./él-packet";
import nosotros from "./nosotros-packet";
import he from "./he-packet";

type WordPack = { en: string; es: string };

const pronouns: Array<WordPack> = [
	{ en: "I", es: "yo" },
	{ en: "you", es: "tú" },
	{ en: "he", es: "él" },
	{ en: "she", es: "ella" },
	{ en: "it", es: "ello" },
	{ en: "we", es: "nosotros" },
	{ en: "they are", es: "ellos" },
	{ en: "they are (f)", es: "ellas" }
];

const qa = pronouns.map(v => ({ a: v.es, q: v.en })).concat(yo, tú, él, nosotros, he);

export = qa;
