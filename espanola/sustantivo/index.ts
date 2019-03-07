import { forceGender } from "../quizlet/fun";

export = [
	{ es: "gato", en: "cat" },
	{ es: "perro", en: "dog" },
	{ es: "árbol", en: "tree" },
	{ es: "cielo", en: "heaven" },
	{ es: "tierra", en: "earth" },
	{ es: "cruz", en: "cross" },
	{ es: "cuerpo", en: "body" },
	{ es: "sepulcro", en: "grave" },
	{ es: "estruendo", en: "roar" },
	{ es: "rostro", en: "face" },
	{ es: "Dios", en: "God" },
	{ es: "amanecer", en: "dawn" },
	{ es: "muerte", en: "death" }
].map(v => ({ es: forceGender(v.es), en: "the " + v.en }));
