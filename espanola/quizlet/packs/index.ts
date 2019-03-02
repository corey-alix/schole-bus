import numeros from "./números-packet";
import pronombres from "./pronoun-packet";
import nouns from "./sustantivo-packet";
import questions from "./question-packet";
import oracións from "./oración-packet";
import opuesto from "./opuesto-packet";
import qa from "../qa";
export = nouns.concat(pronombres, questions, opuesto, numeros, qa, oracións);
