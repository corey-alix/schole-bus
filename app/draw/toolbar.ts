import ol = require("openlayers");
import $ = require("jquery");
import { Measurement } from "ol3-draw/ol3-draw/measure-extension";
import { Button } from "ol3-draw/ol3-draw/ol3-button";
import { Delete } from "ol3-draw/ol3-draw/ol3-delete";
import { Draw } from "ol3-draw/ol3-draw/ol3-draw";
import { Modify } from "ol3-draw/ol3-draw/ol3-edit";
import { Translate } from "ol3-draw/ol3-draw/ol3-translate";
import { Select } from "ol3-draw/ol3-draw/ol3-select";
import { Note } from "ol3-draw/ol3-draw/ol3-note";
import { WfsSync } from "ol3-draw/ol3-draw/services/wfs-sync";
import { NavHistory } from "ol3-draw/ol3-draw/ol3-history";

import { Grid } from "ol3-grid";
import { cssin } from "ol3-fun/ol3-fun/common";
import { styles } from "../symbology";
import { StyleConverter } from "ol3-symbolizer";

const converter = new StyleConverter();

const WFS_INFO = {
    srsName: "EPSG:3857",
    wfsUrl: `${location.protocol}//${location.hostname}:8080/geoserver/cite/wfs`,
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
        filter = ol.format.filter.and.apply(ol.format.filter.and, filter);
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

export function create(options: {
    map: ol.Map;
    keyword: string;
    commentFieldName: string;
    layers: {
        pointLayer: ol.layer.Vector;
        lineLayer: ol.layer.Vector;
        polygonLayer: ol.layer.Vector;
    }
}) {
    let map = options.map;
    let keyword = options.keyword || "schole-bus";

    let layers = options.layers;

    {
        let unsavedStyle = styles["unsaved-point"].map(s => converter.fromJson(s));
        let savedStyle = styles["point"].map(s => converter.fromJson(s));
        layers.pointLayer.setStyle((feature: ol.Feature, res: number) => feature.get("touched") ? unsavedStyle : savedStyle);
    }
    {
        let unsavedStyle = styles["unsaved-multiline"].map(s => converter.fromJson(s));
        let savedStyle = styles["multiline"].map(s => converter.fromJson(s));
        layers.lineLayer.setStyle((feature: ol.Feature, res: number) => feature.get("touched") ? unsavedStyle : savedStyle);
    }
    {
        let unsavedStyle = styles["unsaved-polygon"].map(s => converter.fromJson(s));
        let savedStyle = styles["polygon"].map(s => converter.fromJson(s));
        layers.polygonLayer.setStyle((feature: ol.Feature, res: number) => feature.get("touched") ? unsavedStyle : savedStyle);
    }

    [layers.polygonLayer, layers.lineLayer, layers.pointLayer].forEach(l => {
        if (options.commentFieldName) {
            l.getSource().on("addfeature", (args: ol.source.VectorEvent) => args.feature.set(options.commentFieldName, args.feature.get(options.commentFieldName) || ""));
        }
    });

    let selectStyle = Select.DEFAULT_OPTIONS.style;
    selectStyle["MultiPolygon"] = selectStyle["Polygon"];

    let lineDraw = Draw.create({
        map: map, geometryType: "MultiLineString", label: "▬", title: "Line",
        layers: [layers.lineLayer]
    });

    let lineEdit = Modify.create({
        map: map, label: "E", 
        style: {
            "Point": [{
                "circle": {
                    "radius": 6,
                    "stroke": {
                        "color": "rgba(255, 0, 0, 1)"
                    },
                    "opacity": 1
                }
            },
            {
                "star": {
                    "opacity": 1,
                    "stroke": {
                        "color": "rgba(255, 255, 0, 1)",
                        "width": 1
                    },
                    "radius": 5,
                    "radius2": 0,
                    "points": 4
                }
            },
            {
                "circle": {
                    "radius": 1,
                    "stroke": {
                        "color": "rgba(0, 0, 0, 1)"
                    },
                    "opacity": 1
                }
            }]
        }
    });

    Measurement.create({
        map: map,
        draw: lineDraw,
        edit: lineEdit,
        uom: "mi"
    });

    Button.create({
        map: options.map,
        position: "top-6 left-2",
        label: "G",
        title: "Goto Google"
    }).on("click", () => {
        let center = new ol.geom.Point(options.map.getView().getCenter());
        center.transform(options.map.getView().getProjection(), "EPSG:4326");
        let [lon, lat] = center.getFirstCoordinate();
        window.open(`https://www.google.com/maps/@${lat},${lon},15z`)
    });

    let toolbar = [
        Note.create({ map: map, layer: layers.pointLayer, noteFieldName: "comment" }),

        Draw.create({
            map: map, geometryType: "MultiPolygon", label: "▧", title: "Polygon",
            layers: [layers.polygonLayer],
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

        lineDraw,

        Draw.create({
            map: map, geometryType: "Point", label: "●", title: "Point",
            layers: [layers.pointLayer]
        }),

        Translate.create({ map: map, label: "T" }),

        lineEdit,

        Delete.create({ map: map, label: "␡" }),

    ];

    Button.create({ map: map, label: "«", eventName: "nav:back", title: "Back", position: "left top-4" });
    Button.create({ map: map, label: "»", eventName: "nav:forward", title: "Forward", position: "left-2 top-4" });

    toolbar.forEach((t, i) => t.setPosition(`left top${-(6 + i * 2) || ''}`));

    NavHistory.create({
        map: map,
        delay: 500
    });

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

    loadAndWatch({
        map: map,
        geometryType: "Point",
        featureType: "addresses",
        template: {
            "strname": keyword
        },
        source: layers.pointLayer.getSource()
    });

    loadAndWatch({
        map: map,
        geometryType: "MultiLineString",
        featureType: "streets",
        template: {
            "strname": keyword
        },
        source: layers.lineLayer.getSource()
    });

    loadAndWatch({
        map: map,
        geometryType: "MultiPolygon",
        featureType: "parcels",
        template: {
            "strname": keyword
        },
        source: layers.polygonLayer.getSource(),
    });

    Grid.create({
        map: map,
        className: "ol-grid",
        position: "bottom-2 left",
        currentExtent: true,
        autoPan: true,
        labelAttributeName: null,
        showIcon: true,
        layers: [layers.pointLayer, layers.lineLayer, layers.polygonLayer],
        zoomMinResolution: 1,
        zoomPadding: 50
    });

    Grid.create({
        map: map,
        className: "ol-grid",
        position: "top left-2",
        currentExtent: false,
        autoCollapse: false,
        autoPan: true,
        labelAttributeName: options.commentFieldName,
        layers: [layers.pointLayer],
        zoomMinResolution: 1,
        zoomPadding: 50
    }).on("destroy", cssin("toolbar", `
.ol-grid {
    background-color: rgba(250,250,250,1);
}        
        `));

    return toolbar;
}