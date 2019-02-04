import ol = require("openlayers");
import { WfsGeocode as Geocoder } from "ol3-search/ol3-search/providers/wfs";
import { Button } from "ol3-draw/ol3-draw/ol3-button";
import { WFS_INFO } from "../wfs-info";

const internalSrs = "EPSG:3857";

function buffer([x, y]: ol.Pixel, map: ol.Map, pixels: number = 4) {
    let sw = new ol.geom.Point(map.getCoordinateFromPixel([x - pixels, y + pixels]));
    let ne = new ol.geom.Point(map.getCoordinateFromPixel([x + pixels, y - pixels]));

    let extent = ol.extent.createEmpty();
    ol.extent.extend(extent, sw.getExtent());
    ol.extent.extend(extent, ne.getExtent());

    return ol.geom.Polygon
        .fromExtent(extent)
        .transform(map.getView().getProjection(), internalSrs);
}

export function create(options: {
    map: ol.Map;
    layers: {
        pointLayer: ol.layer.Vector;
        lineLayer: ol.layer.Vector;
    }
}) {

    let map = options.map;

    let searchProvider = new Geocoder({
        url: 'http://ca0v-pc:8080/geoserver/cite/wfs',
        count: 1,
        map: map,
        internalSrs: internalSrs,
        params: {
            featureNS: 'http://www.opengeospatial.net/cite',
            featurePrefix: 'cite',
            featureTypes: ['lines'],
            searchNames: 'name'.split(','),
            propertyNames: ['name', 'highway', 'geom']
        }
    });

    let enabled = false;

    map.on("click", (args: ol.MapBrowserPointerEvent) => {
        if (!enabled) return;
        let geom = buffer(args.pixel, map, 12);
        let filter = new ol.format.filter.Intersects("geom", geom, internalSrs);
        let toSrs = map.getView().getProjection();

        searchProvider.execute({
            bounded: false,
            filter: filter
        }).then(results => {
            results.forEach(r => {
                if (r.original instanceof ol.Feature) {
                    let geom = (r.original.clone()).getGeometry().transform(internalSrs, toSrs);
                    let feature = new ol.Feature();
                    feature.setGeometryName(WFS_INFO.geomField);
                    feature.setGeometry(geom);
                    feature.set(WFS_INFO.commentField, r.title);
                    // to be abstracted by a feature collection
                    if (geom instanceof ol.geom.Point) {
                        options.layers.pointLayer.getSource().addFeature(feature);
                    } else if (geom instanceof ol.geom.MultiLineString) {
                        options.layers.lineLayer.getSource().addFeature(feature);
                    } else if (geom instanceof ol.geom.LineString) {
                        let multiLineString = new ol.geom.MultiLineString([geom.getCoordinates()]);
                        feature.setGeometry(multiLineString);
                        options.layers.lineLayer.getSource().addFeature(feature);
                    } else {
                        console.warn("unsupported geometry type:", geom.getType());
                    }
                }
            });
        });
    });

    let clickAndAddButton = Button.create({
        map: options.map,
        position: "top-8 left-2",
        label: "+=",
        title: "Click and Add"
    });

    clickAndAddButton.on("change:active", () => {
        enabled = clickAndAddButton.get("active");
    });

    clickAndAddButton.set("active", false);

}