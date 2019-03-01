import oración from "../../sagrada_escritura/oracion";

export = oración.map(v => ({ a: v.es, q: v.en }));
