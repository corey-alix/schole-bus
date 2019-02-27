import verbs from "../../verbos/index";

export = verbs.filter(v => !!v.has).map(v => ({ q: v.has.en, a: v.has.es }));
