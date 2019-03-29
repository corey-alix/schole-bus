import numeros from "./números-packet";
import pronombres from "./pronoun-packet";
import nouns from "./sustantivo-packet";
import questions from "./question-packet";
import oracións from "./oración-packet";
import opuesto from "./opuesto-packet";
import dialog from "./dialog";
import qa from "../qa";
import stories from "./stories-packet";
import cincos from "./cincos";
export = ([] as Array<{ a: string; q: string }>).concat(
	cincos,
	questions,
	dialog,
	qa,
	pronombres,
	nouns,
	opuesto,
	numeros,
	oracións,
	//stories
);
