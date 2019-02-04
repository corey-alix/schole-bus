import ol = require("openlayers");
import { Input } from "ol3-input";
import { WFS_INFO } from "../wfs-info";
import { zoomToFeature } from "ol3-fun/ol3-fun/navigation";

export function create(options: {
    map: ol.Map, layers: {
        pointLayer: ol.layer.Vector
    }
}) {
    let map = options.map;
    let layer = options.layers.pointLayer;
    // search for a state using 2 character state code
    let input = Input.create({
        map: map,
        className: "ol-input",
        position: "top left-2",
        closedText: "?",
        openedText: "?",
        autoChange: true,
        autoSelect: true,
        autoClear: false,
        autoCollapse: false,
        placeholderText: "Filter",
        provider: null, // do not auto-search,
        regex: null, // allow blanks
    });

    layer.getSource().once("change", () => {
        let styler = layer.getStyleFunction();
        let values = <string[]>[];

        let visibleFeatures = layer.getSource().getFeatures();
        let invisibleStyle = new ol.style.Style();

        layer.setStyle((feature: ol.Feature, resolution: number) => {
            return -1 < visibleFeatures.indexOf(feature) ? styler(feature, resolution) : invisibleStyle;
        });

        layer.getSource().on("addfeature", () => {
            input.input.value = "";
            input.collapse();
            values = [];
            doit(false);
        });

        // search existing features for STATE_ABBR, zoom to first one found
        // if none found, invoke change handler
        input.on("change", args => {
            values = args.value.toLocaleLowerCase().split("+").filter(v => v.length);
            doit();
        });

        let doit = (autoZoom = true) => {
            if (!values.length) {
                visibleFeatures = layer.getSource().getFeatures();
            } else {
                visibleFeatures = [];
                layer.getSource().forEachFeature(feature => {
                    let text = <string>feature.get(WFS_INFO.commentField);
                    if (!text) return;
                    if (values.every(value => -1 < text.toLocaleLowerCase().indexOf(value))) {
                        visibleFeatures.push(feature);
                    }
                });
            }

            if (autoZoom && visibleFeatures.length) {
                let extent = ol.extent.createEmpty();
                visibleFeatures.forEach(f => ol.extent.extend(extent, f.getGeometry().getExtent()));
                zoomToFeature(map, new ol.Feature(ol.geom.Polygon.fromExtent(extent)));
            }
            layer.getSource().refresh();
        };

    });
}