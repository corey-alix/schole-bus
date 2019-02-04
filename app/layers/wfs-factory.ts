/**
 * Create a WFS layer given an url and a layer name (featureType)
 */
import ol = require("openlayers");
import { defaults } from "ol3-fun";
import { range } from "ol3-fun";

export module Wfs {

    export interface Property {
        name: string;
        maxOccurs: number;
        minOccurs: number;
        nillable: boolean;
        type: string;
        localType: string;
    }

    export interface FeatureType {
        typeName: string;
        properties: Property[];
    }

    export interface DescribeFeatureType {
        elementFormDefault: string;
        targetNamespace: string;
        targetPrefix: string;
        featureTypes: FeatureType[];
    }

}


export class Wfs {

    static DEFAULT_OPTIONS = {
    }

    constructor(public options: { wfsUrl: string }) {

    }


    getCapabilities(typeName: string) {
        fetch(`${this.options.wfsUrl}?SERVICE=WFS&VERSION=1.1.0&REQUEST=GetCapabilities&outputFormat=application/xml`).then(stream => {
            stream.text().then(text => {
                let xml = new DOMParser().parseFromString(text, "text/xml");
                // not worth it
            })
        });
    }

    describeFeatureType(typeName: string) {
        fetch(`${this.options.wfsUrl}?SERVICE=WFS&VERSION=1.1.0&REQUEST=DescribeFeatureType&outputFormat=application/json&typeName=${typeName}`).then(stream => {
            stream.json().then((json: Wfs.DescribeFeatureType) => {
                json.featureTypes.find(v => v.typeName === typeName).properties.map(v => ({
                    name: v.name,
                    type: v.localType,
                }))
            });
        });
    }
}

export const DEFAULT_OPTIONS = {
    visible: false
}

export function create(options: {
    map: ol.Map;
    url: string;
    layer: string;
    visible?: boolean;
}) {

    options = defaults(options, DEFAULT_OPTIONS);
    
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
            visible: options.visible,
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