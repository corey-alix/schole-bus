import ol = require("openlayers");
import $ = require("jquery");
import { navigation } from "ol3-fun";
import { SearchForm } from "ol3-search";
import { GoogleGeocode } from "ol3-search/ol3-search/providers/google";
import { LayerGeocode } from "ol3-search/ol3-search/providers/layer";
import { Result as GeocodeResult } from "ol3-search/ol3-search/providers/index";
import { Grid } from "ol3-grid";
import { StyleConverter } from "ol3-symbolizer";
import { WFS_INFO } from "../wfs-info";

let symbolizer = new StyleConverter();

export function create(options: {
    map: ol.Map;
    layer?: ol.layer.Vector;
    textFieldName?: string;
}) {
    let map = options.map;
    options.textFieldName = options.textFieldName || WFS_INFO.commentField;

    // container for results if not provided    
    let searchResults = options.layer;
    if (!searchResults) {
        searchResults = new ol.layer.Vector({
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
                            text: feature.get(options.textFieldName)
                        }
                    });
                    feature.setStyle(style);
                }
                return <ol.style.Style>style;
            }
        });

        map.addLayer(searchResults);
    }

    // grid show showing search results
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

    // form for doing the actual search
    let form = SearchForm.create({
        className: 'ol-search',
        position: 'top-2 right',
        expanded: false,
        autoCollapse: true,
        autoClear: true,
        closedText: "G",
        title: "Search",
        fields: [
            {
                name: "query",
                length: 50
            }
        ]
    });

    // search existing features
    let layerGeocoder = new LayerGeocode({
        count: 1,
        map: map,
        params: {
            layers: [options.layer],
            query: '',
            searchNames: [WFS_INFO.commentField],
            propertyNames: [WFS_INFO.commentField]
        }
    });

    // search google if not found in layer
    let searchProvider = new GoogleGeocode({
        count: 1,
        map: map
    });

    form.on("change", args => {
        if (!args.value) return;

        let showResults = (results: GeocodeResult<any>[], zoomOnly = false) => {
            results.some(r => {
                if (!zoomOnly) {
                    let geom = new ol.geom.Point([r.lon, r.lat]).transform("EPSG:4326", map.getView().getProjection());
                    let feature = new ol.Feature();
                    feature.setGeometryName(WFS_INFO.geomField);
                    feature.setGeometry(geom);
                    feature.set(options.textFieldName, r.title);
                    searchResults.getSource().addFeature(feature);
                }
                r.extent.transform("EPSG:4326", map.getView().getProjection());
                navigation.zoomToFeature(map, new ol.Feature(r.extent), {
                    minResolution: 1,
                    padding: 200
                });
                return true;
            });
        };

        let search = (bounded: boolean) => {
            layerGeocoder.options.bounded = bounded;
            searchProvider.options.bounded = bounded;

            layerGeocoder.execute({
                query: args.value.query,
                searchNames: [WFS_INFO.commentField]
            }).then(results => {
                if (results.length) {
                    showResults(results, true);
                } else {
                    searchProvider.execute(args.value).then(results => {
                        if (results.length) {
                            showResults(results);
                        } else {
                            if (bounded) search(false);
                        }
                    });
                }
            });
        };

        search(true);

    });

    map.addControl(form);

}
