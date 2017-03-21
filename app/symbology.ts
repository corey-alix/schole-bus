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
    animal: [200, 200, 50, 1],
    history: [0, 0, 0, 1],
    education: [0, 200, 0, 1],
    clear: [0, 0, 0, 0],
    camping: [0, 240, 0, 1],
    science: [250, 250, 25, 1],
    black: [0, 0, 0, 1],
    red: [255, 0, 0, 1],
    white: [255, 255, 255, 1],
    monument: [64, 32, 32, 1],
    park: [0, 128, 0, 1],
    poi_stroke: [255, 255, 255, 1],
    unsaved: [255, 0, 0, 1],
    state: [0, 0, 255, 1],
    warning: [255, 0, 0, 1]
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
    "artifact": [
        {
            text: {
                text: "See",
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
                radius: 1,
                fill: {
                    color: rgba(mix(Colors.park, Colors.clear))
                },
                stroke: {
                    color: rgba(Colors.poi_stroke)
                }
            }
        }
    ],
    "cemetery": [{
        text: {
            text: "R.I.P",
            fill: {
                color: rgba(mix(Colors.camping, Colors.black))
            },
            stroke: {
                color: rgba(Colors.black)
            },
            "offset-y": 0
        }
    }],
    "campground": [{
        text: {
            text: "Campground",
            fill: {
                color: rgba(mix(Colors.camping, Colors.clear))
            },
            stroke: {
                color: rgba(mix(Colors.white, Colors.black))
            },
            "offset-y": 0
        }
    }],
    "HTL": [{
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
    "label": [
        {
            text: {
                text: "1",
                font: "cursive",
                fill: {
                    color: rgba(Colors.white)
                },
                stroke: {
                    color: rgba(Colors.black),
                    width: 1
                },
                scale: 2
            }
        }
    ],
    "milestone": [
        {
            circle: {
                radius: 15,
                fill: {
                    color: rgba(Colors.white)
                },
                stroke: {
                    color: rgba(Colors.black),
                    width: 3
                }
            }
        },
        {
            text: {
                text: "1",
                fill: {
                    color: rgba(Colors.white)
                },
                stroke: {
                    color: rgba(Colors.black),
                    width: 3
                },
                scale: 2
            }
        }
    ],
    "museum": [
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
    "national-monument": [
        {
            text: {
                text: "NM",
                fill: {
                    color: rgba(complement(Colors.monument))
                },
                stroke: {
                    color: rgba(Colors.monument),
                    width: 1
                },
                "offset-y": 15
            },
            circle: {
                radius: poi_radius,
                fill: {
                    color: rgba(mix(Colors.monument, Colors.clear))
                },
                stroke: {
                    color: rgba(Colors.poi_stroke)
                }
            }
        }
    ],
    "national-park": [
        {
            text: {
                text: "NP",
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
    "state-park": [
        {
            text: {
                text: "SP",
                fill: {
                    color: rgba(Colors.park)
                },
                stroke: {
                    color: rgba(Colors.state),
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
    "PRK": [
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
    "rut-line": [
        {
            stroke: {
                color: rgba(mix(Colors.park, Colors.clear)),
                width: 6
            }
        },
        {
            stroke: {
                color: rgba(Colors.park),
                width: 1
            }
        }
    ],
    "science-center": [
        {
            text: {
                text: "Think!",
                fill: {
                    color: rgba(Colors.science)
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
                    color: rgba(mix(Colors.science, Colors.clear))
                },
                stroke: {
                    color: rgba(Colors.poi_stroke)
                }
            }
        }

    ],
    "trail": [
        {
            stroke: {
                color: rgba(mix(Colors.park, Colors.clear, Colors.clear)),
                width: 6
            }
        },
        {
            stroke: {
                color: rgba(complement(Colors.park)),
                width: 1
            }
        }
    ],
    'unknown': [{
        circle: {
            radius: poi_radius + 2,
            fill: {
                color: rgba(mix(Colors.clear, Colors.warning))
            },
            stroke: {
                color: rgba(Colors.white)
            }
        },
        text: {
            text: "?",
            fill: {
                color: rgba(mix(Colors.clear, Colors.warning))
            },
            stroke: {
                color: rgba(complement(Colors.warning))
            }
        },
    }],
    'unknown-line': [{
        stroke: {
            color: rgba(mix(Colors.warning, Colors.clear, Colors.clear)),
            width: 8
        }
    },
    {
        stroke: {
            color: rgba(complement(Colors.warning)),
            width: 1
        }
    }],
    'warning-point': [{
        circle: {
            radius: 20,
            fill: {
                color: rgba(mix(Colors.white, Colors.clear, Colors.clear))
            },
            stroke: {
                color: rgba(Colors.warning),
                width: 3
            }
        },
        text: {
            text: "!",
            fill: {
                color: rgba(Colors.white)
            },
            stroke: {
                color: rgba(Colors.warning),
                width: 3
            },
            scale: 2
        },
    }],
    'warning-line': [{
        stroke: {
            color: rgba(Colors.warning),
            width: 8
        }
    },
    {
        stroke: {
            color: rgba(Colors.black),
            width: 2
        }
    }],
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
                color: rgba(mix(Colors.black, Colors.clear)),
                width: 5
            }
        },
        {
            stroke: {
                color: rgba(Colors.white),
                width: 1
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
    "zoo": [
        {
            text: {
                text: "Z-oh-oh",
                fill: {
                    color: rgba(Colors.animal)
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
                    color: rgba(mix(Colors.animal, Colors.clear))
                },
                stroke: {
                    color: rgba(Colors.poi_stroke)
                }
            }
        }

    ],
};
