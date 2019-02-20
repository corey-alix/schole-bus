// applicable infinitives
const infinitives = [
	{ es: "comer", en: "eat" },
	{ es: "ir", en: "go" },
	{ es: "leer", en: "read" },
	{ es: "dormir", en: "sleep" },
	{ es: "hacer", en: "do" }
];

export const verbo = {
	en: "to have",
	es: "tener",
	yo: "tengo",
	tu: "tienes",
	nosotros: "tenemos"
};

const builder = [
	{ es: "Tengo que {verb}.", en: "I have to {verb}." },
	{ es: "¿Tienes que {verb}?", en: "Do you have to {verb}?" },
	{ es: "No tenemos que {verb}.", en: "We don't have to {verb}." }
];

export let qa: Array<{ q: string; a: string }> = [];
infinitives.forEach(verb => {
	builder.forEach(b =>
		qa.push({
			q: b.es.replace("{verb}", verb.es),
			a: b.en.replace("{verb}", verb.en)
		})
	);
});
