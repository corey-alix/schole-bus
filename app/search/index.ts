import ol = require("openlayers");
import $ = require("jquery");
import { navigation } from "ol3-fun";
import { SearchForm } from "ol3-search";
import { Google } from "ol3-search/ol3-search/providers/google";
import { Grid } from "ol3-grid";
import { StyleConverter } from "ol3-symbolizer";

let symbolizer = new StyleConverter();

export function create(args: { map: ol.Map }) {
    let map = args.map;

    let searchResults = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: (feature: ol.Feature, resolution: number) => {
            let style = feature.getStyle();
            if (!style) {
                style = symbolizer.fromJson({
                    circle: {
                        radius: 4,
                        fill: {
                            color: "rgba(33, 33, 33, 0.2)"
                        },
                        stroke: {
                            color: "#F00"
                        }
                    },
                    text: {
                        text: feature.get("text")
                    }
                });
                feature.setStyle(style);
            }
            return <ol.style.Style>style;
        }
    });

    map.addLayer(searchResults);

    Grid.create({
        map: map,
        className: "ol-grid",
        position: "top-4 right",
        currentExtent: false,
        autoCollapse: false,
        autoPan: true,
        labelAttributeName: "text",
        showIcon: false,
        layers: [searchResults]
    });

    let form = SearchForm.create({
        className: 'ol-search top-2 right',
        expanded: false,
        autoCollapse: true,        
        autoClear: true,
        closedText: "G",
        placeholderText: "Google Map Search",
        fields: [
            {
                name: "query",
                alias: ""
            }
        ]
    });

    let searchProvider = new Google();

    form.on("change", args => {
        if (!args.value) return;

        let searchArgs = searchProvider.getParameters(args.value, map);

        $.ajax({
            url: searchArgs.url,
            method: 'GET',
            data: searchArgs.params,
            dataType: 'json'
        }).then(json => {
            let results = searchProvider.handleResponse(json);
            results.some(r => {
                console.log(r);
                {
                    let [lon, lat] = ol.proj.transform([r.lon, r.lat], "EPSG:4326", "EPSG:3857");
                    let feature = new ol.Feature(new ol.geom.Point([lon, lat]));
                    feature.set("text", r.original.formatted_address);
                    searchResults.getSource().addFeature(feature);
                    navigation.zoomToFeature(map, feature, { minResolution: 1, padding: 200 });
                }
                return true;
            });
        }).fail(() => {
            console.error("geocoder failed");
        });

    });

    map.addControl(form);

}
