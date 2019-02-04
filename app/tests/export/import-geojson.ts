import $ = require("jquery");
import { importAs as importGeoJson } from '../../export/export-to-geojson';

export function run() {
    let geojsonUrl = requirejs.toUrl("app/tests/data/return-trip-2017-geojson.json");

    $.ajax({
        type: "GET",
        url: geojsonUrl,
        contentType: "application/text",
        dataType: "text",
        success: geojson => {
            importGeoJson({
                map: null,
                layers: {
                    pointLayer: null,
                    lineLayer: null,
                    polygonLayer: null,
                },
                json: geojson
            });
        }
    });

}