import ol = require("openlayers");
import { Format } from "ol3-symbolizer";

let poi_radius = 8;

type Color = [number, number, number, number];

function mix(...colors: Color[]) {
    let result = <Color>[0, 0, 0, 0];
    colors.forEach(color => color.forEach((c, i) => result[i] += c));
    return result.map(v => v / colors.length);
}

function rgba(color: Color) {
    return ol.color.asString(color);
}

function complement(color: Color) {
    let v = 255 < 0.3 * color[0] + 0.4 * color[1] + 0.3 * color[2] ? 0 : 1;
    return <Color>[v, v, v, 1];
}

const Colors = <{ [name: string]: Color }>{
    history: [0, 0, 0, 1],
    education: [0, 200, 0, 1],
    clear: [0, 0, 0, 0],
    black: [0, 0, 0, 1],
    red: [255, 0, 0, 1],
    white: [255, 255, 255, 1],
    park: [0, 128, 0, 1],
    poi_stroke: [255, 255, 255, 1],
    unsaved: [255, 0, 0, 1]
}

export const styles = <{ [name: string]: Format.Style[] }>{
    '*': [{
        text: {
            text: "?"
        },
        circle: {
            radius: poi_radius,
            fill: {
                color: rgba(mix(Colors.clear, Colors.white))
            },
            stroke: {
                color: rgba(Colors.black)
            }
        }
    }],
    HTL: [{
        text: {
            text: "HOTEL",
            fill: {
                color: rgba(mix(Colors.black, Colors.clear))
            },
            stroke: {
                color: rgba(mix(Colors.white, Colors.black))
            },
            "offset-y": 0
        }
    }],
    PRK: [
        {
            text: {
                text: "Park",
                fill: {
                    color: rgba(complement(Colors.park))
                },
                stroke: {
                    color: rgba(Colors.park),
                    width: 3
                },
                "offset-y": 15
            },
            circle: {
                radius: poi_radius,
                fill: {
                    color: rgba(mix(Colors.park, Colors.clear))
                },
                stroke: {
                    color: rgba(Colors.poi_stroke)
                }
            }
        }
    ],
    museums: [
        {
            circle: {
                radius: poi_radius,
                fill: {
                    color: rgba(mix(Colors.history, Colors.education))
                },
                stroke: {
                    color: rgba(complement(mix(Colors.history, Colors.education)))
                }
            }
        }
    ],
    "polygon": [
        {
            fill: {
                color: rgba(mix(Colors.white, Colors.clear))
            },
            stroke: {
                color: rgba(mix(Colors.black)),
                width: 1
            }
        }
    ],
    "unsaved-polygon": [
        {
            fill: {
                color: rgba(mix(Colors.unsaved, Colors.clear))
            },
            stroke: {
                color: rgba(mix(Colors.unsaved)),
                width: 1
            }
        }
    ],
    "multiline": [
        {
            stroke: {
                color: rgba(mix(Colors.black)),
                width: 3
            }
        }
    ],
    "unsaved-multiline": [
        {
            stroke: {
                color: rgba(mix(Colors.unsaved)),
                width: 5
            }
        },
        {
            stroke: {
                color: rgba(Colors.black),
                width: 1
            }
        }
    ],
    "point": [
        {
            circle: {
                radius: 8,
                fill: {
                    color: rgba(mix(Colors.white, Colors.clear))
                },
                stroke: {
                    color: rgba(mix(Colors.black)),
                    width: 1
                }
            }
        }
    ],
    "unsaved-point": [
        {
            circle: {
                radius: 12,
                fill: {
                    color: rgba(mix(Colors.unsaved, Colors.clear))
                },
                stroke: {
                    color: rgba(mix(Colors.black)),
                    width: 1
                }
            }
        },
        {
            circle: {
                radius: 8,
                fill: {
                    color: rgba(mix(Colors.white, Colors.clear))
                },
                stroke: {
                    color: rgba(mix(Colors.black)),
                    width: 1
                }
            }
        }
    ],
};
