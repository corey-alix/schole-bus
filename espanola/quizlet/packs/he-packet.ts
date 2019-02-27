import verbs from "../../verbos/index";

export = verbs.filter(v => !!v.he).map(v => ({ q: v.he.en, a: v.he.es }));
