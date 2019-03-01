import { isMale } from "../quizlet/fun";

let builder = (data: { es: string[]; en: string[] }) => {
	let es = data.es;
	// lo contrario de correr es caminar
	// lo contrario de correr es caminar
	let de = "de";
	let estar = "es";
	return {
		es: `lo contrario ${de} ${es[0]} ${estar} ${es[1]}`,
		en: `the opposite of ${data.en[0]} is ${data.en[1]}`
	};
};

let opuestos = [
	{
		es: ["arriba", "abajo"],
		en: ["up", "down"]
	},
	{
		es: ["atrás", "adelante"],
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
