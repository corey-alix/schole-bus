import ol = require("openlayers");
import { create as CreateLayerSwitcher } from "./app/layerswitcher";
import { create as CreateToolbar } from "./app/draw/toolbar";
import { create as CreateSearch } from "./app/search";
import { create as CreateGoto } from "./app/search/goto";
import { create as CreatePopup } from "./app/popup";
import { create as CreateFilter } from "./app/search/filter";

import { cssin, html, mixin, getParameterByName } from "ol3-fun/ol3-fun/common";
import { styles } from "./app/symbology";
import { StyleConverter } from "ol3-symbolizer";

import { WFS_INFO } from "./app/wfs-info";

import { GreenvilleSc } from "./app/poi/usa";

//import POI = require("./app/poi/geonames");
const POI = [];

const converter = new StyleConverter();

const wgs84Sphere = new ol.Sphere(6378137);

// move to ol3-fun
const MeterConvert = {
    "m": 1,
    "km": 1 / 1000,
    "ft": 3.28084,
    "mi": 0.000621371
}

function formatLength(l: number, longUom = "mi") {
    let uom = l < 100 ? "m" : longUom;
    return (MeterConvert[uom] * l).toPrecision(5) + " " + uom;
}

// move to ol3-fun
function flatten(args: { geom: ol.geom.Geometry }) {
    let coordinates: ol.Coordinate[];

    if (args.geom instanceof ol.geom.LineString) {
        coordinates = args.geom.getCoordinates();
    }
    else if (args.geom instanceof ol.geom.MultiLineString) {
        coordinates = args.geom.getLineString(0).getCoordinates();
    }
    else if (args.geom instanceof ol.geom.Polygon) {
        coordinates = args.geom.getLinearRing(0).getCoordinates();
    }
    else if (args.geom instanceof ol.geom.MultiPolygon) {
        coordinates = args.geom.getPolygon(0).getLinearRing(0).getCoordinates();
    }
    return coordinates;
}

// move to ol3-fun
function computeDistances(args: { coordinates: ol.Coordinate[]; map: ol.Map }) {
    let sourceProj = args.map.getView().getProjection();
    let coordinates = args.coordinates.map(c => ol.proj.transform(c, sourceProj, 'EPSG:4326'));
    return coordinates.map((c, i) => wgs84Sphere.haversineDistance(i ? coordinates[i - 1] : c, c));
}

cssin("schole-bus", `
html, body, .schole-bus {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom:0;
}

.schole-bus .ol-mouse-position {
    position: absolute;
    top: auto;
    left: auto;
    right: 3em;
    bottom: 1em;
}

.schole-bus .ol-overviewmap {
    left: auto;
    bottom: auto;
    right: 0.5em;
    top: 0.5em;
}

.schole-bus .ol-rotate {
    top: .5em;
    right: 2.5em;
    transition: opacity .25s linear,visibility 0s linear;
}

.schole-bus .ol-search table thead {
    display: none;
}
`);

function bingLayers() {
    return [
        'Road',
        'AerialWithLabels',
        'Aerial'
    ].map(style => new ol.layer.Tile({
        title: style,
        type: "base",
        visible: false,
        preload: Infinity,
        source: new ol.source.BingMaps({
            key: 'As7mdqzf-iBHBqrSHonXJQHrytZ_SL9Z2ojSyOAYoWTceHYYLKUy0C8X8R5IABRg',
            imagerySet: style,
            maxZoom: 19
        })
    }));

}

