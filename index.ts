import ol = require("openlayers");
import { Popup } from "ol3-popup";
import { create as CreateToolbar } from "./app/draw/toolbar";
import { cssin, html, mixin } from "ol3-fun/ol3-fun/common";
import { UpperPeninsula } from "./app/poi/usa";

cssin("schole-bus", `
html, body, .schole-bus {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom:0;
}`);

export function run() {
    // create map container
    let target = document.createElement("div");
    target.className = "schole-bus";
    document.body.appendChild(target);

    // create map
    let map = new ol.Map({
        target: target,
        view: new ol.View({
            zoom: 10,
            center: ol.proj.transform(UpperPeninsula, "EPSG:4326", "EPSG:3857"),
            projection: "EPSG:3857"
        }),
        layers: [
            new ol.layer.Tile({
                opacity: 0.8,
                source: new ol.source.OSM()
            })]
    });

    Popup.create({ map: map, autoPopup: false });
    CreateToolbar({ map: map });
}