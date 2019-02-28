import numeros from "./números-packet";
import pronombres from "./pronoun-packet";
import nouns from "./sustantivo-packet";
import questions from "./question-packet";
import qa from "../qa";
export = pronombres.concat(numeros, nouns, questions, qa);
