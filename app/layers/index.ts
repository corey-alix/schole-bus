import ol = require("openlayers");
import { styles } from "../symbology";
import { StyleConverter } from "ol3-symbolizer";
import { create as createWfsLayer } from "./wfs-factory";
import { create as createWmsLayer } from "./wms-factory";

const converter = new StyleConverter();

export function create(options: { map: ol.Map }) {

    let map = options.map;

    // default basemap
    let osmLayer = new ol.layer.Tile({
        type: "base",
        title: "OSM",
        opacity: 0.8,
        visible: true,
        source: new ol.source.OSM()
    });

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

    // bing + osm as basemaps
    let baseLayers = [].concat(bingLayers()).concat([
        osmLayer
    ]);

    // one layer per geometry type to ensure points appear in front of polygons
    // to be moved to a control that operates as a single layer
    let drawLayers = {
        pointLayer: new ol.layer.Vector({ source: new ol.source.Vector() }),
        lineLayer: new ol.layer.Vector({ source: new ol.source.Vector() }),
        polygonLayer: new ol.layer.Vector({ source: new ol.source.Vector() })
    };

    baseLayers.concat([drawLayers.polygonLayer, drawLayers.lineLayer, drawLayers.pointLayer]).forEach(l => map.addLayer(l));

    createWfsLayer({
        map: map,
        url: "//ca0v-pc:8080/geoserver/cite/wfs",
        layer: "uslines"
    }).then(layer => map.addLayer(layer.layer));

    createWfsLayer({
        map: map,
        url: "//ca0v-pc:8080/geoserver/cite/wfs",
        layer: "oregon_trail_poi"
    }).then(layer => map.addLayer(layer.layer));

    createWmsLayer({
        map: map,
        url: '//ca0v-pc:8080/geoserver/cite/wms',
        layer: 'uslines'
    }).then(layer => map.getLayers().insertAt(baseLayers.length, layer.layer));

    createWmsLayer({
        map: map,
        url: '//ca0v-pc:8080/geoserver/cite/wms',
        layer: 'ogrgeojson'
    }).then(layer => map.getLayers().insertAt(baseLayers.length, layer.layer));

    createWmsLayer({
        map: map,
        url: '//ca0v-pc:8080/geoserver/cite/wms',
        layer: 'oregon_trail_poi'
    }).then(layer => map.getLayers().insertAt(baseLayers.length, layer.layer));

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

    let overviewMap = new ol.control.OverviewMap({
        collapseLabel: "»",
        label: "O",
        layers: [new ol.layer.Tile({ source: new ol.source.OSM() })].concat(<any>[drawLayers.polygonLayer, drawLayers.lineLayer, drawLayers.pointLayer])
    });

    map.addControl(overviewMap);

    return {
        drawLayers: drawLayers
    }
}