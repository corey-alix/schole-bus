var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define("quizlet/score-board", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ScoreBoard extends HTMLElement {
        static get observedAttributes() {
            return ["score"];
        }
        updateScore() {
            this.innerHTML = this.getAttribute("score") || "0";
        }
        connectedCallback() {
            this.updateScore();
        }
        attributeChangedCallback() {
            this.updateScore();
        }
    }
    exports.ScoreBoard = ScoreBoard;
});
define("quizlet/qa-input", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class QaInput extends HTMLElement {
        constructor() {
            super();
            this.label = document.createElement("label");
            this.input = document.createElement("input");
            this.input.type = "text";
        }
        focus() {
            this.input.focus();
        }
        rightAnswer() {
            // hack into method defined in index.html
            wrongAnswer(1);
        }
        wrongAnswer() {
            // hack into method defined in index.html
            wrongAnswer(-1);
        }
        isMatch(a, b) {
            let A = a.toUpperCase();
            let B = b.toUpperCase();
            if (A === B)
                return true;
            switch (b.toLocaleLowerCase()) {
                case "á":
                    if (A == "A")
                        return true;
                case "é":
                    if (A == "E")
                        return true;
                case "í":
                    if (A == "I")
                        return true;
                case "ñ":
                    if (A == "N")
                        return true;
                case "ó":
                    if (A == "O")
                        return true;
                case "ú":
                    if (A == "U")
                        return true;
                case "¡":
                    if (A == "!")
                        return true;
                case "¿":
                    if (A == "?")
                        return true;
                case "’":
                    if (A == "'")
                        return true;
            }
            return false;
        }
        connectedCallback() {
            const label = this.label;
            label.textContent = this.getAttribute("question");
            label.title = this.getAttribute("hint") || this.getAttribute("answer") || "";
            const input = this.input;
            const answer = this.getAttribute("answer") || "";
            input.maxLength = answer.length;
            input.innerHTML = `<style>
        .correct {
            color: green;
            border: 1px solid green;
        }
        .wrong {
            border: 1px solid red;
        }
        label {
			font-size: x-large;
            display: block;
			whitespace:wrap;
			margin-top: 20px;
        }
        input {
			font-size: x-large;
			display: block;
            vertical-align: top;
            background-color: black;
            border: none;
            color: gray;
            padding-left: 10px;
            min-height: 64px;
			max-height: 64px;
			width: 100%;
        }
        </style>`;
            input.onkeypress = ev => {
                ev.preventDefault();
                if (input.readOnly)
                    return;
                let currentKey = ev.key;
                let currentValue = input.value;
                let expectedKey = answer[currentValue.length];
                console.log(currentKey, expectedKey);
                if (this.isMatch(currentKey, expectedKey)) {
                    input.classList.remove("wrong");
                    input.value = answer.substring(0, currentValue.length + 1);
                    this.rightAnswer();
                    if (answer.length === currentValue.length + 1) {
                        input.classList.add("correct");
                        input.readOnly = true;
                        let s = this.nextElementSibling;
                        console.log(s);
                        setTimeout(() => s && s.focus(), 200);
                        return false;
                    }
                    return false;
                }
                else {
                    input.classList.add("wrong");
                    this.wrongAnswer();
                    input.value = answer.substring(0, currentValue.length + 1);
                }
                return false;
            };
            const shadowRoot = this.attachShadow({ mode: "open" });
            shadowRoot.appendChild(label);
            shadowRoot.appendChild(input);
        }
    }
    exports.QaInput = QaInput;
});
define("verbos/tener", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // applicable infinitives
    const infinitives = [
        { es: "comer", en: "eat" },
        { es: "ir", en: "go" },
        { es: "leer", en: "read" },
        { es: "dormir", en: "sleep" },
        { es: "hacer", en: "do" }
    ];
    exports.verbo = {
        en: "to have",
        es: "tener",
        yo: "tengo",
        tu: "tienes",
        nosotros: "tenemos"
    };
    const builder = [
        { es: "Tengo que {verb}.", en: "I have to {verb}." },
        { es: "¿Tienes que {verb}?", en: "Do you have to {verb}?" },
        { es: "No tenemos que {verb}.", en: "We don't have to {verb}." }
    ];
    exports.qa = [];
    infinitives.forEach(verb => {
        builder.forEach(b => exports.qa.push({
            q: b.es.replace("{verb}", verb.es),
            a: b.en.replace("{verb}", verb.en)
        }));
    });
});
define("sentences/index", ["require", "exports"], function (require, exports) {
    "use strict";
    const fill_ins = {
        gusta: [{ "el chihuahua": "the chihuahua" }, { "beber agua": "to drink water" }, { "el queso": "cheese" }]
    };
    return [
        { es: "Mi papá ama las papas.", en: "My dad loves potatoes." },
        { es: "¿nos vamos?", en: "Are we going?" },
        { es: "¿Eres un hijo de Dios?", en: "Are you a child of God?" },
        { es: "¿Vas a ir?", en: "Are you going?" },
        { es: "¿Vas a comer?", en: "Are you going to eat?" },
        { es: "¿Estás jubilado?", en: "Are you retired?" },
        { es: "¿Eres el pastor?", en: "Are you the pastor?" },
        { es: "¡Adiós! !Gracias por todo!", en: "Bye! Thanks for everything!" },
        { es: "¿Puedo orar por ti?", en: "Can I pray for you?" },
        { es: "¿Puedes hablar inglés?", en: "Can you speak English?" },
        { es: "¿Puedes hablar más despacio?", en: "Can you speak slower?" },
        { es: "¿Tienes una biblia?", en: "Do you have a bible?" },
        { es: "¿Usted tiene un coche?", en: "Do you have a car?" },
        { es: "¿Tienes un bolígrafo?", en: "Do you have a pen?" },
        { es: "¿Hijos Tienes?", en: "Do you have children?" },
        { es: "¿Conoces a Jesus?", en: "Do you know Jesus?" },
        { es: "¿Te gusta leer?", en: "Do you like to read?" },
        { es: "¿Vives en Cuba?", en: "Do you live in Cuba?" },
        { es: "¿Vives con tu mamá?", en: "Do you live with your mom?" },
        { es: "¿Necesitas una biblia?", en: "Do you need a bible?" },
        { es: "¿Necesitas más para comer?", en: "Do you need more to eat?" },
        { es: "¿Necesitas decidir?", en: "Do you need to decide?" },
        { es: "¿Necesitas comer?", en: "Do you need to eat?" },
        { es: "¿Necesitas ir?", en: "Do you need to go?" },
        { es: "¿Necesitas irte?", en: "Do you need to leave?" },
        { es: "¿Practicas español?", en: "Do you practice Spanish?" },
        { es: "¿Estudias?", en: "Do you study?" },
        { es: "¿Quieres a Jesús como tu salvador?", en: "Do you want Jesus as your savior?" },
        { es: "¿Trabajas?", en: "Do you work?" },
        { es: "Todas las personas necesitan a Jesús", en: "Every person needs Jesus." },
        { es: "Todos son muy amables.", en: "Everyone is very kind." },
        { es: "Perdóneme.", en: "Excuse me." },
        { es: "Disculpe señor.", en: "Excuse me, Sir." },
        { es: "¡Gloria a Dios!", en: "Glory to God!" },
        { es: "Dios siempre es bueno.", en: "God is always good." },
        { es: "Dios es rey sobre toda la creación.", en: "God is King over all creation." },
        { es: "Dios es mi padre.", en: "God is my father." },
        { es: "¡Dios es poderoso!", en: "God is powerful!" },
        { es: "Dios habla a sus hijos.", en: "God talks to his children." },
        { es: "¡Buenas noches!", en: "Good evening!" },
        { es: "¡Buenos dias! Como estas?", en: "Good morning! How are you?" },
        { es: "¡Genial! ¡Eso es bueno!", en: "Great! That’s good!" },
        { es: "¡Feliz cumpleaños!", en: "Happy Birthday!" },
        { es: "El es mi hermano en Cristo.", en: "He is my brother in Christ." },
        { es: "El es mi amigo.", en: "He is my friend." },
        { es: "Él está hablando con Mike.", en: "He is talking to Mike." },
        { es: "Su nombre es Juan.", en: "His name is Juan." },
        { es: "¿Cómo estás?", en: "How are you?" },
        { es: "¡Que horrible!", en: "How horrible!" },
        { es: "¿Cuantos años tienes?", en: "How old are you?" },
        { es: "Voy a comer.", en: "I will eat." },
        { es: "Voy a vivir con Jesús por siempre.", en: "I am going to live with Jesus forever." },
        { es: "Voy a practicar Español", en: "I am going to practice Spanish." },
        { es: "Voy a leer ahora.", en: "I am going to read now." },
        { es: "Voy a hablar con Todd.", en: "I am going to talk to Todd." },
        { es: "No voy al café", en: "I am not going to the café." },
        { es: "No voy.", en: "I am not going." },
        { es: "No voy a cantar sin Todd.", en: "I will not singing without Todd." },
        { es: "Estoy cantando hoy.", en: "I am singing today." },
        { es: "soy tu amigo.", en: "I am your friend." },
        { es: "Yo hablo inglés.", en: "I can speak English." },
        { es: "No comer queso.", en: "I do not eat cheese." },
        { es: "No comer chihuahuas.", en: "I do not eat chihuahuas." },
        { es: "No tengo una pluma.", en: "I do not have a pen." },
        { es: "No tengo hijos.", en: "I do not have children." },
        { es: "No me gusta ir al hospital.", en: "I do not like to go to the hospital." },
        { es: "No necesito más comida.", en: "I do not need more food." },
        { es: "No necesito hacerlo.", en: "I do not need to do it." },
        { es: "No canto bien.", en: "I do not sing well." },
        { es: "No entiendo.", en: "I do not understand." },
        { es: "No quiero comer.", en: "I do not want to eat." },
        { es: "Tengo hijos.", en: "I have children." },
        { es: "Tengo dos bicicletas.", en: "I have two bicycles." },
        { es: "Tengo dos amigos aquí.", en: "I have two friends here." },
        { es: "me gusta el queso.", en: "I like cheese." },
        { es: "Me gusta es, gracias.", en: "I like it, thank you." },
        { es: "Me gusta el chihuahua.", en: "I like the chihuahua." },
        { es: "Me gusta beber aqua.", en: "I like to drink water." },
        { es: "Me gusta comer pizza.", en: "I like to eat pizza." },
        { es: "Me gusta comer.  Te gusta comer?", en: "I like to eat. Do you like to eat?" },
        { es: "Me gusta alabar a Dios.", en: "I like to praise God." },
        { es: "Me gusta leer la biblia.", en: "I like to read the bible." },
        { es: "Vivo en la casa roja.", en: "I live in the red house." },
        { es: "Amo el chocolate.", en: "I love chocolate." },
        { es: "Me encanta cantar en la iglesia.", en: "I love to sing in church." },
        { es: "Necesito una biblia.", en: "I need a bible." },
        { es: "Necesito una silla.", en: "I need a chair." },
        { es: "Necesito un poco.", en: "I need a little." },
        { es: "Necesito una papa.", en: "I need a potato." },
        { es: "Necesito ayuda por favor.", en: "I need help, please." },
        { es: "Necesito un poco más, por favor.", en: "I need a little more, please." },
        { es: "Necesito decidir.", en: "I need to decide." },
        { es: "Necesito comer.", en: "I need to eat." },
        { es: "Necesito irme por la mañana.", en: "I need to leave in the morning." },
        { es: "Necesito ir a Cuba.", en: "I need to go to Cuba." },
        { es: "Necesito ir al baño.", en: "I need to go to the bathroom." },
        { es: "Necesito pagar.", en: "I need to pay." },
        { es: "Hablo un poco de español.", en: "I speak a little Spanish." },
        { es: "Quiero beber agua.", en: "I want to drink water." },
        { es: "Quiero ir a Cuba con ellos.", en: "I want to go to Cuba with them." },
        { es: "Quiero hablar.", en: "I want to talk." },
        { es: "Quiero hablarte de Jesús.", en: "I want to talk to you about Jesus." },
        { es: "Yo creo en Dios.", en: "I believe in God." },
        { es: "Me gustaría eso.", en: "I would like that." },
        { es: "Me gustaría cantar.", en: "I would like to sing." },
        { es: "Quisiera dos, por favor.", en: "I would like two, please." },
        { es: "No me gustaría ir.", en: "I would not like to go." },
        { es: "¿Es Dios tu padre?", en: "Is God your father?" },
        { es: "¿El va?", en: "Is he going?" },
        { es: "¿Él es tu hermano?", en: "Is he your brother?" },
        { es: "¿Es su casa?", en: "Is that his house?" },
        { es: "¿Es el niño tu hijo?", en: "Is the boy your son?" },
        { es: "¿Es el chihuahua un niño?", en: "Is the chihuahua a boy?" },
        { es: "Es una buena idea.", en: "It is a good idea." },
        { es: "Es un placer conocerte.", en: "It’s good to meet you." },
        { es: "Jesús es Dios.", en: "Jesus is God." },
        { es: "¡Jesús es Rey!", en: "Jesus is King!" },
        { es: "Jesús es mi roca.", en: "Jesus is my rock." },
        { es: "Jesús es nuestra única esperanza.", en: "Jesus is our only hope." },
        { es: "Jesús es el único salvador.", en: "Jesus is the only savior." },
        { es: "Jesús es el hijo de Dios.", en: "Jesus is the son of God." },
        { es: "Jesús vive en mí.", en: "Jesus lives in me." },
        { es: "Jesús ama a todos.", en: "Jesus loves everyone." },
        { es: "Jesús te ama.", en: "Jesus loves you." },
        { es: "¡Comamos!", en: "Let’s eat!" },
        { es: "Mi madre es muy hermosa.", en: "My mother is very pretty." },
        { es: 'No, gracias. Como se dice "pollo"?', en: 'No, thank you. How do you say "chicken"?' },
        { es: "Por favor dime.", en: "Please tell me." },
        { es: "Orar a Dios es importante.", en: "Praying to God is important." },
        { es: "Orar es hablar a Dios.", en: "Praying is talking to God." },
        { es: "Dilo otra vez, por favor.", en: "Say that again, please." },
        { es: "Hasta luego.", en: "See you later." },
        { es: "Ella es mi hermana en Cristo.", en: "She is my sister in Christ." },
        { es: "Cantar a Dios es importante.", en: "Singing to God is important." },
        { es: "", en: "Thank you for everything." },
        { es: "", en: "Thank you for singing." },
        { es: "", en: "Thank you for studying with me." },
        { es: "¡Muy gracias!", en: "Thank you so much!" },
        { es: "Gracias, estoy bien.", en: "Thank you, I am fine." },
        { es: "Eso es malo. Lo siento.", en: "That’s bad. I am sorry." },
        { es: "¡Eso es tan bueno!", en: "That’s so good!" },
        { es: "La Biblia dice que Jesús es el Señor.", en: "The bible says Jesus is Lord." },
        { es: "El coche es blanco.", en: "The car is white." },
        { es: "El gato es muy blanco.", en: "The cat is very white." },
        { es: "El queso es de Chihuahua.", en: "The cheese is from Chihuahua." },
        { es: "El chihuahua es muy blanco.", en: "The chihuahua is very white" },
        { es: "¿La niña es tu hija?", en: "The girl is your daughter?" },
        { es: "Todd está con el pastor.", en: "Todd is with the pastor." },
        { es: "¡Muy bien!", en: "Very good!" },
        { es: "Somos hijos de Dios por medio de Cristo.", en: "We are children of God through Christ." },
        { es: "Somos de Estados Unidos.", en: "We are from the United States." },
        { es: "Vamos a la iglesia.", en: "We are going to church." },
        { es: "Vamos a comer en la iglesia.", en: "We are going to eat at church." },
        { es: "Vamos a rezar.", en: "We are going to pray." },
        { es: "Vamos a cantar en la iglesia.", en: "We are going to sing at church." },
        { es: "Vamos a estudiar más tarde.", en: "We are going to study later." },
        { es: "Nos vamos mañana.", en: "We are going tomorrow." },
        { es: "Somos justificados por la fe.", en: "We are justified by faith." },
        { es: "No vamos.", en: "We are not going." },
        { es: "Vivir por la fe.", en: "We live by faith." },
        { es: "Nosotros vivimos en los Estados Unidos.", en: "We live in the United States." },
        { es: "Necesitamos a Dios.", en: "We need God." },
        { es: "Necesitamos orar todos los días.", en: "We need to pray every day." },
        { es: "Necesitamos hablar.", en: "We need to talk." },
        { es: "¿Qué te gusta?", en: "What do you like?" },
        { es: "Qué significa eso?", en: "What does that mean?" },
        { es: "¿Cuál es su nombre?", en: "What is your name?" },
        { es: "¿Que hora es?", en: "What time is it?" },
        { es: "¿Cuándo vamos a la iglesia?", en: "When are we going to church?" },
        { es: "¿Donde estamos comiendo?", en: "Where are we eating?" },
        { es: "¿Dónde vives?", en: "Where do you live?" },
        { es: "¿Dónde está Albert?", en: "Where is Albert?" },
        { es: "¿A dónde él va?", en: "Where is he going?" },
        { es: "¿Dónde está el baño?", en: "Where is the bathroom?" },
        { es: "¿Dónde está el niño?", en: "Where is the boy?" },
        { es: "¿A dónde va el chihuahua?", en: "Where is the chihuahua going?" },
        { es: "¿Donde esta el chihuahua?", en: "Where is the chihuahua?" },
        { es: "¿Donde está el pastor?", en: "Where is the pastor?" },
        { es: "Con Cristo, soy fuerte.", en: "With Christ, I am strong." },
        { es: "Si, quiero.", en: "Yes, I want to." },
        { es: "Si, gracias.", en: "Yes, thank you." },
        { es: "Sí, tienes que ir conmigo.", en: "Yes, you need to go with me." },
        { es: "Lo hiciste muy bien.", en: "You did very well." },
        { es: "Tu madre canta bien.", en: "Your mom sings well." }
    ];
});
define("quizlet/qa", ["require", "exports", "verbos/tener", "sentences/index"], function (require, exports, tener_1, index_1) {
    "use strict";
    index_1 = __importDefault(index_1);
    const verbs = {
        llamar: "call",
        confiar: "trust",
        esperar: "wait",
        amar: "love",
        quedar: "stay",
        comer: "eat",
        visitar: "visit",
        escuchar: "hear",
        caminar: "walk",
        limpiar: "clean",
        pagar: "pay",
        permanecer: "stay",
        llevar: "wear",
        entrar: "enter",
        "nadar {adjective}": "swim {adjective}",
        "correr {adjective}": "run {adjective}"
    };
    const places = {
        "a casa": "home"
    };
    const colors = {
        anaranjado: "orange",
        azul: "blue",
        rojo: "red",
        verde: "green",
        negro: "black",
        marrón: "brown",
        rosado: "pink",
        amarillo: "yellow"
    };
    const nouns = {
        "una casa": "a house",
        "esa casa": "that house",
        "otra casa": "another house",
        "una bicicleta": "a bike",
        "una caminata": "a hike",
        "un libro": "a book",
        "una persona": "a person"
    };
    const adjectives = {
        rápido: "fast",
        "más rápido": "faster",
        "lo más rápido": "fastest"
    };
    const numbers = {
        dos: "two",
        tres: "three",
        quatro: "four",
        cinco: "five",
        seis: "six",
        siete: "seven",
        ocho: "eight",
        nuevo: "nine",
        diez: "ten",
        once: "eleven",
        doce: "twelve"
    };
    function startsWith(str, val) {
        return str.indexOf(val) === 0;
    }
    function endsWith(str, val) {
        return str.lastIndexOf(val) === str.length - val.length;
    }
    /*
    If the singular definite article is "el" the plural is "los."
    The plural of either "tú" or "usted" in Latin America is "ustedes"
    and will take the same verb endings as "él/la and ellos/ellas respectively.
    The plural (ellos/ellas) ending of verbs is "an" for "ar" verbs and "en" for "er/ir verbs.
    
    If a noun ends in a vowel, simply add -s.
    If a noun ends in a consonant, simply add -es.
    If a noun ends in a -z, change the z to c before adding -es.
    If a noun ends in ión, drop the written accent before adding -es.
    If the plural refers to a mixed group, use the masculine.
     */
    function pluralizeNoun(noun) {
        let num = randomNumber();
        let es = noun.es;
        let en = noun.en;
        if (endsWith(es, "a"))
            es += "s";
        else if (endsWith(es, "e"))
            es += "s";
        else if (endsWith(es, "i"))
            es += "s";
        else if (endsWith(es, "o"))
            es += "s";
        else if (endsWith(es, "u"))
            es += "s";
        else if (endsWith(es, "z"))
            es = es.substring(0, es.length - 1) + "ces";
        else
            es += "es";
        if (startsWith(es, "el ")) {
            es = "los" + es.substring(2);
            en += " (plural)";
        }
        else if (startsWith(es, "tú ")) {
            es = "ustedes" + es.substring(2);
            en += " (plural)";
        }
        else if (startsWith(es, "esa ")) {
            es = "esas" + es.substring(3);
            en += " (plural)";
        }
        else if (startsWith(es, "usted ")) {
            es = "ustedes" + es.substring(5);
            en += " (plural)";
        }
        else if (startsWith(es, "un ")) {
            es = num.es + es.substring(2);
            en = `${noun.en} (${num.en} of them)`;
        }
        else if (startsWith(es, "una ")) {
            es = num.es + es.substring(3);
            en = `${noun.en} (${num.en} of them)`;
        }
        else {
            en += " (plural)";
        }
        return {
            es: es,
            en: en
        };
    }
    function randomItem(list) {
        let keys = Object.keys(list);
        let index = Math.round(Math.random() * (keys.length - 1));
        let es = keys[index];
        return { es: es, en: list[es] || es };
    }
    function randomVerb() {
        return randomItem(verbs);
    }
    function randomPlace() {
        return randomItem(places);
    }
    function randomNoun() {
        return randomItem(nouns);
    }
    function randomNumber() {
        return randomItem(numbers);
    }
    function randomColor() {
        return randomItem(colors);
    }
    function randomAdjective() {
        return randomItem(adjectives);
    }
    function shuffle(array) {
        let currentIndex = array.length;
        while (0 !== currentIndex) {
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            let temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }
    const QA = [
        { a: "yo necesito", q: "I need" },
        { a: "yo necesito {verb}", q: "I need to {verb}" },
        { a: "yo necesito {noun}", q: "I need {noun}" },
        { a: "yo necesito {plural-noun}", q: "I need {plural-noun}" },
        { a: "yo necesito {verb} por favor", q: "I need to {verb} please" },
        { a: "yo necesito {noun} por favor", q: "I need {noun} please" },
        { a: "tú necesitas {verb}", q: "you need to {verb}" },
        { a: "tú necesitas {noun}", q: "you need {noun}" },
        { a: "nosotros necesitamos {noun}", q: "we need {noun}" },
        { a: "nosotros necesitamos {verb}", q: "we need to {verb}" },
        { a: "me gusta {verb}", q: "I like to {verb}" },
        { a: "me gusta {noun}", q: "I like {noun}" },
        { a: "te gusta {verb}", q: "you like to {verb}" },
        { a: "te gusta {noun}", q: "you like {noun}" },
        { a: "me gustan {plural-noun}", q: "I like {plural-noun}" },
        { a: "me gustaría {verb}", q: "I would like to {verb}" },
        { a: "me gusta {noun}", q: "I would like {noun}" },
        { a: "me gustaría {verb} y {noun} {verb}", q: "I would like to {verb} and {noun} to {verb}" },
        { a: "me encanta {noun}", q: "I love {noun}" },
        { a: "me encantaría {noun}", q: "I would love {noun}" },
        { a: "voy a {verb}", q: "I will {verb}" },
        { a: "quiero {verb}", q: "I want to {verb}" },
        { a: "quiero {noun}", q: "I want {noun}" },
        { a: "quiero {noun} o {noun}", q: "I want {noun} or {noun}" },
        { a: "me llamo es", q: "my name is" },
        { a: "me voy {place}", q: "I am going {place}" },
        { a: "I want to stay", q: "Quiero quedarme" },
        { a: "nosotros queremos {verb} en otro {noun} {color}", q: "we want to {verb} at another {color} {noun}" },
        { a: "ellos quieren {verb} {noun} {adjective}", q: "they want to {verb} {noun} {adjective}" },
        { a: "es dos mas pequeño que cinco?", q: "is two smaller than five?" },
        { a: "es {number} mas pequeño que {number}?", q: "is {number} smaller than {number}?" },
        { a: "es {number} mas mayor que {number}?", q: "is {number} larger than {number}?" },
        { a: "Que tengas una buena mañana", q: "have a good morning" },
        { a: "¡Que tengas una buena semana!", q: "have a good week!" }
    ];
    let qa = QA.concat(tener_1.qa, index_1.default.filter(v => !!v.es && !!v.en).map(v => ({ a: v.es, q: v.en })));
    let questions = shuffle(qa).map(item => {
        let q = item.q;
        let a = item.a;
        let swap = 0.5 > Math.random();
        while (true) {
            let verb = randomVerb();
            let noun = randomNoun();
            let place = randomPlace();
            let num = randomNumber();
            let pluralNoun = pluralizeNoun(randomNoun());
            let adjective = randomAdjective();
            let color = randomColor();
            let q2 = q
                .replace("{verb}", verb.en)
                .replace("{plural-noun}", pluralNoun.en)
                .replace("{noun}", noun.en)
                .replace("{place}", place.en)
                .replace("{color}", color.en)
                .replace("{adjective}", adjective.en)
                .replace("{number}", num.en);
            let a2 = a
                .replace("{verb}", verb.es)
                .replace("{plural-noun}", pluralNoun.es)
                .replace("{noun}", noun.es)
                .replace("{place}", place.es)
                .replace("{color}", color.es)
                .replace("{adjective}", adjective.es)
                .replace("{number}", num.es);
            if (q2 == q)
                break;
            q = q2;
            a = a2;
        }
        return swap ? { q: a, a: q } : { q: q, a: a };
    });
    return questions.slice(0, 5);
});
define("quizlet/qa-block", ["require", "exports", "quizlet/qa"], function (require, exports, qa_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    qa_1 = __importDefault(qa_1);
    class QaBlock extends HTMLElement {
        constructor() {
            super();
            this.load();
        }
        load() {
            const shadowRoot = this.attachShadow({ mode: "open" });
            let div = document.createElement("div");
            qa_1.default.forEach(item => {
                let qaItem = document.createElement("qa-input");
                qaItem.setAttribute("question", item.q);
                qaItem.setAttribute("answer", item.a);
                div.appendChild(qaItem);
            });
            shadowRoot.innerHTML = div.innerHTML;
        }
    }
    exports.QaBlock = QaBlock;
});
define("quizlet/main", ["require", "exports", "quizlet/score-board", "quizlet/qa-input", "quizlet/qa-block"], function (require, exports, score_board_1, qa_input_1, qa_block_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    {
        let mods = {
            "qa-input": qa_input_1.QaInput,
            "qa-block": qa_block_1.QaBlock,
            "score-board": score_board_1.ScoreBoard
        };
        Object.keys(mods).forEach(key => customElements.define(key, mods[key]));
    }
});
//# sourceMappingURL=main.js.map