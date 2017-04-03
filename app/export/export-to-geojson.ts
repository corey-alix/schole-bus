import ol = require("openlayers");
import { WFS_INFO } from "../wfs-info";

export function exportAs(options: {
    map: ol.Map;
    features?: ol.Feature[];
}) {
    let format = new ol.format.GeoJSON();
    let features = options.features;

    if (!features) {
        features = [];
        options.map.getLayers().getArray()
            .filter(l => l instanceof ol.layer.Vector)
            .map(l => (<ol.layer.Vector>l).getSource().getFeatures())
            .forEach(fs => features = features.concat(fs));
    }

    console.log(format.writeFeatures(features, {
        dataProjection: "EPSG:4326",
        featureProjection: options.map.getView().getProjection(),
        decimals: 6
    }));
}

export function importAs(options: {
    ignoreId?: true,
    map: ol.Map;
    layers: {
        pointLayer: ol.layer.Vector;
        lineLayer: ol.layer.Vector;
        polygonLayer: ol.layer.Vector;
    };
    json: string;
}) {
    let format = new ol.format.GeoJSON({
        defaultDataProjection: "EPSG:4326",
        featureProjection: options.map.getView().getProjection(),
        geometryName: WFS_INFO.geomField,
    });

    let features = format.readFeatures(options.json);
    if (options.ignoreId) {
        debugger;
        features.forEach(f => f.setId(""));
    }

    if (options.layers.pointLayer) {
        let source = options.layers.pointLayer.getSource();
        source.addFeatures(features.filter(f => f.getGeometry() instanceof ol.geom.Point));
    }

    if (options.layers.lineLayer) {
        let source = options.layers.lineLayer.getSource();
        source.addFeatures(features.filter(f => f.getGeometry() instanceof ol.geom.MultiLineString));
    }

    if (options.layers.polygonLayer) {
        let source = options.layers.polygonLayer.getSource();
        source.addFeatures(features.filter(f => f.getGeometry() instanceof ol.geom.MultiPolygon));
    }

}