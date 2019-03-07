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
		es: ["Mi padre", "Mi madre."],
		en: ["My father", "My mother"]
	},
	{
		es: ["Mi hermana", "Mi Hermano"],
		en: ["My sister", "My brother"]
	},
	{
		es: ["Mi abuelo", "Mi abuela"],
		en: ["My grandfather", "My grandmother"]
	},
	{
		es: ["Mi esposo", "Mi esposa"],
		en: ["My husband", "My wife"]
	},
	{
		es: ["Mi hija", "Mi hijo"],
		en: ["My daughter", "My son"]
	},
	{ es: ["dentro", "fuera"], en: ["inside", "outside"] }
];

export = opuestos.map(builder);
