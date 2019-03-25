var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define("quizlet/webcomponent", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var nextkey = 0;
    var registry = [];
    var WebComponent = /** @class */ (function () {
        function WebComponent(domNode) {
            this.domNode = domNode;
            domNode.setAttribute("registry-key", nextkey + "");
            registry[nextkey++] = this;
        }
        WebComponent.prototype.connectedCallback = function () {
            // added to dom
        };
        WebComponent.prototype.attachShadow = function (options) {
            return this.domNode;
        };
        WebComponent.prototype.nextElementSibling = function () {
            var next = this.domNode.nextElementSibling;
            if (!next)
                return null;
            var key = next.getAttribute("registry-key");
            if (!key)
                return null;
            return registry[parseInt(key)];
        };
        WebComponent.prototype.getAttribute = function (name) {
            return this.domNode.getAttribute(name);
        };
        WebComponent.prototype.setAttribute = function (name, value) {
            this.domNode.setAttribute(name, value);
            this.attributeChangedCallback();
        };
        WebComponent.prototype.attributeChangedCallback = function () { };
        return WebComponent;
    }());
    exports.WebComponent = WebComponent;
    function getComponent(domNode) {
        var key = domNode.getAttribute("registry-key");
        if (!key)
            return null;
        return registry[parseInt(key)];
    }
    exports.getComponent = getComponent;
    function cssin(name, css) {
        var id = "style-" + name;
        var styleTag = document.getElementById(id);
        if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.id = id;
            styleTag.type = "text/css";
            document.head.appendChild(styleTag);
            styleTag.appendChild(document.createTextNode(css));
        }
        var dataset = styleTag.dataset;
        dataset["count"] = parseInt(dataset["count"] || "0") + 1 + "";
        return function () {
            dataset["count"] = parseInt(dataset["count"] || "0") - 1 + "";
            if (dataset["count"] === "0") {
                styleTag.remove();
            }
        };
    }
    exports.cssin = cssin;
});
define("quizlet/system-events", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var EventDispatcher = /** @class */ (function () {
        function EventDispatcher() {
            this.events = {};
        }
        EventDispatcher.prototype.on = function (event, callback) {
            var _this = this;
            this.events[event] = this.events[event] || [];
            this.events[event].push(callback);
            // inefficient way of removing the callback
            return function () { return (_this.events[event] = _this.events[event].filter(function (c) { return c != callback; })); };
        };
        EventDispatcher.prototype.trigger = function (event, data) {
            if (!this.events)
                return;
            var handlers = this.events[event];
            if (!handlers)
                return;
            handlers.forEach(function (h) { return h(data || null); });
        };
        return EventDispatcher;
    }());
    exports.EventDispatcher = EventDispatcher;
    var SystemEvents = /** @class */ (function () {
        function SystemEvents() {
        }
        SystemEvents.trigger = function (name, value) {
            SystemEvents.events.trigger(name, value);
        };
        SystemEvents.watch = function (name, cb) {
            return SystemEvents.events.on(name, cb);
        };
        SystemEvents.events = new EventDispatcher();
        return SystemEvents;
    }());
    exports.SystemEvents = SystemEvents;
});
define("quizlet/console-log", ["require", "exports", "quizlet/webcomponent", "quizlet/system-events"], function (require, exports, webcomponent_1, system_events_1) {
    "use strict";
    exports.__esModule = true;
    var ConsoleLog = /** @class */ (function (_super) {
        __extends(ConsoleLog, _super);
        function ConsoleLog(domNode) {
            var _this = _super.call(this, domNode) || this;
            system_events_1.SystemEvents.watch("log", function (value) {
                var logItem = document.createElement("div");
                logItem.innerHTML = value.message;
                domNode.insertBefore(logItem, domNode.firstChild);
            });
            return _this;
        }
        return ConsoleLog;
    }(webcomponent_1.WebComponent));
    exports.ConsoleLog = ConsoleLog;
    function log(message) {
        system_events_1.SystemEvents.trigger("log", { message: message });
    }
    exports.log = log;
});
define("quizlet/fun", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    console.assert(!isMale("carnitas"));
    function startsWith(str, val) {
        return str.indexOf(val) === 0;
    }
    exports.startsWith = startsWith;
    function endsWith(str, val) {
        return str.lastIndexOf(val) === str.length - val.length;
    }
    exports.endsWith = endsWith;
    function combine(a) {
        if (1 === a.length)
            return a[0];
        var head = a[0];
        var tail = a[1];
        var result = [];
        head.forEach(function (h) { return tail.forEach(function (t) { return result.push({ es: h.es + " " + t.es, en: h.en + " " + t.en }); }); });
        a.splice(0, 2, result);
        return combine(a);
    }
    exports.combine = combine;
    function isPlural(noun) {
        return noun.charAt(noun.length - 1) === "s";
    }
    exports.isPlural = isPlural;
    function isMale(noun) {
        if (0 === noun.indexOf("el "))
            return true;
        if (0 === noun.indexOf("la "))
            return false;
        var head = noun.split(" ")[0];
        var last = head.charAt(noun.length - 1);
        switch (last) {
            case "a":
                return head.charAt(head.length - 2) === "m";
            case "á":
            case "é":
            case "í":
            case "ó":
            case "ú":
            case "o":
                return true;
            case "s":
                return isMale(head.substring(0, head.length - 1));
            case "d":
            case "z":
                return false;
        }
        return true;
    }
    exports.isMale = isMale;
    function forceGender(noun) {
        if (0 === noun.indexOf("el "))
            return noun;
        if (0 === noun.indexOf("la "))
            return noun;
        if (0 === noun.indexOf("las "))
            return noun;
        if (0 === noun.indexOf("los "))
            return noun;
        var head = noun.split(" ")[0];
        if (isMale(head)) {
            if (isPlural(head)) {
                noun = "los " + noun;
            }
            else {
                noun = "el " + noun;
            }
        }
        else {
            if (isPlural(head)) {
                noun = "las " + noun;
            }
            else {
                noun = "la " + noun;
            }
        }
        return noun;
    }
    exports.forceGender = forceGender;
    function shuffle(array) {
        var currentIndex = array.length;
        while (0 !== currentIndex) {
            var randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            var temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }
    exports.shuffle = shuffle;
});
define("quizlet/keydown-as-keypress", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var Mapping = /** @class */ (function () {
        function Mapping() {
        }
        Mapping.prototype.get = function (ev) {
            if (ev.key)
                return ev.key;
            return String.fromCharCode(ev.keyCode);
        };
        return Mapping;
    }());
    exports.mapping = new Mapping();
});
define("quizlet/listener", ["require", "exports", "quizlet/console-log", "quizlet/system-events"], function (require, exports, console_log_1, system_events_2) {
    "use strict";
    exports.__esModule = true;
    function asPercent(value) {
        return Math.round(value * 100) + "%";
    }
    var Listener = /** @class */ (function () {
        function Listener() {
            var _this = this;
            this.stopped = true;
            this.autostart = true;
            this.recognition = new window["webkitSpeechRecognition"]();
            var recognition = this.recognition;
            recognition.interimResults = false;
            recognition.continuous = false;
            recognition.lang = "es";
            recognition.maxAlternatives = 5;
            recognition.addEventListener("start", function (e) {
                _this.stopped = false;
            });
            recognition.addEventListener("end", function (e) {
                _this.stopped = false;
                if (_this.autostart)
                    recognition.start();
            });
            recognition.addEventListener("result", function (e) {
                for (var i = 0; i < e.results.length; i++) {
                    var result = e.results[i];
                    if (result.isFinal) {
                        for (var j = 0; j < result.length; j++) {
                            var transcript = result[j].transcript;
                            console.log(transcript, result[j]);
                            var confidence = result[j].confidence;
                            if (0.5 < confidence) {
                                console_log_1.log(transcript + " (" + asPercent(confidence) + ")");
                            }
                            if (0.8 < confidence) {
                                system_events_2.SystemEvents.trigger("speech-detected", { result: transcript });
                                return;
                            }
                        }
                    }
                }
            });
        }
        Listener.prototype.listen = function () {
            if (this.stopped)
                this.recognition.start();
        };
        return Listener;
    }());
    exports.listener = new Listener();
});
define("quizlet/score-board", ["require", "exports", "quizlet/webcomponent"], function (require, exports, webcomponent_2) {
    "use strict";
    exports.__esModule = true;
    var ScoreBoard = /** @class */ (function (_super) {
        __extends(ScoreBoard, _super);
        function ScoreBoard() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ScoreBoard.prototype.updateScore = function () {
            this.domNode.innerHTML = this.getAttribute("score") || "0";
        };
        ScoreBoard.prototype.connectedCallback = function () {
            this.updateScore();
        };
        ScoreBoard.prototype.attributeChangedCallback = function () {
            this.updateScore();
        };
        return ScoreBoard;
    }(webcomponent_2.WebComponent));
    exports.ScoreBoard = ScoreBoard;
});
define("quizlet/packs/nums", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.nums = [
        { es: "cero", en: "zero" },
        { es: "uno", en: "one" },
        { es: "dos", en: "two" },
        { es: "tres", en: "three" },
        { es: "quatro", en: "four" },
        { es: "cinco", en: "five" },
        { es: "seis", en: "six" },
        { es: "siete", en: "seven" },
        { es: "ocho", en: "eight" },
        { es: "nueve", en: "nine" },
        { es: "diez", en: "ten" },
        { es: "once", en: "eleven" },
        { es: "doce", en: "twelve" },
        { es: "trece", en: "thirteen" },
        { es: "catorce", en: "fourteen" },
        { es: "quince", en: "fifteen" },
        { es: "dieciséis", en: "sixteen" },
        { es: "diecisiete", en: "seventeen" },
        { es: "dieciocho", en: "eighteen" },
        { es: "diecinueve", en: "nineteen" },
        { es: "veinte", en: "twenty" }
    ];
});
define("quizlet/qa-input", ["require", "exports", "quizlet/webcomponent", "quizlet/system-events", "quizlet/console-log", "quizlet/keydown-as-keypress", "quizlet/packs/nums"], function (require, exports, webcomponent_3, system_events_3, console_log_2, keydown_as_keypress_1, nums_1) {
    "use strict";
    exports.__esModule = true;
    function soundex(a) {
        //a = a.replace(/\d+( + )\d+/g, " mas ");
        a = a
            .split(" ")
            .map(function (v) { return (parseInt(v).toString() === v ? nums_1.nums[parseInt(v)].es : v); })
            .join(" ");
        a = a.toLowerCase();
        a = a.replace(/[.,?¿¡ ]/g, "");
        a = a.replace(/á/g, "a");
        a = a.replace(/é/g, "e");
        a = a.replace(/í/g, "i");
        a = a.replace(/ó/g, "o");
        a = a.replace(/ú/g, "u");
        return a;
    }
    function areEqual(a, b) {
        // use a soundex algorithm
        a = soundex(a);
        b = soundex(b);
        return a === b;
    }
    webcomponent_3.cssin("qa-input", "qa-input {\n\tpadding-top: 20px;\n}\nqa-input .correct {\n\tcolor: green;\n\tborder: 1px solid green;\n}\nqa-input .wrong {\n\tborder: 1px solid red;\n}\nqa-input label {\n\tdisplay: none;\n\tfont-size: xx-large;\n\twhitespace:wrap;\n\tpadding-top: 20px;\n}\nqa-input.complete label {\n\tdisplay: block;\n}\nqa-input.complete input {\n\tdisplay: none;\n}\nqa-input input {\n\tfont-size: x-large;\n\tdisplay: block;\n\tvertical-align: top;\n\tbackground-color: black;\n\tborder: none;\n\tcolor: gray;\n\tpadding-left: 10px;\n\tmin-height: 64px;\n\tmax-height: 64px;\n\twidth: 100%;\n\tpadding: 20px;\n}\nqa-input button {\n    background: transparent;\n    border: none;\n    color: gray;\n\tposition: relative;\n    bottom: 3px;\n\tleft: 10px;\n}\nqa-input button[disabled] {\n\tcolor: green;\n}");
    function dump(o) {
        var result = {};
        for (var p in o) {
            if (p === p.toUpperCase())
                continue;
            var v = o[p];
            if (typeof v === "string" || typeof v === "number")
                result[p] = v + "";
        }
        console_log_2.log(JSON.stringify(result));
    }
    function hasFocus(element) {
        return document.activeElement === element;
    }
    var QaInput = /** @class */ (function (_super) {
        __extends(QaInput, _super);
        function QaInput(domNode) {
            var _this = _super.call(this, domNode) || this;
            _this.score = [0, 0];
            _this.handlers = [];
            _this.label = document.createElement("label");
            _this.input = document.createElement("input");
            _this.input.type = "text";
            _this.input.spellcheck = false;
            _this.help = document.createElement("button");
            _this.help.tabIndex = -1; // no tab
            _this.help.type = "button";
            _this.help.innerHTML = "�";
            _this.handlers.push(system_events_3.SystemEvents.watch("speech-detected", function (value) {
                if (!_this.hasFocus())
                    return;
                var answer = _this.getAttribute("answer") || "";
                if (areEqual(value.result, answer)) {
                    _this.input.value = answer;
                    if (_this.validate()) {
                        _this.complete();
                    }
                }
                else {
                    if (value.result === "ayúdame") {
                        _this.hint();
                    }
                }
            }));
            return _this;
        }
        QaInput.prototype.hasFocus = function () {
            return hasFocus(this.input);
        };
        QaInput.prototype.complete = function () {
            this.handlers.forEach(function (v) { return v(); });
            this.domNode.classList.add("complete");
            this.tab();
        };
        QaInput.prototype.focus = function () {
            this.input.focus();
            this.play();
            system_events_3.SystemEvents.trigger("listen", { hint: this.getAttribute("answer") });
        };
        QaInput.prototype.hint = function () {
            this.score[1]++;
            system_events_3.SystemEvents.trigger("hint", { hint: this.getAttribute("answer") });
            system_events_3.SystemEvents.trigger("play", { es: this.getAttribute("answer"), avitar: "rita" });
            system_events_3.SystemEvents.trigger("listen", { hint: this.getAttribute("answer") });
        };
        QaInput.prototype.play = function () {
            document.title = this.getAttribute("question") || "?";
            system_events_3.SystemEvents.trigger("play", { es: this.getAttribute("answer") });
        };
        QaInput.prototype.rightAnswer = function () {
            this.score[0]++;
            system_events_3.SystemEvents.trigger("correct", { value: 1 });
        };
        QaInput.prototype.wrongAnswer = function () {
            this.score[1]++;
            system_events_3.SystemEvents.trigger("incorrect", { value: -1 });
            this.play();
        };
        QaInput.isMatch = function (a, b) {
            var A = a.toLowerCase();
            var B = b.toLowerCase();
            if (A === B)
                return true;
            switch (B) {
                case "á":
                    return A == "a";
                case "é":
                    return A == "e";
                case "í":
                    return A == "i";
                case "ñ":
                    return A == "n";
                case "ó":
                    return A == "o";
                case "ú":
                    return A == "u";
                case "¡":
                    return A == "!";
                case "¿":
                    return A == "?";
                case "’":
                    return A == "'";
                case ",":
                    return A == " ";
                default:
                    return false;
            }
        };
        QaInput.prototype.provideHelp = function () {
            var answer = this.getAttribute("answer") || "";
            var input = this.input;
            var currentValue = input.value;
            input.value = answer.substring(0, currentValue.length + 1);
        };
        QaInput.prototype.validate = function () {
            var answer = this.getAttribute("answer") || "";
            var input = this.input;
            var currentValue = input.value;
            if (answer.length === currentValue.length) {
                this.help.disabled = true;
                input.readOnly = true;
                input.classList.remove("wrong");
                input.classList.add("correct");
                var score = this.score[0];
                // bonus points if no mistakes
                if (this.score[1] == 0)
                    score += Math.max(50, Math.pow(1.2, this.score[0]));
                else
                    score -= this.score[1];
                if (score > 0) {
                    this.help.innerHTML = "+" + score + " \u2611";
                }
                else {
                    this.help.innerHTML = "\u2611";
                }
                system_events_3.SystemEvents.trigger("xp", { score: score, question: this.getAttribute("question") });
                system_events_3.SystemEvents.trigger("play", { es: this.getAttribute("answer"), avitar: "clara" });
                var priorScore = parseFloat(this.getAttribute("score") || "0");
                this.label.title = score + priorScore + "";
                return true;
            }
            return false;
        };
        QaInput.prototype.connectedCallback = function () {
            var _this = this;
            var input = this.input;
            var answer = this.getAttribute("answer") || "";
            var question = this.getAttribute("question") || "";
            var hint = this.getAttribute("hint") || "";
            var label = this.label;
            label.textContent = question;
            label.title = this.getAttribute("score") || "";
            input.maxLength = answer.length;
            input.onkeydown = function (ev) {
                // mapping.record(ev);
                try {
                    ev.preventDefault();
                    if (input.readOnly)
                        return;
                    switch (ev.keyCode) {
                        case 8: // backspace
                        case 9: // tab
                        case 13: // enter
                        case 16: // shift
                        case 17: // ctrl
                        case 18: // alt
                        case 46: // del
                            return false;
                        case 112: // F1
                            _this.hint();
                            return false;
                        case 113: // F2
                            _this.provideHelp();
                            if (_this.validate())
                                _this.complete();
                            return false;
                    }
                    var currentValue = input.value;
                    var expectedKey = answer[currentValue.length];
                    if (!ev.key || ev.key.length > 1) {
                        dump(ev);
                    }
                    var currentKey = ev.key || keydown_as_keypress_1.mapping.get(ev);
                    // if current key is "," pass next key so if user forgets
                    // the comma we can assume it and skip the next space
                    // "si, senor" == "si senor"
                    // also "?si" == "si", "!si" == "si"
                    // also "si, senor." == "sisenor"<enter>
                    // maybe auto-advance after "si" to "si " and eat the users " " if pressed.
                    if (QaInput.isMatch(currentKey, expectedKey)) {
                        input.value = answer.substring(0, currentValue.length + 1);
                        system_events_3.SystemEvents.trigger("play", { action: "stop" });
                        _this.rightAnswer();
                        if (_this.validate()) {
                            _this.complete();
                        }
                        return false;
                    }
                    else {
                        input.classList.add("wrong");
                        _this.wrongAnswer();
                    }
                    return false;
                }
                catch (ex) {
                    console_log_2.log(ex);
                }
            };
            var shadowRoot = this.attachShadow({ mode: "open" });
            shadowRoot.appendChild(label);
            label.appendChild(this.help);
            shadowRoot.appendChild(input);
            this.help.onclick = function () {
                _this.input.focus();
                system_events_3.SystemEvents.trigger("hint", { hint: answer });
            };
        };
        QaInput.prototype.tab = function () {
            var s = this;
            s = s.nextElementSibling();
            while (s && s.input.readOnly)
                s = s.nextElementSibling();
            // scan again from the top
            if (!s) {
                if (this.domNode.parentElement) {
                    if (this.domNode.parentElement.firstElementChild) {
                        s = webcomponent_3.getComponent(this.domNode.parentElement.firstElementChild);
                        while (s && s.input.readOnly)
                            s = s.nextElementSibling();
                    }
                }
            }
            if (!s) {
                system_events_3.SystemEvents.trigger("no-more-input", {});
                return;
            }
            setTimeout(function () { return s && s.focus(); }, 200);
        };
        return QaInput;
    }(webcomponent_3.WebComponent));
    exports.QaInput = QaInput;
    console.assert(!QaInput.isMatch("o", "á"));
});
define("quizlet/storage", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var LocalStorage = /** @class */ (function () {
        function LocalStorage() {
            this.data = this.upgrade();
        }
        LocalStorage.prototype.upgrade = function () {
            return {
                scoreboard: this.upgradeScoreboard()
            };
        };
        LocalStorage.prototype.upgradeScoreboard = function () {
            return JSON.parse(localStorage.getItem("scoreboard") || "{}");
        };
        LocalStorage.prototype.save = function () {
            localStorage.setItem("scoreboard", JSON.stringify(this.data.scoreboard));
        };
        LocalStorage.prototype.getScore = function (data) {
            return this.data.scoreboard[data.question] || 0;
        };
        LocalStorage.prototype.setScore = function (data) {
            this.data.scoreboard[data.question] = (this.data.scoreboard[data.question] || 0) + data.score;
            this.save();
        };
        return LocalStorage;
    }());
    exports.storage = new LocalStorage();
});
define("quizlet/qa-block", ["require", "exports", "quizlet/webcomponent", "quizlet/system-events", "quizlet/qa-input", "quizlet/fun", "quizlet/storage"], function (require, exports, webcomponent_4, system_events_4, qa_input_1, fun_1, storage_1) {
    "use strict";
    exports.__esModule = true;
    function score(question) {
        return storage_1.storage.getScore({ question: question });
    }
    var QaBlock = /** @class */ (function (_super) {
        __extends(QaBlock, _super);
        function QaBlock(domNode) {
            var _this = _super.call(this, domNode) || this;
            _this.load();
            return _this;
        }
        QaBlock.prototype.load = function () {
            var _this = this;
            var packet = this.getAttribute("packet");
            system_events_4.SystemEvents.watch("start", function () {
                require(["quizlet/packs/" + packet], function (data) {
                    var shadowRoot = _this.attachShadow({ mode: "open" });
                    var div = shadowRoot; // could create a div if real shadow
                    var qa = data.map(function (d) { return ({ a: d.a, q: d.q, score: score(d.q) }); });
                    var minScore = qa[0].score;
                    qa.forEach(function (d) { return (minScore = Math.min(minScore, d.score)); });
                    qa = qa.filter(function (d) { return d.score <= minScore + 100; });
                    if (qa.length > 10) {
                        qa = qa.slice(1, 10);
                    }
                    qa = fun_1.shuffle(qa).slice(0, 5);
                    var items = qa.map(function (item) {
                        var qaItem = document.createElement("qa-input");
                        qaItem.setAttribute("question", item.q);
                        qaItem.setAttribute("answer", item.a);
                        qaItem.setAttribute("score", item.score + "");
                        var input = new qa_input_1.QaInput(qaItem);
                        div.appendChild(qaItem);
                        input.connectedCallback();
                        return input;
                    });
                    var input = items[0];
                    input && input.focus();
                });
            });
        };
        return QaBlock;
    }(webcomponent_4.WebComponent));
    exports.QaBlock = QaBlock;
});
define("quizlet/player", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var avitars = {
        "default": {
            rate: 1,
            pitch: 1
        },
        sara: {
            rate: 1.14,
            pitch: 0.81
        },
        pati: {
            rate: 0.9,
            pitch: 0.4
        },
        rita: {
            rate: 1.1,
            pitch: 0.45
        },
        cielo: {
            rate: 0.9,
            pitch: 0.8
        },
        clara: {
            rate: 1.1,
            pitch: 1.1
        }
    };
    var Player = /** @class */ (function () {
        function Player() {
            this.audio = new Audio();
            this.synth = new SpeechSynthesisUtterance();
            this.rate = 1;
            this.pitch = 1;
        }
        Player.prototype.stop = function () {
            window.speechSynthesis.cancel();
        };
        Player.prototype.play = function (text) {
            this.synth.volume = 1;
            if (text.avitar) {
                var avitar = avitars[text.avitar] || avitars["default"];
                this.synth.rate = avitar.rate;
                this.synth.pitch = avitar.pitch;
            }
            else {
                this.rate = 1.5 - 0.5 * Math.random();
                this.pitch = 1.2 - 1.0 * Math.random();
                this.synth.rate = this.rate;
                this.synth.pitch = this.pitch;
            }
            //log(`pitch: ${this.synth.pitch}, rate: ${this.synth.rate}`);
            if (text.en) {
                this.synth.lang = "en-US";
                this.synth.text = text.en;
                window.speechSynthesis.speak(this.synth);
            }
            else if (text.es) {
                this.synth.lang = "es-US";
                this.synth.text = text.es;
                window.speechSynthesis.speak(this.synth);
            }
        };
        return Player;
    }());
    exports.player = new Player();
});
define("quizlet/main", ["require", "exports", "quizlet/score-board", "quizlet/qa-input", "quizlet/qa-block", "quizlet/webcomponent", "quizlet/system-events", "quizlet/console-log", "quizlet/storage", "quizlet/player", "quizlet/listener"], function (require, exports, score_board_1, qa_input_2, qa_block_1, webcomponent_5, system_events_5, console_log_3, storage_2, player_1, listener_1) {
    "use strict";
    exports.__esModule = true;
    function from(nodes) {
        var result = [];
        for (var i = 0; i < nodes.length; i++) {
            result[i] = nodes.item(i);
        }
        return result;
    }
    function visit(node, cb) {
        if (!cb(node))
            return;
        from(node.children).forEach(function (n) { return visit(n, cb); });
    }
    function showHint(hint) {
        var h;
        from(document.getElementsByTagName("hint-slider")).forEach(function (n) {
            h && clearTimeout(h);
            n.innerHTML = hint;
            n.classList.add("visible");
            n.classList.remove("hidden");
            h = setTimeout(function () {
                n.classList.remove("visible");
                n.classList.add("hidden");
            }, Math.max(2000, hint.length * 500));
        });
    }
    {
        var mods_1 = {
            "console-log": console_log_3.ConsoleLog,
            "qa-input": qa_input_2.QaInput,
            "qa-block": qa_block_1.QaBlock,
            "score-board": score_board_1.ScoreBoard
        };
        visit(document.body, function (node) {
            var className = node.tagName.toLowerCase();
            if (mods_1[className]) {
                var C = mods_1[className];
                var c = new C(node);
                c.connectedCallback();
            }
            return true;
        });
        // fade the screen before beginning
        setTimeout(function () { return system_events_5.SystemEvents.trigger("start", {}); }, 200);
    }
    var correct = 0;
    var incorrect = 0;
    function score(add) {
        if (0 > add)
            incorrect -= add;
        else
            correct += add;
        var elements = from(document.getElementsByTagName("score-board"));
        elements.forEach(function (e) {
            var score = webcomponent_5.getComponent(e);
            score && score.setAttribute("score", Math.round(100 * (correct / (correct + incorrect))) + "");
        });
    }
    system_events_5.SystemEvents.watch("correct", function () { return score(1); });
    system_events_5.SystemEvents.watch("incorrect", function () { return score(-1); });
    system_events_5.SystemEvents.watch("hint", function (result) {
        showHint(result.hint);
    });
    system_events_5.SystemEvents.watch("no-more-input", function () {
        document.body.classList.add("hidden");
        setTimeout(function () { return location.reload(); }, 2000);
    });
    system_events_5.SystemEvents.watch("xp", function (result) {
        storage_2.storage.setScore(result);
    });
    system_events_5.SystemEvents.watch("play", function (data) {
        if (data.action === "stop") {
            player_1.player.stop();
            return;
        }
        player_1.player.play(data);
    });
    system_events_5.SystemEvents.watch("listen", function () {
        listener_1.listener.listen();
    });
    system_events_5.SystemEvents.watch("speech-detected", function (result) {
        showHint(result.result);
    });
});
//SystemEvents.watch("hint", (data: { hint: string }) => player.play({ en: data.hint }));
define("verbos/haber", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.verbo = {
        en: "to have",
        es: "haber",
        yo: "he",
        tu: "has",
        nosotros: "hemos"
    };
    // applicable infinitives
    exports.infinitives = [
        { es: "comido", en: "eaten" },
        { es: "ido", en: "gone" },
        { es: "leido", en: "read" },
        { es: "dormido", en: "slept" },
        { es: "hecho", en: "done" }
    ];
    // applicable sentence templates
    exports.builder = [
        { es: "Yo he {verb}.", en: "I have {verb}." },
        { es: "Tú has {verb}?", en: "Have you {verb}?" },
        { es: "No hemos {verb}.", en: "We have not {verb}." }
    ];
});
define("verbos/poder", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.verbo = {
        en: "can",
        es: "poder",
        yo: "puedo",
        tu: "puedes",
        nosotros: "podemos"
    };
    // applicable infinitives
    exports.infinitives = [
        { es: "comer", en: "eat" },
        { es: "ir", en: "go" },
        { es: "leer", en: "read" },
        { es: "dormir", en: "sleep" },
        { es: "hacer", en: "do" }
    ];
    // applicable sentence templates
    exports.builder = [
        { es: "Puedo {verb}.", en: "I can {verb}." },
        { es: "¿Puedes {verb}?", en: "Can you {verb}?" },
        { es: "No podemos {verb}.", en: "We cannot {verb}." }
    ];
});
define("verbos/querer", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.verbo = {
        en: "to want",
        es: "querer",
        yo: "quiero",
        tu: "quieres",
        nosotros: "queremos"
    };
    // applicable infinitives
    exports.infinitives = [
        { es: "comer", en: "eat" },
        { es: "ir", en: "go" },
        { es: "leer", en: "read" },
        { es: "dormir", en: "sleep" },
        { es: "hacer", en: "do" }
    ];
    // applicable sentence templates
    exports.builder = [
        { es: "Yo quiero {verb}.", en: "I want to {verb}." },
        { es: "Quieres {verb}?", en: "Do you want to {verb}?" },
        { es: "No queremos {verb}.", en: "We do not want to {verb}." }
    ];
});
define("verbos/tener", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    // verb forms
    exports.verbo = {
        en: "to have",
        es: "tener",
        yo: "tengo",
        tu: "tienes",
        nosotros: "tenemos"
    };
    // applicable infinitives
    exports.infinitives = [
        { es: "comer", en: "eat" },
        { es: "ir", en: "go" },
        { es: "leer", en: "read" },
        { es: "dormir", en: "sleep" },
        { es: "hacer", en: "do" }
    ];
    // applicable sentence templates
    exports.builder = [
        { es: "Tengo que {verb}.", en: "I have to {verb}." },
        { es: "¿Tienes que {verb}?", en: "Do you have to {verb}?" },
        { es: "No tenemos que {verb}.", en: "We do not have to {verb}." }
    ];
});
define("sentences/opuesto", ["require", "exports"], function (require, exports) {
    "use strict";
    var builder = function (data) {
        var en = data.en, es = data.es;
        return {
            es: es[0] + " y " + es[1],
            en: en[0] + " and " + en[1]
        };
    };
    var opuestos = [
        {
            es: ["arriba", "abajo"],
            en: ["up", "down"]
        },
        {
            es: ["atrás", "adelante"],
            en: ["behind", "ahead"]
        },
        {
            es: ["caliente", "frio"],
            en: ["hot", "cold"]
        },
        {
            es: ["corre", "camina"],
            en: ["run", "walk"]
        },
        {
            es: ["Mi padre", "Mi madre."],
            en: ["My father", "My mother"]
        },
        {
            es: ["Mi hermana", "Mi Hermano"],
            en: ["My sister", "My brother"]
        },
        {
            es: ["Mi abuelo", "Mi abuela"],
            en: ["My grandfather", "My grandmother"]
        },
        {
            es: ["Mi esposo", "Mi esposa"],
            en: ["My husband", "My wife"]
        },
        {
            es: ["Mi hija", "Mi hijo"],
            en: ["My daughter", "My son"]
        },
        { es: ["dentro", "fuera"], en: ["inside", "outside"] }
    ];
    return opuestos.map(builder);
});
define("sentences/index", ["require", "exports", "sentences/opuesto"], function (require, exports, opuesto_1) {
    "use strict";
    opuesto_1 = __importDefault(opuesto_1);
    var baseline = [
        { es: "Mi papá ama las papas.", en: "My dad loves potatoes." },
        { es: "¿nos vamos?", en: "Are we going?" },
        { es: "¿Eres un hijo de Dios?", en: "Are you a child of God?" },
        { es: "¿Vas a ir?", en: "Are you going?" },
        { es: "¿Vas a comer?", en: "Are you going to eat?" },
        { es: "¿Estás jubilado?", en: "Are you retired?" },
        { es: "¿Eres el pastor?", en: "Are you the pastor?" },
        { es: "¡Adiós! ¡Gracias por todo!", en: "Bye! Thanks for everything!" },
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
        { es: "Todas las personas necesitan a Jesús.", en: "Every person needs Jesus." },
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
        { es: "Voy a hablar con el dueño.", en: "I am going to talk to the owner." },
        { es: "No voy al café", en: "I am not going to the café." },
        { es: "No voy.", en: "I am not going." },
        { es: "No cantaré sin él.", en: "I will not sing without him." },
        { es: "Estoy cantando hoy.", en: "I am singing today." },
        { es: "soy tu amigo.", en: "I am your friend." },
        { es: "Yo hablo inglés.", en: "I speak English." },
        { es: "No como queso.", en: "I do not eat cheese." },
        { es: "Yo no como pescado vivo.", en: "I do not eat live fish." },
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
        { es: "Me gusta beber agua.", en: "I like to drink water." },
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
        { es: "Necesito ayuda, por favor.", en: "I need help, please." },
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
        { es: "Gracia por todo.", en: "Thank you for everything." },
        { es: "Gracias por cantar.", en: "Thank you for singing." },
        { es: "Gracias por estudiar conmigo.", en: "Thank you for studying with me." },
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
        { es: "Vivimos por la fe.", en: "We live by faith." },
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
        { es: "Quiero.", en: "I want." },
        { es: "Si yo quiero.", en: "Yes I want to." },
        { es: "Si, gracias.", en: "Yes, thank you." },
        { es: "Sí, tienes que ir conmigo.", en: "Yes, you need to go with me." },
        { es: "Lo hiciste muy bien.", en: "You did very well." },
        { es: "Tu madre canta bien.", en: "Your mom sings well." },
        { es: "te gusta tu comida?", en: "do you like your food?" },
        {
            es: "Dime con quién andas y te diré quién eres.",
            en: "Tell me who your friends are and I will tell you who you are."
        },
        { es: "¿cuál es la diferencia?", en: "what is the difference?" }
    ];
    var sentences = baseline.concat(opuesto_1["default"]);
    return sentences;
});
define("quizlet/qa", ["require", "exports", "verbos/haber", "verbos/poder", "verbos/querer", "verbos/tener", "sentences/index", "quizlet/storage", "quizlet/fun"], function (require, exports, haber_1, poder_1, querer_1, tener_1, index_1, storage_3, fun_2) {
    "use strict";
    index_1 = __importDefault(index_1);
    function build(infinitives, builder) {
        var qa = [];
        infinitives.forEach(function (verb) {
            builder.forEach(function (b) {
                return qa.push({
                    a: b.es.replace("{verb}", verb.es),
                    q: b.en.replace("{verb}", verb.en)
                });
            });
        });
        return qa;
    }
    var haberQa = build(haber_1.infinitives, haber_1.builder);
    var poderQa = build(poder_1.infinitives, poder_1.builder);
    var quererQa = build(querer_1.infinitives, querer_1.builder);
    var tenerQa = build(tener_1.infinitives, tener_1.builder);
    var verbs = {
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
    var places = {
        "a casa": "home"
    };
    var colors = {
        anaranjado: "orange",
        azul: "blue",
        rojo: "red",
        verde: "green",
        negro: "black",
        marrón: "brown",
        rosado: "pink",
        amarillo: "yellow"
    };
    var nouns = {
        "una casa": "a house",
        "esa casa": "that house",
        "otra casa": "another house",
        "una bicicleta": "a bike",
        "una caminata": "a hike",
        "un libro": "a book",
        "una persona": "a person"
    };
    var adjectives = {
        rápido: "fast",
        "más rápido": "faster",
        "lo más rápido": "fastest"
    };
    var numbers = {
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
        var num = randomNumber();
        var es = noun.es;
        var en = noun.en;
        if (fun_2.endsWith(es, "a"))
            es += "s";
        else if (fun_2.endsWith(es, "e"))
            es += "s";
        else if (fun_2.endsWith(es, "i"))
            es += "s";
        else if (fun_2.endsWith(es, "o"))
            es += "s";
        else if (fun_2.endsWith(es, "u"))
            es += "s";
        else if (fun_2.endsWith(es, "z"))
            es = es.substring(0, es.length - 1) + "ces";
        else
            es += "es";
        if (fun_2.startsWith(es, "el ")) {
            es = "los" + es.substring(2);
            en += " (plural)";
        }
        else if (fun_2.startsWith(es, "tú ")) {
            es = "ustedes" + es.substring(2);
            en += " (plural)";
        }
        else if (fun_2.startsWith(es, "esa ")) {
            es = "esas" + es.substring(3);
            en += " (plural)";
        }
        else if (fun_2.startsWith(es, "usted ")) {
            es = "ustedes" + es.substring(5);
            en += " (plural)";
        }
        else if (fun_2.startsWith(es, "un ")) {
            es = num.es + es.substring(2);
            en = noun.en + " (" + num.en + " of them)";
        }
        else if (fun_2.startsWith(es, "una ")) {
            es = num.es + es.substring(3);
            en = noun.en + " (" + num.en + " of them)";
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
        var keys = Object.keys(list);
        var index = Math.round(Math.random() * (keys.length - 1));
        var es = keys[index];
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
    var QA = [
        { a: "voy", q: "I go" },
        { a: "voy a", q: "I will" },
        { a: "yo necesito", q: "I need" },
        { a: "tú necesitas", q: "you need" },
        { a: "me gusta", q: "I like" },
        { a: "nosotros necesitamos", q: "we need" },
        { a: "necesito {verb}", q: "I need to {verb}" },
        { a: "necesito {noun}", q: "I need {noun}" },
        { a: "necesito {verb} por favor", q: "I need to {verb} please" },
        { a: "necesito {noun} por favor", q: "I need {noun} please" },
        { a: "necesitas {verb}", q: "you need to {verb}" },
        { a: "necesitas {noun}", q: "you need {noun}" },
        { a: "necesitamos {noun}", q: "we need {noun}" },
        { a: "necesitamos {verb}", q: "we need to {verb}" },
        { a: "me gusta {verb}", q: "I like to {verb}" },
        { a: "me gusta {noun}", q: "I like {noun}" },
        { a: "te gusta {verb}", q: "you like to {verb}" },
        { a: "te gusta {noun}", q: "you like {noun}" },
        { a: "me gustaría {verb}", q: "I would like to {verb}" },
        { a: "me gustaría {noun}", q: "I would like {noun}" },
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
        { a: "nosotros queremos {verb} en otro {noun} {color}", q: "we want to {verb} at {noun} that is {color}" },
        { a: "ellos quieren {verb} {noun} {adjective}", q: "they want to {verb} {noun} {adjective}" },
        { a: "es dos mas pequeño que cinco?", q: "is two smaller than five?" },
        { a: "es {number} mas pequeño que {number}?", q: "is {number} smaller than {number}?" },
        { a: "es {number} mas mayor que {number}?", q: "is {number} larger than {number}?" },
        { a: "Tengas una buena mañana", q: "have a good morning" },
        { a: "¡Que tengas una buena semana!", q: "you have a good week!" }
    ];
    // dropping QA temporarily
    var qa = index_1["default"].map(function (v) { return ({ a: v.es, q: v.en }); }).concat(haberQa, poderQa, quererQa, tenerQa);
    var questions = qa.map(function (item) {
        var q = item.q;
        var a = item.a;
        while (true) {
            var verb = randomVerb();
            var noun = randomNoun();
            var place = randomPlace();
            var num = randomNumber();
            var pluralNoun = pluralizeNoun(randomNoun());
            var adjective = randomAdjective();
            var color = randomColor();
            var q2 = q
                .replace("{verb}", verb.en)
                .replace("{plural-noun}", pluralNoun.en)
                .replace("{noun}", noun.en)
                .replace("{place}", place.en)
                .replace("{color}", color.en)
                .replace("{adjective}", adjective.en)
                .replace("{number}", num.en);
            var a2 = a
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
        return { q: q, a: a };
    });
    function remove(v, chars) {
        var result = v;
        chars.split("").forEach(function (c) { return (result = result.replace(new RegExp("\\" + c, "g"), "")); });
        result = result.replace(/  /g, " ");
        return result;
    }
    function spacesIn(v) {
        var result = 0;
        for (var i = 0; i < v.length; i++)
            if (v.charAt(i) === " ")
                result++;
        return result;
    }
    var scores = questions
        //.sort((a, b) => (a.a < b.a ? -1 : 0))
        //.sort((a, b) => spacesIn(a.a) - spacesIn(b.a))
        .map(function (v) {
        var _a = [remove(v.q, "!."), remove(v.a, "!.¿¡")], q = _a[0], a = _a[1];
        var hint = v.q; // english
        var score = storage_3.storage.getScore({ question: q });
        return { q: q, a: a, score: score, hint: hint };
    });
    scores = scores.sort(function (a, b) { return b.score - a.score; });
    // exclude items that exceed the worst score by 100 points
    var minScore = scores[scores.length - 1].score;
    scores = scores.filter(function (s) { return s.score < minScore + 100; });
    // skip the top scorer, take the next 10 best, scramble and return 5
    scores = scores.slice(1, 11);
    scores = fun_2.shuffle(scores);
    return scores.slice(0, 5);
});
define("quizlet/packs/dialog", ["require", "exports"], function (require, exports) {
    "use strict";
    var dialog = [
        { es: "Hola, como está usted?", en: "Hello, how are you?" },
        { es: "Hola, cómo estás?", en: "Hello, how are you?" },
        { es: "Como está ella?", en: "How is she?" },
        { es: "Hola, buenos días.", en: "Hello, good morning." },
        { es: "Buenas tardes.", en: "Good afternoon." },
        { es: "Buenas noches", en: "Good night." },
        { es: "Estoy bien. Gracias.", en: "I'm fine. Thank you." },
        { es: "Y usted?", en: "And you?" },
        { es: "Estoy bien también.", en: "I am fine too." },
        { es: "De nada.", en: "You're welcome." },
        { es: "Ella está bien.", en: "She is fine." },
        { es: "él está bien.", en: "He is fine." },
        { es: "Estoy cansado.", en: "I am tired." },
        { es: "Ella está cansada.", en: "She is tired." },
        { es: "El está cansado", en: "He is tired." },
        { es: "Usted está cansado.", en: "You are tired." },
        { es: "Tú hablas español?", en: "Do you speak spanish?" },
        { es: "Si, yo hablo español.", en: "Yes, I speak english." },
        { es: "Por favor, no.", en: "Please, no." },
        { es: "Si, Gracias.", en: "Yes, please." },
        { es: "Disculpe", en: "Excuse me." },
        { es: "Mucho gusto.", en: "Nice to meet you." },
        { es: "El baño está aqui.", en: "The bathroom is here." },
        { es: "Una calle.", en: "A street." },
        { es: "Una mesa para dos, por favor.", en: "A table for two, please." },
        { es: "Yo tengo un hermano.", en: "I have a brother" },
        { es: "Mi familia es interesante", en: "My family is interesting." },
        { es: "Yo vivo aqui", en: "I live here" },
        { es: "Mi esposa es inteligente", en: "My wife is intelligent." },
        { es: "Tú tienes un gato?", en: "Do you have a cat?" },
        { es: "Es esta tu casa y tu perro?", en: "Is that your house and your dog?" },
        { es: "Mi perro es grande y muy bonito", en: "By dog is big and very pretty" },
        { es: "Mi hermano y mi hermana son interesante.", en: "My brother and my sister are interesting." },
        { es: "Ella tiene un gato", en: "She has a cat" },
        { es: "Un esposo y una esposa", en: "a husband and a wife" },
        { es: "Yo tengo un hermano y una hermana.", en: "I have a brother and a sister." },
        { es: "Yo necesito la cuenta.", en: "I need the check." },
        { es: "el sándwich", en: "the sandwich" },
        { es: "la carne", en: "the meat" },
        { es: "un café sin azúcar", en: "a coffee without sugar" },
        { es: "un jugo de naranja, por favor", en: "one orange juice please" },
        { es: "yo quiero pagar la cuenta.", en: "I want to pay the check." },
        { es: "sin azucar, por favor", en: "without sugar, please" },
        { es: "un vaso de agua, por favor.", en: "a glass of water, please" },
        { es: "una hamburguesa de pescado.", en: "A fish burger." },
        { es: "sin sal, por favor", en: "without salt, please" },
        { es: "una ensalada, por favor", en: "a salad, please" },
        { es: "un sándwich de pescado", en: "a fish sandwich" },
        { es: "una taza y un vaso", en: "a cup and a glass" },
        { es: "con o sin azúcar", en: "with or without sugar?" },
        { es: "yo quiero comprar una camisa", en: "I want to buy a shirt" },
        { es: "una camiseta es una camisa", en: "A t-shirt is a shirt" },
        { es: "Si, este sombrero", en: "Yes, this hat" },
        { es: "No, ese sombrero.", en: "No, that hat." },
        { es: "Un sombrero barato", en: "A cheap hat" },
        { es: "el cinturon", en: "the belt" },
        { es: "un regalo para mi esposa.", en: "A gift for my wife." },
        { es: "el reloj", en: "the watch" },
        { es: "Demasiado gris.", en: "Too gray" },
        { es: "Mi tienda favorita.", en: "My favorite store." },
        { es: "Una pregunta interesante", en: "An interesting question." },
        { es: "Yo leo con mi maestro", en: "I read with my teacher" },
        { es: "Yo no soy estudiante", en: "I am not a student" },
        { es: "Yo soy de España", en: "I am from Spain" },
        { es: "Lo siento, estoy mal", en: "I am sorry, I'm not well" },
        { es: "Tú usas el carro?", en: "Do you use the car?" },
        { es: "Señor, usted usa el teléfone?", en: "Sir, are you using the telephone?" },
        { es: "Yo necesito mi boleto.", en: "I need my ticket." },
        { es: "Ella tiene una maleta.", en: "She has a suitcase." },
        { es: "Usted tiene una carera?", en: "Do you have a purse?" },
        { es: "Quién habla español?", en: "Who speaks spanish?" },
        { es: "Quién come una ensalada?", en: "Who is eating a salad?" },
        { es: "La mujer vive en Inglaterra.", en: "The woman lives in England." },
        { es: "Ella es una mujer joven.", en: "She is a young woman." },
        { es: "Tú tienes mi dirección?", en: "Do you have my address?" },
        { es: "Señor, yo tengo una pregunta.", en: "Sir, I have a question." },
        { es: "La mujer italiana es mi madre.", en: "The italian woman is my mother." },
        { es: "Vives en una ciudad pequeña?", en: "Do you live in a small city?" }
    ];
    return dialog.map(function (q) { return ({ a: q.es, q: q.en }); });
});
define("verbos/index", ["require", "exports"], function (require, exports) {
    "use strict";
    var tenses = [
        {
            ar: {
                yo: "o",
                tú: "as",
                él: "a",
                nosotros: "amos"
            },
            er: {
                yo: "o",
                tú: "es",
                él: "e",
                nosotros: "imos"
            },
            ir: {
                yo: "o",
                tú: "es",
                él: "e",
                nosotros: "imos"
            }
        },
        {
            ar: {
                yo: "aba",
                tú: "abas",
                él: "aba",
                nosotros: "ábamos"
            },
            er: {
                yo: "ía",
                tú: "ías",
                él: "ía",
                nosotros: "íamos"
            },
            ir: {
                yo: "ía",
                tú: "ías",
                él: "ía",
                nosotros: "íamos"
            }
        },
        {
            ar: {
                yo: "é",
                tú: "aste",
                él: "ó",
                nosotros: "amos"
            },
            er: {
                yo: "í",
                tú: "iste",
                él: "ió",
                nosotros: "imos"
            },
            ir: {
                yo: "í",
                tú: "iste",
                él: "ió",
                nosotros: "ímos"
            }
        },
        {
            ar: {
                yo: "aré",
                tú: "arás",
                él: "ara",
                nosotros: "aremos"
            },
            er: {
                yo: "eré",
                tú: "erás",
                él: "era",
                nosotros: "eremos"
            },
            ir: {
                yo: "iré",
                tú: "irás",
                él: "ira",
                nosotros: "iremos"
            }
        }
    ];
    var tenses_en = [
        {
            yo: "I",
            tú: "you",
            él: "he",
            nosotros: "we"
        },
        {
            yo: "I used to",
            tú: "you used to",
            él: "he used to",
            nosotros: "we used to"
        },
        {
            yo: "I did",
            tú: "you did",
            él: "he did",
            nosotros: "we did"
        },
        {
            yo: "I will",
            tú: "you will",
            él: "he will",
            nosotros: "we will"
        }
    ];
    function regular(infinitive, en_base) {
        if (!infinitive)
            throw "must provide a spanish infinitive";
        if (!en_base.infinitive)
            throw "must provide an english infinitive";
        var ch2 = infinitive.substring(infinitive.length - 2).toLowerCase();
        var base = infinitive.substring(0, infinitive.length - 2);
        en_base.i = en_base.i || en_base.infinitive;
        en_base.you = en_base.you || en_base.i;
        en_base.he = en_base.he || en_base.you + "s";
        en_base.we = en_base.we || en_base.you;
        en_base.ing = en_base.ing || en_base.infinitive + "ing";
        var postfix = tenses[0][ch2];
        var en = tenses_en[0];
        var result = [
            {
                i: { es: infinitive, en: "to " + en_base.infinitive },
                yo: { es: "yo " + (base + postfix.yo), en: en.yo + " " + en_base.i },
                tú: { es: "tu " + (base + postfix.tú), en: en.tú + " " + en_base.you },
                él: { es: "\u00E9l " + (base + postfix.él), en: en.él + " " + en_base.he },
                nosotros: { es: "nosotros " + (base + postfix.nosotros), en: en.nosotros + " " + en_base.we }
            }
        ];
        return result;
        for (var tense = 1; tense < tenses.length; tense++) {
            var postfix_1 = tenses[tense][ch2];
            var en_1 = tenses_en[tense];
            result.push({
                i: { es: infinitive, en: "to " + en_base.infinitive },
                yo: { es: base + postfix_1.yo, en: en_1.yo + " " + en_base.infinitive },
                tú: { es: base + postfix_1.tú, en: en_1.tú + " " + en_base.infinitive },
                él: { es: base + postfix_1.él, en: en_1.él + " " + en_base.infinitive },
                nosotros: { es: base + postfix_1.nosotros, en: en_1.nosotros + " " + en_base.infinitive }
            });
        }
        if (en_base.ing) {
            var ndo = base;
            switch (ch2) {
                case "ar":
                    ndo += "ando";
                    break;
                default:
                    ndo += "iendo";
            }
            result.push({
                i: { es: infinitive, en: "to " + en_base.infinitive },
                yo: { es: "estoy " + ndo, en: "I am " + en_base.ing },
                tú: { es: "estas " + ndo, en: "You are " + en_base.ing },
                él: { es: "\u00E9l est\u00E1 " + ndo, en: "He is " + en_base.ing },
                nosotros: { es: "estamos " + ndo, en: "We are " + en_base.we }
            });
        }
        return result;
    }
    var verbos = [
        {
            i: { es: "ir", en: "to go" },
            yo: { es: "voy", en: "I go" },
            tú: { es: "vas", en: "you go" },
            él: { es: "va", en: "he goes" },
            nosotros: { es: "vemos", en: "we go" },
            he: { es: "ido", en: "I have gone" },
            has: { es: "ido", en: "you have gone" },
            hemos: { es: "ido", en: "we have gone" }
        },
        {
            i: { es: "ser", en: "to be" },
            yo: { es: "soy", en: "I am" },
            tú: { es: "eres", en: "you are" },
            él: { es: "es", en: "he is" },
            nosotros: { es: "somos", en: "we are" },
            he: { es: "sido", en: "I have been" },
            has: { es: "sido", en: "you have been" },
            hemos: { es: "sido", en: "we have been" }
        },
        {
            i: { es: "estar", en: "to be" },
            yo: { es: "estoy", en: "I am" },
            tú: { es: "estás", en: "you are" },
            él: { es: "está", en: "he is" },
            nosotros: { es: "estamos", en: "we are" },
            he: { es: "estado", en: "I have been" },
            has: { es: "estado", en: "you have been" },
            hemos: { es: "estado", en: "we have been" }
        },
        {
            i: { es: "tener", en: "to have" },
            yo: { es: "tengo", en: "I have" },
            tú: { es: "tienes", en: "you have" },
            él: { es: "tiene", en: "he has" },
            nosotros: { es: "tienemos", en: "we have" },
            he: { es: "tenido", en: "I have had" },
            has: { es: "tenido", en: "you have had" },
            hemos: { es: "tenido", en: "we had" }
        },
        {
            i: { es: "decir", en: "to say" },
            yo: { es: "yo digo", en: "I say" },
            tú: { es: "tú dices", en: "you say" },
            él: { es: "él dice", en: "he says" },
            ella: { es: "ella dice", en: "she says" },
            nosotros: { es: "nosotros dicimos", en: "we say" },
            he: { es: "he dicho", en: "I have said" },
            has: { es: "has dicho", en: "you have said" },
            hemos: { es: "hemos dicho", en: "we have said" }
        }
    ];
    return verbos.concat(regular("caminar", { infinitive: "walk" }), regular("correr", { infinitive: "run", ing: "running" }), regular("escribir", { infinitive: "write", ing: "writing" }), regular("escuchar", { infinitive: "listen" }), regular("descubrir", { infinitive: "discover" }), regular("dormir", { infinitive: "sleep" }), regular("comer", { infinitive: "eat" }));
});
define("quizlet/packs/has-packet", ["require", "exports", "verbos/index"], function (require, exports, index_2) {
    "use strict";
    index_2 = __importDefault(index_2);
    return index_2["default"].filter(function (v) { return !!v.has; }).map(function (v) { return ({ q: v.has.en, a: "has " + v.has.es }); });
});
define("quizlet/packs/he-packet", ["require", "exports", "verbos/index"], function (require, exports, index_3) {
    "use strict";
    index_3 = __importDefault(index_3);
    return index_3["default"].filter(function (v) { return !!v.he; }).map(function (v) { return ({ q: v.he.en, a: "he " + v.he.es }); });
});
define("quizlet/packs/hemos-packet", ["require", "exports", "verbos/index"], function (require, exports, index_4) {
    "use strict";
    index_4 = __importDefault(index_4);
    return index_4["default"].filter(function (v) { return !!v.hemos; }).map(function (v) { return ({ q: v.hemos.en, a: "hemos " + v.hemos.es }); });
});
define("quizlet/packs/n\u00FAmeros-packet", ["require", "exports", "quizlet/packs/nums"], function (require, exports, nums_2) {
    "use strict";
    var qa = nums_2.nums.map(function (v) { return ({ a: v.es, q: v.en }); });
    // move to "math" pack
    if (false) {
        [1, 2, 5].forEach(function (a) {
            return [0, 0, 0]
                .map(function (v) { return Math.floor((nums_2.nums.length - a) * Math.random()); })
                .forEach(function (b) {
                return qa.push({
                    a: nums_2.nums[a].es + " m\u00E1s " + nums_2.nums[b].es + " son " + nums_2.nums[a + b].es,
                    q: nums_2.nums[a].en + " plus " + nums_2.nums[b].en + " are " + nums_2.nums[a + b].en
                });
            });
        });
    }
    return qa;
});
define("quizlet/packs/yo-packet", ["require", "exports", "verbos/index"], function (require, exports, index_5) {
    "use strict";
    index_5 = __importDefault(index_5);
    return index_5["default"].map(function (v) { return ({ q: v.yo.en, a: v.yo.es }); });
});
define("quizlet/packs/t\u00FA-packet", ["require", "exports", "verbos/index"], function (require, exports, index_6) {
    "use strict";
    index_6 = __importDefault(index_6);
    return index_6["default"].map(function (v) { return ({ q: v.tú.en, a: v.tú.es }); });
});
define("quizlet/packs/\u00E9l-packet", ["require", "exports", "verbos/index"], function (require, exports, index_7) {
    "use strict";
    index_7 = __importDefault(index_7);
    return index_7["default"].map(function (v) { return ({ q: v.él.en, a: v.él.es }); });
});
define("quizlet/packs/nosotros-packet", ["require", "exports", "verbos/index"], function (require, exports, index_8) {
    "use strict";
    index_8 = __importDefault(index_8);
    return index_8["default"].map(function (v) { return ({ q: v.nosotros.en, a: v.nosotros.es }); });
});
define("quizlet/packs/pronoun-packet", ["require", "exports", "quizlet/packs/yo-packet", "quizlet/packs/t\u00FA-packet", "quizlet/packs/\u00E9l-packet"], function (require, exports, yo_packet_1, t__packet_1, _l_packet_1) {
    "use strict";
    yo_packet_1 = __importDefault(yo_packet_1);
    t__packet_1 = __importDefault(t__packet_1);
    _l_packet_1 = __importDefault(_l_packet_1);
    var pronouns = [
        { en: "I", es: "yo" },
        { en: "you", es: "tú" },
        { en: "he", es: "él" },
        { en: "she", es: "ella" },
        { en: "it", es: "ello" },
        { en: "we", es: "nosotros" },
        { en: "they are", es: "ellos" },
        { en: "they are (f)", es: "ellas" }
    ];
    var qa = pronouns.map(function (v) { return ({ a: v.es, q: v.en }); }).concat(yo_packet_1["default"], t__packet_1["default"], _l_packet_1["default"]); //, nosotros, he, hemos);
    return qa;
});
define("sustantivo/index", ["require", "exports", "quizlet/fun"], function (require, exports, fun_3) {
    "use strict";
    return [
        { es: "gato", en: "cat" },
        { es: "perro", en: "dog" },
        { es: "árbol", en: "tree" },
        { es: "cielo", en: "heaven" },
        { es: "tierra", en: "earth" },
        { es: "cruz", en: "cross" },
        { es: "cuerpo", en: "body" },
        { es: "sepulcro", en: "grave" },
        { es: "estruendo", en: "roar" },
        { es: "rostro", en: "face" },
        { es: "Dios", en: "God" },
        { es: "amanecer", en: "dawn" },
        { es: "muerte", en: "death" }
    ].map(function (v) { return ({ es: fun_3.forceGender(v.es), en: "the " + v.en }); });
});
define("quizlet/packs/sustantivo-packet", ["require", "exports", "sustantivo/index"], function (require, exports, index_9) {
    "use strict";
    index_9 = __importDefault(index_9);
    return index_9["default"].map(function (v) { return ({ q: v.en, a: v.es }); });
});
define("quizlet/packs/question-packet", ["require", "exports"], function (require, exports) {
    "use strict";
    return [
        { a: "¿Quién eres tú?", q: "who are you?" },
        { a: "¿Que eres?", q: "what are you?" },
        { a: "¿Dónde estás?", q: "Where are you?" },
        { a: "¿Cuándo corres?", q: "When will you run?" },
        { a: "¿Por qué caminas?", q: "Why do you walk?" },
        { a: "¿Con o sin?", q: "With or without?" },
        { a: "Quándo?", q: "When?" },
        { a: "Lunes o Martes?", q: "Monday or Tuesday?" },
        { a: "Miercoles o Jueves?", q: "Wednesday or Thursday?" },
        { a: "Viernes y Sábado o Domingo", q: "Friday and Saturday or Sunday" },
        { a: "El partido es mañana", q: "The game is tomorrow" },
        { a: "El español es divertido.", q: "Spanish is fun." },
        { a: "Feliz fin de semana!", q: "Happy weekend!" },
        { a: "Disfruta el viernes!", q: "Enjoy your Friday!" },
        { a: "", q: "" },
        { a: "", q: "" },
        { a: "", q: "" },
        { a: "", q: "" },
        { a: "", q: "" },
        { a: "", q: "" }
    ];
});
define("sagrada_escritura/oracion", ["require", "exports", "quizlet/fun"], function (require, exports, fun_4) {
    "use strict";
    var nuestro = [
        {
            es: "Nuestro Señor",
            en: "Our Lord"
        },
        {
            es: "Nuestro Padre",
            en: "Our Father"
        },
        {
            es: "Padre Santo",
            en: "Holy Father"
        },
        {
            es: "Señor Dios",
            en: "Lord God"
        }
    ];
    var adoración = [
        { es: "Tú eres fiel.", en: "You are faithful." },
        { es: "Siempre eres fiel.", en: "You are always faithful." },
        { es: "Tú eres digno.", en: "You are worthy." },
        { es: "Tú nombre es Santo.", en: "You name is Holy." },
        { es: "Eres poderoso.", en: "You are powerful." },
        { es: "Tú eres mi roca.", en: "You are my rock." },
        { es: "Tú eres nuestro Salvador.", en: "You are our Savior." },
        { es: "No hay otra nombre.", en: "There is no other name." },
        { es: "Adoramos tu nombre.", en: "We adore your name." },
        { es: "Grande es tu fidelidad.", en: "Great is your faithfulness." },
        { es: "Te Alabamos.", en: "We praise you." },
        { es: "Te anhelo, Señor.", en: "I long for you, Lord." },
        { es: "Tu reino es eterno.", en: "Your kindom is eternal." },
        { es: "No hay nadie como Tú.", en: "There is no one like you." },
        { es: "Queremos levantar tu nombre.", en: "We lift your name." }
    ];
    var confesión = [
        { es: "Mi esperanza está en Jesús.", en: "My hope is in Jesus." },
        { es: "Solo Jesús mi roca es.", en: "Only Jesus is my rock." },
        { es: "Estamos justificados por la fe en Cristo.", en: "We are justified by our faith in Christ." },
        { es: "Por favor, Perdoname los pecados.", en: "Please, forgive my sins." },
        { es: "Yo sé que soy un pecador.", en: "I know that I am a sinner." },
        { es: "Yo sé que Jesús es Rey.", en: "I know Jesus is King." },
        { es: "Te necesito.", en: "I need you." },
        { es: "Ayudame.", en: "Help me." },
        { es: "Perdoname.", en: "Forgive me." }
    ];
    var gracias = [
        { es: "Gracias por salvarme.", en: "Thank you for saving me." },
        { es: "Gracias por mis bendiciones.", en: "Thank you for blessing me." },
        {
            es: "Gracias por mi familia, mis amigos, y tu iglesia.",
            en: "Thank you my family, my friends, and your church."
        },
        { es: "Gracias por amarme.", en: "Thank you for loving me." },
        { es: "Gracias por tu amor para mi.", en: "Thank you for your love of me." }
    ];
    var suplication = [
        { es: "Bendiga nuestros amigos cubanos.", en: "Bless our Cuban friends." },
        { es: "Da protección a mis amigos en Cuba.", en: "Give protection to my friends in Cuba." },
        { es: "Guíanos cada día.", en: "Guide us each day." },
        { es: "Danos tu sabiduría.", en: "Give us your wisdom." }
    ];
    return nuestro
        .concat(adoración)
        .concat(confesión)
        .concat(gracias)
        .concat(suplication)
        .concat(fun_4.combine([nuestro, adoración, confesión, gracias, suplication]));
});
define("quizlet/packs/oraci\u00F3n-packet", ["require", "exports", "sagrada_escritura/oracion"], function (require, exports, oracion_1) {
    "use strict";
    oracion_1 = __importDefault(oracion_1);
    return oracion_1["default"].map(function (v) { return ({ a: v.es, q: v.en }); });
});
define("quizlet/packs/opuesto-packet", ["require", "exports", "sentences/opuesto"], function (require, exports, opuesto_2) {
    "use strict";
    opuesto_2 = __importDefault(opuesto_2);
    return opuesto_2["default"].map(function (v) { return ({ a: v.es, q: v.en }); });
});
define("quizlet/stories/el rescatado", ["require", "exports"], function (require, exports) {
    "use strict";
    return [
        {
            es: "Caí sin saber cómo o cuándo iba a parar.",
            en: "I fell without knowing how or when I was going to stop."
        },
        {
            es: "Hasta que toqué el suelo.",
            en: "Until I touched the ground."
        },
        {
            es: "La competencia tiene un rol muy importante en mi vida.",
            en: "The competition has a very important role in my life."
        },
        {
            es: "Siempre trato de ser el mejor en el trabajo y también en el deporte.",
            en: "I always try to be the best at work and also in sports."
        },
        {
            es: "Y para poder serlo, trabajo muy duro.",
            en: "And to be able to be, I work very hard."
        },
        {
            es: "Corro carreras de aventuras durante noches enteras.",
            en: "I run adventure races for entire nights."
        },
        {
            es: "Vi muchos documentales para preparame.",
            en: "I saw many documentaries to prepare me."
        },
        {
            es: "En 2010, yo tenía 49 años y quería participar en una carrera de 80 kilómetros en un cerro.",
            en: "In 2010, I was 49 years old and wanted to participate in a race of 80 km on a mountain."
        },
        {
            es: "Pensaba que estaba listo para ese tipo de aventura.",
            en: "I thought I was ready for that kind of adventure."
        },
        {
            es: "Yo ya tenía experiencia en otro tipo de carreras, pero nunca corrí una distancia tan larga.",
            en: "I already had experience in other types of races, but I never ran such a long distance."
        },
        {
            es: "Yo quería llegar entre los primeros 30.",
            en: "I wanted to get between the first 30."
        },
        {
            es: "La carrera era en un cerro que se llama Champaquí.",
            en: "The race was on a mountain called Champaquí."
        },
        {
            es: "Tiene una elevación de casi 3 mil metros y está lleno de bosques.",
            en: "It has a height of almost 3 thousand meters and is full of forests."
        },
        {
            es: "El día antes de la carrera yo viajé a Córdoba con un amigo.",
            en: "The day before the race I traveled to Córdoba with a friend."
        },
        {
            es: "Nos quedamos en un hostal en San Javier, la ciudad más cercana al cerro.",
            en: "We stayed in a hostel in San Javier, the city closest to the mountain."
        },
        {
            es: "Esa noche hablé con mi esposa y con mis hijos.",
            en: "That night I spoke with my wife and my children."
        },
        {
            es: "Nosotros estábamos todos emocionados por la carrera.",
            en: "We were all excited for the race."
        },
        { es: "", en: "" },
        { es: "", en: "" },
        { es: "", en: "" },
        { es: "", en: "" },
        { es: "", en: "" },
        { es: "", en: "" },
        { es: "", en: "" },
        { es: "", en: "" },
        { es: "", en: "" },
        { es: "", en: "" },
        { es: "", en: "" },
        { es: "", en: "" },
        { es: "", en: "" },
        { es: "", en: "" }
    ];
});
define("quizlet/packs/stories-packet", ["require", "exports", "quizlet/stories/el rescatado"], function (require, exports, el_rescatado_1) {
    "use strict";
    el_rescatado_1 = __importDefault(el_rescatado_1);
    return el_rescatado_1["default"].map(function (v) { return ({ a: v.es, q: v.en }); });
});
define("quizlet/packs/index", ["require", "exports", "quizlet/packs/n\u00FAmeros-packet", "quizlet/packs/pronoun-packet", "quizlet/packs/sustantivo-packet", "quizlet/packs/question-packet", "quizlet/packs/oraci\u00F3n-packet", "quizlet/packs/opuesto-packet", "quizlet/packs/dialog", "quizlet/qa"], function (require, exports, n_meros_packet_1, pronoun_packet_1, sustantivo_packet_1, question_packet_1, oraci_n_packet_1, opuesto_packet_1, dialog_1, qa_1) {
    "use strict";
    n_meros_packet_1 = __importDefault(n_meros_packet_1);
    pronoun_packet_1 = __importDefault(pronoun_packet_1);
    sustantivo_packet_1 = __importDefault(sustantivo_packet_1);
    question_packet_1 = __importDefault(question_packet_1);
    oraci_n_packet_1 = __importDefault(oraci_n_packet_1);
    opuesto_packet_1 = __importDefault(opuesto_packet_1);
    dialog_1 = __importDefault(dialog_1);
    qa_1 = __importDefault(qa_1);
    return [].concat(dialog_1["default"], qa_1["default"], pronoun_packet_1["default"], sustantivo_packet_1["default"], question_packet_1["default"], opuesto_packet_1["default"], n_meros_packet_1["default"], oraci_n_packet_1["default"]);
});
define("quizlet/topical/food", ["require", "exports"], function (require, exports) {
    "use strict";
    return [
        { es: "carnitas", en: "little meats" },
        { es: "cúerito", en: "pig skin" },
        { es: "lengua de vaca", en: "cow tongue" },
        { es: "queso", en: "cheese" },
        { es: "frijoles", en: "red beans" },
        { es: "chicharrón", en: "pork rind" },
        { es: "revueltas", en: "mixture" },
        { es: "pollo", en: "chicken" },
        { es: "res", en: "beef" },
        { es: "texana", en: "texas style" },
        { es: "camarón", en: "shrimp" },
        { es: "piña", en: "pineapple" },
        { es: "horchata", en: "almond juice" },
        { es: "bebidas", en: "drinks" },
        { es: "tepache", en: "pinapple mixed" },
        { es: "caldo de pollo", en: "chicken soup" },
        { es: "fajita de res texana", en: "beef fajita" },
        { es: "caldo de siete mares", en: "seven seas soup" },
        { es: "fajita de pollo", en: "chicken fajita" },
        { es: "enchiladas verdes", en: "enchilada" },
        { es: "enchiladas rojas y verdes", en: "enchilada" },
        { es: "caldo de cangrejo", en: "" },
        { es: "costilla asada de res", en: "grilled beef ribs" },
        { es: "suadero", en: "brisket" },
        { es: "cabeza", en: "cow head" },
        { es: "flor de calabaza", en: "squash blossom" },
        { es: "huitlacoche", en: "corn smut" },
        { es: "pollo asado", en: "grilled chicken" },
        { es: "milanesas", en: "breaded cutlet" },
        { es: "carne asada", en: "beef steak" },
        { es: "caldo de res", en: "beef soup" },
        { es: "caldo de camarón", en: "shrimp soup" },
        { es: "el caldo de menudo", en: "soup of the day" }
    ].map(function (v) { return ({ es: v.es, en: v.en }); });
});
//# sourceMappingURL=main.js.map