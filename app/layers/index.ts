import ol = require("openlayers");
import { styles } from "../symbology";
import { StyleConverter } from "ol3-symbolizer";
import { create as createWfsLayer } from "./wfs-factory";
import { create as createWmsLayer } from "./wms-factory";
import { WFS_INFO } from "../wfs-info";

const converter = new StyleConverter();

export function create(options: { map: ol.Map }) {

    let map = options.map;

    // default basemap
    let osmLayer = new ol.layer.Tile({
        type: "base",
        title: "OSM",
        opacity: 1,
        visible: false,
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

    // one layer per geometry type to ensure points appear in front of polygons
    // to be moved to a control that operates as a single layer
    let drawLayers = {
        pointLayer: new ol.layer.Vector({ source: new ol.source.Vector() }),
        lineLayer: new ol.layer.Vector({ source: new ol.source.Vector() }),
        polygonLayer: new ol.layer.Vector({ source: new ol.source.Vector() })
    };

    let backgroundLayers = new ol.layer.Group({
        title: "Backgrounds",
        opacity: 0.5,
        layers: [].concat(bingLayers()).concat([osmLayer])
    });

    let group = new ol.layer.Group({
        title: "Help"
    });

    let workLayers = new ol.layer.Group({
        title: "Editing"
    });

    [drawLayers.polygonLayer, drawLayers.lineLayer, drawLayers.pointLayer]
        .forEach(l => workLayers.getLayers().insertAt(0, l));

    [backgroundLayers, workLayers, group].forEach(l => map.addLayer(l));

    createWmsLayer({
        map: map,
        url: '//ca0v-pc:8080/geoserver/cite/wms',
        layer: 'oregontrailahead',
    }).then(layer => group.getLayers().insertAt(0, layer.layer));

    createWmsLayer({
        map: map,
        url: '//ca0v-pc:8080/geoserver/cite/wms',
        layer: 'oregon_trail_poi',
    }).then(layer => group.getLayers().insertAt(0, layer.layer));

    Object
        .keys(WFS_INFO.layerMapping)
        .map(k => WFS_INFO.layerMapping[k])
        .forEach(layerName => {
            createWmsLayer({
                map: map,
                url: '//ca0v-pc:8080/geoserver/cite/wms',
                layer: layerName
            }).then(layer => group.getLayers().insertAt(0, layer.layer));
        });

    createWmsLayer({
        map: map,
        url: '//ca0v-pc:8080/geoserver/cite/wms',
        layer: 'OSM',
        title: 'Night',
        basemap: true,
        visible: true
    }).then(layer => {
        backgroundLayers.getLayers().insertAt(0, layer.layer);
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