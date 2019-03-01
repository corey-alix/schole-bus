const nums = [
	{ es: "cero", en: "zero" },
	{ es: "uno", en: "one" },
	{ es: "dos", en: "two" },
	{ es: "tres", en: "three" },
	{ es: "quatro", en: "four" },
	{ es: "cinco", en: "five" },
	{ es: "seis", en: "six" },
	{ es: "siete", en: "seven" },
	{ es: "ocho", en: "eight" },
	{ es: "nueve", en: "nine" },
	{ es: "diez", en: "ten" },
	{ es: "once", en: "eleven" },
	{ es: "doce", en: "twelve" },
	{ es: "trece", en: "thirteen" },
	{ es: "catorce", en: "fourteen" },
	{ es: "quince", en: "fifteen" },
	{ es: "dieciséis", en: "sixteen" },
	{ es: "diecisiete", en: "seventeen" },
	{ es: "dieciocho", en: "eighteen" },
	{ es: "diecinueve", en: "nineteen" },
	{ es: "veinte", en: "twenty" }
];

let qa = nums.map(v => ({ a: v.es, q: v.en }));
[1, 2, 5].forEach(a =>
	[0, 0, 0]
		.map(v => Math.floor((nums.length - a) * Math.random()))
		.forEach(b =>
			qa.push({
				a: `${nums[a].es} más ${nums[b].es} son ${nums[a + b].es}`,
				q: `${nums[a].en} plus ${nums[b].en} are ${nums[a + b].en}`
			})
		)
);

export = qa;
