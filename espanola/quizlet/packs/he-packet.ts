import verbs from "../../verbos/index";

export = verbs.filter(v => !!v.he).map(v => ({ q: v.he.en, a: "he " + v.he.es }));