export function run() {
    // create map container
    let target = document.createElement("div");
    target.className = "schole-bus";
    document.body.appendChild(target);

    // default basemap
    let osmLayer = new ol.layer.Tile({
        type: "base",
        title: "OSM",
        opacity: 0.8,
        visible: true,
        source: new ol.source.OSM()
    });

    // bing + osm as basemaps
    let baseLayers = [].concat(bingLayers()).concat([
        osmLayer
    ]);

    // one layer per geometry type to ensure points appear in front of polygons
    let drawLayers = {
        pointLayer: new ol.layer.Vector({ source: new ol.source.Vector() }),
        lineLayer: new ol.layer.Vector({ source: new ol.source.Vector() }),
        polygonLayer: new ol.layer.Vector({ source: new ol.source.Vector() })
    };

    // create map
    let map = new ol.Map({
        target: target,
        loadTilesWhileAnimating: true,
        loadTilesWhileInteracting: true,
        interactions: ol.interaction.defaults().extend([
            new ol.interaction.DragRotateAndZoom({
                condition: ol.events.condition.altKeyOnly
            })
        ]),
        controls: ol.control.defaults().extend([
            new ol.control.OverviewMap({
                collapseLabel: "»",
                label: "O",
                layers: [new ol.layer.Tile({ source: new ol.source.OSM() })].concat(<any>[drawLayers.polygonLayer, drawLayers.lineLayer, drawLayers.pointLayer])
            })
        ]),
        view: new ol.View({
            zoom: 10,
            center: ol.proj.transform(GreenvilleSc, "EPSG:4326", "EPSG:3857"),
            projection: "EPSG:3857"
        }),
        layers: baseLayers.concat([drawLayers.polygonLayer, drawLayers.lineLayer, drawLayers.pointLayer])
    });

    // oregon trail poi (very useful)
    let oregonTrailLayer = new ol.layer.Vector({
        type: "overlay",
        title: "Oregon Trail POI",
        visible: false,
        source: new ol.source.Vector({
            url: "./app/poi/oregon-trail-kml.xml",
            format: new ol.format.KML({ extractStyles: false })
        })
    });
    map.addLayer(oregonTrailLayer);

    // oregon trail styling
    oregonTrailLayer.setStyle((feature: ol.Feature, res: number) => {
        let featureStyle = <ol.style.Style>feature.getStyle();
        if (featureStyle) return featureStyle;

        let name = <string>feature.get("name");
        let description = <string>feature.get("description");
        let symbology = <string>feature.get("styleUrl");

        let style = [
            {
                text: {
                    text: name,
                    "offset-y": 20,
                    fill: {
                        color: "rgba(0, 0, 0, 1)"
                    },
                    stroke: {
                        color: "rgba(255, 255, 255, 1)",
                        width: 1
                    },
                    scale: 1.5
                }
            },
            {
                star: {
                    radius: 10,
                    radius2: 5,
                    points: 6,
                    fill: {
                        color: "rgba(255, 255, 255, 1)"
                    },
                    stroke: {
                        color: "rgba(255, 0, 0, 1)", width: 1
                    }
                }
            }].map(s => converter.fromJson(s));

        feature.setStyle(style);

        return style;
    });

    // cursor position
    map.addControl(new ol.control.MousePosition({
        projection: "EPSG:4326",
        coordinateFormat: coord => coord.map(v => v.toFixed(5)).join(",")
    }));

    // layer picker
    CreateLayerSwitcher({
        map: map
    });

    // the draw/edit buttons
    CreateToolbar({
        map: map,
        keyword: getParameterByName("keyword") || "schole-bus",
        commentFieldName: WFS_INFO.commentField,
        layers: drawLayers
    });

    // geocoder, will search features in current extent, then do a google search of current extent
    // then feature on entire map then google search of entire world
    CreateSearch({
        map: map,
        layer: drawLayers.pointLayer,
        textFieldName: "comment"
    });

    // control for going to a specific coordinate
    CreateGoto({ map: map });
    CreateFilter({ map: map, layer: drawLayers.pointLayer });

    // info inspector/editor
    CreatePopup({
        map: map,
        autoPopup: true,
        asContent: (feature: ol.Feature) => {
            let editable = {
                [WFS_INFO.commentField]: true
            };

            let visible = {
                [WFS_INFO.keyField]: false,
                gid: false,
                "page-index": false
            };

            let div = document.createElement("div");

            let keys = Object.keys(feature.getProperties()).filter(key => editable[key] || (false !== visible[key])).filter(key => {
                let v = feature.get(key);
                if (typeof v === "string") return true;
                if (typeof v === "number") return true;
                return false;
            });
            div.title = feature.getGeometryName();
            div.innerHTML = `<table>${keys.map(k => `<tr><td>${k}</td><td><input data-event="${k}" ${editable[k] ? "" : "readonly"} value="${feature.get(k)}"/></td></tr>`).join("")}</table>`;

            // show length of linear features
            {
                let geom = feature.getGeometry();
                if (geom instanceof ol.geom.MultiLineString) {
                    let distance = computeDistances({
                        map: map,
                        coordinates: geom.getCoordinates()[0]
                    }).reduce((a, b) => a + b);
                    div.appendChild(html(`<label>Distance: ${formatLength(distance)}`));
                }
            }

            $("input", div).change(args => {
                let target = <HTMLInputElement>args.target;
                let key = target.dataset.event;
                let value = target.value;
                value && feature.set(key, value); // disallow blank
            });

            return div;
        }

    });

    // built-in poi...not useful
    {
        let poi = new ol.layer.Vector({
            source: new ol.source.Vector(),
            minResolution: 1 / 16,
            maxResolution: 256
        });
        map.addLayer(poi);

        {
            let styleHash = <{ [name: string]: ol.style.Style[] }>{};

            poi.setStyle((feature: ol.Feature, res: number) => {
                let symbology = <string>feature.get("poi-data").c;
                let style = styleHash[symbology];
                if (!style) {
                    if (!styles[symbology]) {
                        console.log("undefined symbology:", symbology);
                    }
                    style = styleHash[symbology] = (styles[symbology] || styles["*"]).map(s => converter.fromJson(s));
                }
                return style;
            });
        }

        POI.forEach(region => {
            let features = region.markers.map(m => {
                let g = new ol.geom.Point([parseFloat(m.lng), parseFloat(m.lat)]);
                g.transform("EPSG:4326", "EPSG:3857");
                let feature = new ol.Feature({
                    "poi-data": m
                });
                feature.setGeometry(g);
                return feature;
            });

            poi.getSource().addFeatures(features);
        });

        map.on("click", (args: ol.MapBrowserPointerEvent) => {
            let location = args.pixel;
            let extent = <ol.Extent>[location[0], location[1], location[0], location[1]];
            extent = ol.extent.buffer(extent, 8);

            // reverse y (up is down in pixel world)
            [extent[0], extent[1]] = map.getCoordinateFromPixel([extent[0], extent[1]]);
            [extent[2], extent[3]] = map.getCoordinateFromPixel([extent[2], extent[3]]);
            let v = extent[1];
            extent[1] = extent[3];
            extent[3] = v;

            poi.getSource().forEachFeatureInExtent(extent, feature => {
                let coord = args.coordinate;
                if (!feature.getGeometry().intersectsCoordinate(args.coordinate)) {
                    coord = feature.getGeometry().getClosestPoint(coord);
                }
                console.log(JSON.stringify(feature.get("poi-data"), null, "\t"));
                return true;
            })
        });

    }
}