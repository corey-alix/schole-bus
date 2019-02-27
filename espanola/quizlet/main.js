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
    function isMale(noun) {
        if (0 === noun.indexOf("el "))
            return true;
        if (0 === noun.indexOf("la "))
            return false;
        var last = noun.charAt(noun.length - 1);
        switch (last) {
            case "á":
            case "é":
            case "í":
            case "ó":
            case "ú":
            case "o":
                return true;
            case "a":
                return noun.charAt(noun.length - 2) === "m";
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
        return (isMale(noun) ? "el " : "la ") + noun;
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
define("quizlet/qa-input", ["require", "exports", "quizlet/webcomponent", "quizlet/system-events", "quizlet/console-log", "quizlet/keydown-as-keypress"], function (require, exports, webcomponent_3, system_events_2, console_log_1, keydown_as_keypress_1) {
    "use strict";
    exports.__esModule = true;
    webcomponent_3.cssin("qa-input", "qa-input {\n\tpadding: 20px;\n}\nqa-input .correct {\n\tcolor: green;\n\tborder: 1px solid green;\n}\nqa-input .wrong {\n\tborder: 1px solid red;\n}\nqa-input label {\n\tfont-size: xx-large;\n\twhitespace:wrap;\n\tmargin-top: 20px;\n\tpadding: 20px;\n}\nqa-input input {\n\tfont-size: x-large;\n\tdisplay: block;\n\tvertical-align: top;\n\tbackground-color: black;\n\tborder: none;\n\tcolor: gray;\n\tpadding-left: 10px;\n\tmin-height: 64px;\n\tmax-height: 64px;\n\twidth: 100%;\n\tpadding: 20px;\n}\nqa-input button {\n    background: transparent;\n    border: none;\n    color: gray;\n\tposition: relative;\n    bottom: 3px;\n\tleft: 10px;\n}\nqa-input button[disabled] {\n\tcolor: green;\n}");
    function dump(o) {
        var result = {};
        for (var p in o) {
            if (p === p.toUpperCase())
                continue;
            var v = o[p];
            if (typeof v === "string" || typeof v === "number")
                result[p] = v + "";
        }
        console_log_1.log(JSON.stringify(result));
    }
    var QaInput = /** @class */ (function (_super) {
        __extends(QaInput, _super);
        function QaInput(domNode) {
            var _this = _super.call(this, domNode) || this;
            _this.score = [0, 0];
            _this.label = document.createElement("label");
            _this.input = document.createElement("input");
            _this.input.type = "text";
            _this.input.spellcheck = false;
            _this.help = document.createElement("button");
            _this.help.tabIndex = -1; // no tab
            _this.help.type = "button";
            _this.help.innerHTML = "�";
            return _this;
        }
        QaInput.prototype.focus = function () {
            this.input.focus();
            this.play();
        };
        QaInput.prototype.hint = function () {
            this.score[1]++;
            system_events_2.SystemEvents.trigger("hint", { hint: this.getAttribute("answer") });
            system_events_2.SystemEvents.trigger("play", { es: this.getAttribute("answer"), avitar: "rita" });
        };
        QaInput.prototype.play = function () {
            document.title = this.getAttribute("question") || "?";
            system_events_2.SystemEvents.trigger("play", { es: this.getAttribute("answer") });
        };
        QaInput.prototype.rightAnswer = function () {
            this.score[0]++;
            system_events_2.SystemEvents.trigger("correct", { value: 1 });
        };
        QaInput.prototype.wrongAnswer = function () {
            this.score[1]++;
            system_events_2.SystemEvents.trigger("incorrect", { value: -1 });
            this.play();
        };
        QaInput.prototype.isMatch = function (a, b) {
            var A = a.toUpperCase();
            var B = b.toUpperCase();
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
                case ",":
                    if (A == " ")
                        return true;
            }
            return false;
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
                system_events_2.SystemEvents.trigger("xp", { score: score, question: this.getAttribute("question") });
                system_events_2.SystemEvents.trigger("play", { es: this.getAttribute("answer"), avitar: "clara" });
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
                                _this.tab();
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
                    if (_this.isMatch(currentKey, expectedKey)) {
                        input.value = answer.substring(0, currentValue.length + 1);
                        system_events_2.SystemEvents.trigger("play", { action: "stop" });
                        _this.rightAnswer();
                        if (_this.validate()) {
                            _this.tab();
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
                    console_log_1.log(ex);
                }
            };
            var shadowRoot = this.attachShadow({ mode: "open" });
            shadowRoot.appendChild(label);
            label.appendChild(this.help);
            shadowRoot.appendChild(input);
            this.help.onclick = function () {
                _this.input.focus();
                system_events_2.SystemEvents.trigger("hint", { hint: answer });
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
                system_events_2.SystemEvents.trigger("no-more-input", {});
                return;
            }
            setTimeout(function () { return s && s.focus(); }, 200);
        };
        return QaInput;
    }(webcomponent_3.WebComponent));
    exports.QaInput = QaInput;
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
define("quizlet/qa-block", ["require", "exports", "quizlet/webcomponent", "quizlet/system-events", "quizlet/qa-input", "quizlet/fun", "quizlet/storage"], function (require, exports, webcomponent_4, system_events_3, qa_input_1, fun_1, storage_1) {
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
            system_events_3.SystemEvents.watch("start", function () {
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
        rita: {
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
            this.rate = 0.9 + Math.random() * 0.4;
            this.pitch = 0 + Math.random() * 1.5;
            ///log(this.synth.voice.name);
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
                this.synth.rate = this.rate;
                this.synth.pitch = this.pitch;
            }
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
define("quizlet/main", ["require", "exports", "quizlet/score-board", "quizlet/qa-input", "quizlet/qa-block", "quizlet/webcomponent", "quizlet/system-events", "quizlet/console-log", "quizlet/storage", "quizlet/player"], function (require, exports, score_board_1, qa_input_2, qa_block_1, webcomponent_5, system_events_4, console_log_2, storage_2, player_1) {
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
    {
        var mods_1 = {
            "console-log": console_log_2.ConsoleLog,
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
        setTimeout(function () { return system_events_4.SystemEvents.trigger("start", {}); }, 200);
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
    system_events_4.SystemEvents.watch("correct", function () { return score(1); });
    system_events_4.SystemEvents.watch("incorrect", function () { return score(-1); });
    system_events_4.SystemEvents.watch("hint", function (result) {
        from(document.getElementsByTagName("hint-slider")).forEach(function (n) {
            n.innerHTML = result.hint;
            n.classList.add("visible");
            n.classList.remove("hidden");
            setTimeout(function () {
                n.classList.remove("visible");
                n.classList.add("hidden");
            }, 2000);
        });
    });
    system_events_4.SystemEvents.watch("no-more-input", function () {
        document.body.classList.add("hidden");
        setTimeout(function () { return location.reload(); }, 2000);
    });
    system_events_4.SystemEvents.watch("xp", function (result) {
        storage_2.storage.setScore(result);
    });
    system_events_4.SystemEvents.watch("play", function (data) {
        if (data.action === "stop") {
            player_1.player.stop();
            return;
        }
        player_1.player.play(data);
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
    function isMale(noun) {
        if (0 === noun.indexOf("el "))
            return true;
        if (0 === noun.indexOf("la "))
            return false;
        var last = noun.charAt(noun.length - 1);
        switch (last) {
            case "a":
            case "e":
                return false;
            case "o":
                return true;
        }
        return true;
    }
    var builder = function (data) {
        var es1 = data.es[0];
        es1 = isMale(es1) ? "al " : "a " + es1;
        return { es: "lo opuesto a " + es1 + " es " + data.es[1], en: "the opposite of " + data.en[0] + " is " + data.en[1] };
    };
    var opuestos = [
        {
            es: ["arriba", "abajo"],
            en: ["up", "down"]
        },
        {
            es: ["atràs", "adelante"],
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
            es: ["en", "fuera"],
            en: ["in", "out"]
        }
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
        { es: "Voy a hablar con Todd.", en: "I am going to talk to Todd." },
        { es: "No voy al café", en: "I am not going to the café." },
        { es: "No voy.", en: "I am not going." },
        { es: "No voy a cantar sin Todd.", en: "I will not sing without Todd." },
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
        { es: "te gusta tu comida?", en: "do you like your food?" }
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
        var num = randomNumber();
        var es = noun.es;
        var en = noun.en;
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
            en = noun.en + " (" + num.en + " of them)";
        }
        else if (startsWith(es, "una ")) {
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
define("verbos/index", ["require", "exports"], function (require, exports) {
    "use strict";
    var regular_postfix = {
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
    };
    function regular(infinitive, en_base) {
        var ch2 = infinitive.substring(infinitive.length - 2).toLowerCase();
        var base = infinitive.substring(0, infinitive.length - 2);
        var postfix = regular_postfix[ch2];
        en_base.i = en_base.i || en_base.infinitive;
        en_base.you = en_base.you || en_base.i;
        en_base.he = en_base.he || en_base.you + "s";
        en_base.we = en_base.we || en_base.you;
        return {
            i: { es: infinitive, en: "to " + en_base.infinitive },
            yo: { es: base + postfix.yo, en: "I " + en_base.i },
            tú: { es: base + postfix.tú, en: "you " + en_base.you },
            él: { es: base + postfix.él, en: "he " + en_base.he },
            nosotros: { es: base + postfix.nosotros, en: "we " + en_base.we }
        };
    }
    return [
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
            yo: { es: "digo", en: "I say" },
            tú: { es: "dices", en: "you say" },
            él: { es: "dice", en: "he says" },
            ella: { es: "dice", en: "she says" },
            nosotros: { es: "dicimos", en: "we say" },
            he: { es: "dicho", en: "I have said" },
            has: { es: "dicho", en: "you have said" },
            hemos: { es: "dicho", en: "we have said" }
        },
        regular("caminar", { infinitive: "walk" }),
        regular("correr", { infinitive: "run" }),
        regular("escribir", { infinitive: "write" }),
        regular("esperar", { infinitive: "expect" }),
        regular("esparcir", { infinitive: "spread" }),
        regular("escuchar", { infinitive: "listen" }),
        regular("entregar", { infinitive: "deliver" }),
        regular("descubrir", { infinitive: "discover" })
    ];
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
define("quizlet/packs/pronoun-packet", ["require", "exports", "quizlet/packs/yo-packet", "quizlet/packs/t\u00FA-packet", "quizlet/packs/\u00E9l-packet", "quizlet/packs/nosotros-packet", "quizlet/packs/he-packet"], function (require, exports, yo_packet_1, t__packet_1, _l_packet_1, nosotros_packet_1, he_packet_1) {
    "use strict";
    yo_packet_1 = __importDefault(yo_packet_1);
    t__packet_1 = __importDefault(t__packet_1);
    _l_packet_1 = __importDefault(_l_packet_1);
    nosotros_packet_1 = __importDefault(nosotros_packet_1);
    he_packet_1 = __importDefault(he_packet_1);
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
    var qa = pronouns.map(function (v) { return ({ a: v.es, q: v.en }); }).concat(yo_packet_1["default"], t__packet_1["default"], _l_packet_1["default"], nosotros_packet_1["default"], he_packet_1["default"]);
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
define("quizlet/packs/index", ["require", "exports", "quizlet/packs/pronoun-packet", "quizlet/packs/sustantivo-packet", "quizlet/qa"], function (require, exports, pronoun_packet_1, sustantivo_packet_1, qa_1) {
    "use strict";
    pronoun_packet_1 = __importDefault(pronoun_packet_1);
    sustantivo_packet_1 = __importDefault(sustantivo_packet_1);
    qa_1 = __importDefault(qa_1);
    return pronoun_packet_1["default"].concat(sustantivo_packet_1["default"], qa_1["default"]);
});
//# sourceMappingURL=main.js.map