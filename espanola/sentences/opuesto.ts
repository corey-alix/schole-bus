function isMale(noun: string) {
	if (0 === noun.indexOf("el ")) return true;
	if (0 === noun.indexOf("la ")) return false;
	let last = noun.charAt(noun.length - 1);
	switch (last) {
		case "a":
		case "e":
			return false;
		case "o":
			return true;
	}
	return true;
}

let builder = (data: { es: string[]; en: string[] }) => {
	let es1 = data.es[0];
	es1 = isMale(es1) ? "al " : "a " + es1;
	return { es: `lo opuesto a ${es1} es ${data.es[1]}`, en: `the opposite of ${data.en[0]} is ${data.en[1]}` };
};

let opuestos = [
	{
		es: ["arriba", "abajo"],
		en: ["up", "down"]
	},
	{
		es: ["atràs", "adelante"],
		en: ["behind", "ahead"]
	},
	{
		es: ["caliente", "frio"],
		en: ["hot", "cold"]
	},
	{
		es: ["corre", "camina"],
		en: ["run", "walk"]
	},
	{
		es: ["en", "fuera"],
		en: ["in", "out"]
	}
];

export = opuestos.map(builder);
