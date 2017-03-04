import ol = require("openlayers");
import { Button } from "ol3-draw/ol3-draw/ol3-button";
import { Delete } from "ol3-draw/ol3-draw/ol3-delete";
import { Draw } from "ol3-draw/ol3-draw/ol3-draw";
import { Modify } from "ol3-draw/ol3-draw/ol3-edit";
import { Translate } from "ol3-draw/ol3-draw/ol3-translate";
import { Select } from "ol3-draw/ol3-draw/ol3-select";

export function create(args: { map: ol.Map }) {
    let map = args.map;

    let pointLayer = new ol.layer.Vector({ source: new ol.source.Vector() });
    let lineLayer = new ol.layer.Vector({ source: new ol.source.Vector() });
    let polygonLayer = new ol.layer.Vector({ source: new ol.source.Vector() });

    map.addLayer(polygonLayer);
    map.addLayer(lineLayer);
    map.addLayer(pointLayer);

    let toolbar = [
        Select.create({ map: map, label: "?", eventName: "info", boxSelectCondition: ol.events.condition.primaryAction }),

        Draw.create({
            map: map, geometryType: "MultiPolygon", label: "▧", title: "Polygon",
            layers: [polygonLayer],
            style: [
                {
                    fill: {
                        color: "rgba(255,0,0,0.5)"
                    },
                    stroke: {
                        color: "rgba(0,0,0,1)",
                        width: 5
                    }
                },
                {
                    stroke: {
                        color: "rgba(255,255,255,1)",
                        width: 1
                    }
                }

            ]
        }),
        Draw.create({
            map: map, geometryType: "Circle", label: "◯", title: "Circle", style: [
                {
                    fill: {
                        color: "rgba(255,0,0,0.5)"
                    },
                    stroke: {
                        color: "rgba(255,255,255,1)",
                        width: 3
                    }
                }
            ]
        }),

        Draw.create({
            map: map, geometryType: "MultiLineString", label: "▬", title: "Line",
            layers: [lineLayer]
        }),

        Draw.create({
            map: map, geometryType: "Point", label: "●", title: "Point",
            layers: [pointLayer]
        }),

        Draw.create({
            map: map, geometryType: "Point", label: "★", title: "Gradient", style: [
                {
                    "star": {
                        "fill": {
                            "gradient": {
                                "type": "linear(1,0,3,46)",
                                "stops": "rgba(30,186,19,0.22) 0%;rgba(4,75,1,0.48) 70%;rgba(12,95,37,0.56) 77%;rgba(45,53,99,0.72) 100%"
                            }
                        },
                        "opacity": 1,
                        "stroke": {
                            "color": "rgba(26,39,181,0.82)",
                            "width": 8
                        },
                        "radius": 23,
                        "radius2": 15,
                        "points": 20,
                        "scale": 1
                    }
                }
            ]
        }),

        Translate.create({ map: map, label: "↔" }),
        Modify.create({ map: map, label: "Δ" }),

        Delete.create({ map: map, label: "␡" }),
        Button.create({ map: map, label: "⎚", title: "Clear", eventName: "clear-drawings" }),

        Button.create({ map: map, label: "💾", eventName: "save", title: "Save" }),
        Button.create({ map: map, label: "X", eventName: "exit", title: "Exit" }),
    ];
    toolbar.forEach((t, i) => t.setPosition(`left top${-i * 2 || ''}`));

    return toolbar;
}