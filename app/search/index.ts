import ol = require("openlayers");
import { Input } from "ol3-input";
import { Grid } from "ol3-grid";

export function create(args: { map: ol.Map }) {
    let map = args.map;
    let searchResults = new ol.layer.Vector({ source: new ol.source.Vector() });
    map.addLayer(searchResults);

    Input.create({
        map: map,
        source: searchResults.getSource(),
        className: "ol-input",
        position: "top right"
    });

    Grid.create({
        map: map,
        className: "ol-grid",
        position: "top-2 right",
        currentExtent: false,
        autoCollapse: false,
        autoPan: true,
        labelAttributeName: "text",
        showIcon: false,
        layers: [searchResults]
    });

}
