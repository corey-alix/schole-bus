import ol = require("openlayers");
import { Popup, PopupOptions } from "ol3-popup";
import { Button } from "ol3-draw/ol3-draw/ol3-button";
import { cssin, debounce } from "ol3-fun";

function isChildOf(child: Element, parent: Element) {
    if (!child) return false;
    if (child === parent) return true;
    return isChildOf(child.parentElement, parent);
}

function hasFocus(parent: Element) {
    return isChildOf(document.activeElement, parent);
}

function hasInteraction(map: ol.Map, type: any) {
    return map.getInteractions()
        .getArray()
        .filter(i => i.get("active"))
        .some(i => i instanceof type);
}

function hasControl(map: ol.Map, type: any) {
    return map.getControls()
        .getArray()
        .filter(i => i.get("active"))
        .some(i => i instanceof type);
}

export function create(options: PopupOptions) {

    let map = options.map;

    let popup = Popup.create(options);
    popup.set("active", false);

    let hiliteLayer = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: (feature: ol.Feature) => {
            return new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: "rgba(0, 255, 255, 1)",
                    width: 1
                })
            });
        }
    });
    map.addLayer(hiliteLayer);

    popup.pages.on("goto", () => {
        hiliteLayer.getSource().clear();
        let feature = popup.pages.activePage.feature;
        feature && hiliteLayer.getSource().addFeature(feature);
    });

    popup.pages.on("clear", () => {
        hiliteLayer.getSource().clear();
    });

    popup.on("hide", () => popup.set("active", false));
    {
        let doit = event => {
            let pixel = map.getEventPixel(event);
            if (map.hasFeatureAtPixel(pixel)) {
                let features = [];
                map.forEachFeatureAtPixel(pixel, f => features.push(f));
                map.dispatchEvent({
                    type: "hover",
                    pixel: pixel,
                    features: features
                });
            }
        };

        map.getViewport().addEventListener("click", event => {
            if (hasFocus(popup.domNode)) return;
            if (hasControl(map, Button)) return;
            let pixel = map.getEventPixel(event);
            let activate = map.hasFeatureAtPixel(pixel);
            if (!activate) {
                popup.hide();
                return;
            }
            doit(event);
        });

        map.getViewport().addEventListener("mousemove", debounce(event => {
            if (!popup.get("active")) return;
            if (hasFocus(popup.domNode)) return;
            if (hasControl(map, Button)) return;
            doit(event);
        }, 200));

        map.getViewport().addEventListener("mousemove", debounce(event => {
            if (hasFocus(popup.domNode)) return;
            if (hasControl(map, Button)) return;
            let pixel = map.getEventPixel(event);
            let activate = map.hasFeatureAtPixel(pixel);
            if (!activate) {
                popup.hide();
                return;
            }
            popup.set("active", activate);
            doit(event);
        }, 2000));
    }

    map.on("hover", (args: {
        pixel: ol.Pixel;
        features: ol.Feature[];
    }) => {
        popup.pages.clear();
        popup.pages.addFeature(args.features[0], {
            searchCoordinate: map.getCoordinateFromPixel(args.pixel)
        });
        popup.pages.goto(0);
    });

}