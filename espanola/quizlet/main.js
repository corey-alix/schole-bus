var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define("score-board", ["require", "exports"], function (require, exports) {
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
define("qa-input", ["require", "exports"], function (require, exports) {
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
        wrongAnswer() {
            // hack into method defined in index.html
            wrongAnswer();
        }
        isMatch(a, b) {
            if (a.toUpperCase() === b.toUpperCase())
                return true;
            switch (b.toLocaleLowerCase()) {
                case "á":
                    if (a.toUpperCase() == "A")
                        return true;
                case "é":
                    if (a.toUpperCase() == "E")
                        return true;
                case "í":
                    if (a.toUpperCase() == "I")
                        return true;
                case "ñ":
                    if (a.toUpperCase() == "N")
                        return true;
                case "ó":
                    if (a.toUpperCase() == "O")
                        return true;
                case "ú":
                    if (a.toUpperCase() == "U")
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
                    if (answer.length === currentValue.length + 1) {
                        input.classList.add("correct");
                        input.readOnly = true;
                        let s = this.nextElementSibling;
                        console.log(s);
                        setTimeout(() => s && s.focus(), 200);
                        return false;
                    }
                    console.log("+");
                    return false;
                }
                else {
                    input.classList.add("wrong");
                    this.wrongAnswer();
                }
                console.log("-");
                return false;
            };
            const shadowRoot = this.attachShadow({ mode: "open" });
            shadowRoot.appendChild(label);
            shadowRoot.appendChild(input);
        }
    }
    exports.QaInput = QaInput;
});
define("qa", ["require", "exports"], function (require, exports) {
    "use strict";
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
    const qa = [
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
        { a: "es {number} mas mayor que {number}?", q: "is {number} larger than {number}?" }
    ];
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
    return questions.slice(0, 10);
});
define("qa-block", ["require", "exports", "qa"], function (require, exports, qa_1) {
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
define("main", ["require", "exports", "score-board", "qa-input", "qa-block"], function (require, exports, score_board_1, qa_input_1, qa_block_1) {
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