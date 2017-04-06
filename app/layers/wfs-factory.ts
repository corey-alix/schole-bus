/**
 * Create a WFS layer given an url and a layer name (featureType)
 */
import ol = require("openlayers");
import { range } from "ol3-fun";

export function create(options: {
    map: ol.Map;
    url: string;
    layer: string;
}) {

    return new Promise<{ layer: ol.layer.Vector }>((resolve, reject) => {

        let srsName = options.map.getView().getProjection().getCode();

        let strategy = ol.tilegrid.createXYZ({
            maxZoom: 24,
            tileSize: [256, 256]
        });

        let filter = ``;//new ol.format.filter.EqualTo("highway", "tertiary");

        let vectorSource = new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            url: (extent: ol.Extent, resolution: number, projection: any) => {
                return `${options.url}?service=WFS&version=1.1.0&request=GetFeature&typename=${options.layer}&outputFormat=application/json&srsname=${srsName}&bbox=${extent.join(',')},${srsName}&maxFeatures=250`;
            },
            strategy: ol.loadingstrategy.tile(strategy)
        });

        let resolutions = strategy.getResolutions();
        let vector = new ol.layer.Vector({
            type: "overlay",
            title: options.layer,
            visible: false,
            source: vectorSource,
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 255, 1.0)',
                    width: 2
                })
            })
        });

        resolve({
            layer: vector
        });
    });
}