import ol = require("openlayers");
import $ = require("jquery");
import { Button } from "ol3-draw/ol3-draw/ol3-button";
import { Delete } from "ol3-draw/ol3-draw/ol3-delete";
import { Draw } from "ol3-draw/ol3-draw/ol3-draw";
import { Modify } from "ol3-draw/ol3-draw/ol3-edit";
import { Translate } from "ol3-draw/ol3-draw/ol3-translate";
import { Select } from "ol3-draw/ol3-draw/ol3-select";
import { WfsSync } from "ol3-draw/ol3-draw/services/wfs-sync";
import { Grid } from "ol3-grid";
import { cssin } from "ol3-fun/ol3-fun/common";

const WFS_INFO = {
    srsName: "EPSG:3857",
    wfsUrl: "http://localhost:8080/geoserver/cite/wfs",
    featureNS: "http://www.opengeospatial.net/cite",
    featurePrefix: "cite",
};

function stopControl(map: ol.Map, type: any) {
    map.getControls()
        .getArray()
        .filter(i => i.get("active"))
        .filter(i => i instanceof type)
        .forEach(t => t.set("active", false));
}

function stopOtherControls(map: ol.Map, control: ol.control.Control) {
    map.getControls()
        .getArray()
        .filter(i => i.get("active"))
        .filter(i => typeof i === typeof control)
        .forEach(t => t !== control && t.set("active", false));
}

function loadAndWatch(options: {
    map?: ol.Map;
    template?: { [name: string]: any };
    featureType: string;
    geometryType: ol.geom.GeometryType;
    source: ol.source.Vector;
}) {

    options.source.on("addfeature", (args: { feature: ol.Feature }) => {
        Object.keys(options.template).forEach(k => {
            args.feature.set(k, options.template[k]);
        });
    });

    let serializer = new XMLSerializer();

    let format = new ol.format.WFS();

    let filter = Object.keys(options.template).map(k => ol.format.filter.equalTo(k, options.template[k]));
    if (filter.length > 1) {
        debugger; // might need apply
        filter = ol.format.filter.and(filter);
    } else {
        filter = filter[0];
    }

    let requestBody = format.writeGetFeature({
        featureNS: WFS_INFO.featureNS,
        featurePrefix: WFS_INFO.featurePrefix,
        featureTypes: [options.featureType],
        srsName: WFS_INFO.srsName,
        filter: filter
    });

    let data = serializer.serializeToString(requestBody);

    $.ajax({
        type: "POST",
        url: WFS_INFO.wfsUrl,
        data: data,
        contentType: "application/xml",
        dataType: "xml",
        success: (response: XMLDocument) => {
            let features = format.readFeatures(response);
            features = features.filter(f => !!f.getGeometry());
            options.source.addFeatures(features);

            if (options.map) {
                let extent = options.map.getView().calculateExtent(options.map.getSize());
                features.forEach(f => ol.extent.extend(extent, f.getGeometry().getExtent()));
                options.map.getView().fit(extent, options.map.getSize());
            }

            WfsSync.create({
                wfsUrl: WFS_INFO.wfsUrl,
                featureNS: WFS_INFO.featureNS,
                featurePrefix: WFS_INFO.featurePrefix,
                srsName: WFS_INFO.srsName,
                sourceSrs: WFS_INFO.srsName,
                source: options.source,
                targets: {
                    [options.geometryType]: options.featureType
                }
            });

        }
    });
}

export function create(args: { map: ol.Map }) {
    let map = args.map;

    let pointLayer = new ol.layer.Vector({ source: new ol.source.Vector() });
    let lineLayer = new ol.layer.Vector({ source: new ol.source.Vector() });
    let polygonLayer = new ol.layer.Vector({ source: new ol.source.Vector() });

    map.addLayer(polygonLayer);
    map.addLayer(lineLayer);
    map.addLayer(pointLayer);

    let selectStyle = Select.DEFAULT_OPTIONS.style;
    selectStyle["MultiPolygon"] = selectStyle["Polygon"];

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

    map.on("exit", () => {
        toolbar.forEach(t => t.destroy());
    });

    map.on("info", (args: {
        control: Button
    }) => {
        if (args.control.get("active")) {
            stopOtherControls(map, args.control);
            stopControl(map, Draw);
            stopControl(map, Delete);
            stopControl(map, Translate);
            stopControl(map, Modify);
        }
    });

    map.on("delete-feature", (args: { control: Draw }) => {
        if (args.control.get("active")) {
            stopOtherControls(map, args.control);
            stopControl(map, Draw);
            stopControl(map, Modify);
            stopControl(map, Translate);
            stopControl(map, Select);
        }
    });

    map.on("draw-feature", (args: { control: Draw }) => {
        if (args.control.get("active")) {
            stopOtherControls(map, args.control);
            stopControl(map, Delete);
            stopControl(map, Modify);
            stopControl(map, Translate);
            stopControl(map, Select);
        }
    });

    map.on("translate-feature", (args: { control: Draw }) => {
        if (args.control.get("active")) {
            stopOtherControls(map, args.control);
            stopControl(map, Delete);
            stopControl(map, Draw);
            stopControl(map, Modify);
            stopControl(map, Select);
        }
    });

    map.on("modify-feature", (args: { control: Draw }) => {
        if (args.control.get("active")) {
            stopOtherControls(map, args.control);
            stopControl(map, Delete);
            stopControl(map, Draw);
            stopControl(map, Translate);
            stopControl(map, Select);
        }
    });

    map.on("clear-drawings", (args: { control: Button }) => {
        if (args.control.get("active")) {
            stopControl(map, Delete);
            stopControl(map, Draw);
            stopControl(map, Translate);
            stopControl(map, Select);

            map.getControls()
                .getArray()
                .filter(i => i instanceof Draw)
                .forEach(t => (<Draw>t).options.layers.forEach(l => l.getSource().clear()));

        }
    });

    loadAndWatch({
        map: map,
        geometryType: "Point",
        featureType: "addresses",
        template: {
            "strname": "29615"
        },
        source: pointLayer.getSource()
    });

    loadAndWatch({
        map: map,
        geometryType: "MultiLineString",
        featureType: "streets",
        template: {
            "strname": "29615"
        },
        source: lineLayer.getSource()
    });

    loadAndWatch({
        map: map,
        geometryType: "MultiPolygon",
        featureType: "parcels",
        template: {
            "strname": "29615"
        },
        source: polygonLayer.getSource(),
    });

    let grid = Grid.create({
        map: map,
        className: "ol-grid top left-2",
        currentExtent: false,
        autoCollapse: false,
        autoPan: true,
        labelAttributeName: "strname",
        showIcon: true,
        layers: [pointLayer, lineLayer, polygonLayer]
    });

    grid.on("destroy", cssin("toolbar", `
.ol-grid {
    background-color: rgba(250,250,250,1);
}        
        `));

    return toolbar;
}