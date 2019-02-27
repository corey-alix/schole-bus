import verbs from "../../verbos/index";

export = verbs.filter(v => !!v.hemos).map(v => ({ q: v.hemos.en, a: "hemos " + v.hemos.es }));
