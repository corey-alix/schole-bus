import { isMale } from "../quizlet/fun";

let builder = (data: { es: string[]; en: string[] }) => {
	let { en, es } = data;
	return {
		es: `${es[0]} y ${es[1]}`,
		en: `${en[0]} and ${en[1]}`
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
	},
	{ es: ["dentro", "fuera"], en: ["inside", "outside"] }
];

export = opuestos.map(builder);
