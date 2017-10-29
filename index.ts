import ol = require("openlayers");
import { create as CreateLayerSwitcher } from "./app/layerswitcher";
import { create as CreateToolbar } from "./app/draw/toolbar";
import { create as CreateSearch } from "./app/search";
import { create as CreatePopup } from "./app/popup";
import { create as CreateLayers } from "./app/layers";

import { cssin, html, mixin, getParameterByName } from "ol3-fun/ol3-fun/common";
import { computeDistances, formatLength } from "./app/fun";

import { WFS_INFO } from "./app/wfs-info";

import { GreenvilleSc } from "./app/poi/usa";

cssin("schole-bus", `
html, body, .schole-bus {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom:0;
}

.schole-bus .ol-mouse-position {
    position: absolute;
    top: auto;
    left: auto;
    right: 3em;
    bottom: 1em;
}

.schole-bus .ol-overviewmap {
    left: auto;
    bottom: auto;
    right: 0.5em;
    top: 0.5em;
}

.schole-bus .ol-rotate {
    top: .5em;
    right: 2.5em;
    transition: opacity .25s linear,visibility 0s linear;
}

.schole-bus .ol-search table thead {
    display: none;
}
`);

export function run() {

    // create map container
    let target = document.createElement("div");
    target.className = "schole-bus";
    document.body.appendChild(target);

    // create map
    let map = new ol.Map({
        target: target,
        loadTilesWhileAnimating: true,
        loadTilesWhileInteracting: true,
        controls: ol.control.defaults({
            attribution: false
        }),
        interactions: ol.interaction.defaults().extend([
            new ol.interaction.DragRotateAndZoom({
                condition: ol.events.condition.altKeyOnly
            })
        ]),
        view: new ol.View({
            zoom: 15,
            center: ol.proj.transform(GreenvilleSc, "EPSG:4326", "EPSG:3857"),
            projection: "EPSG:3857"
        })
    });

    // add layers to the map
    let { drawLayers } = CreateLayers({ map: map });

    // cursor position
    map.addControl(new ol.control.MousePosition({
        projection: "EPSG:4326",
        coordinateFormat: coord => coord.map(v => v.toFixed(5)).join(",")
    }));

    // layer picker
    CreateLayerSwitcher({
        map: map
    });

    // the draw/edit buttons
    CreateToolbar({
        map: map,
        keyword: getParameterByName("keyword") || "schole-bus",
        commentFieldName: WFS_INFO.commentField,
        layers: drawLayers
    });

    // geocoder, will search features in current extent, then do a google search of current extent
    // then feature on entire map then google search of entire world
    CreateSearch({
        map: map,
        layers: drawLayers,
        textFieldName: WFS_INFO.commentField
    });

    // info inspector/editor
    CreatePopup({
        map: map,
        autoPopup: true,
        asContent: (feature: ol.Feature) => {
            let editable = {
                [WFS_INFO.commentField]: true
            };

            let visible = {
                [WFS_INFO.keyField]: false,
                fid: false,
                "page-index": false
            };

            let div = document.createElement("div");

            let keys = Object.keys(feature.getProperties()).filter(key => editable[key] || (false !== visible[key])).filter(key => {
                let v = feature.get(key);
                if (typeof v === "string") return true;
                if (typeof v === "number") return true;
                return false;
            });
            div.title = feature.getGeometryName();
            div.innerHTML = `<table>${keys.map(k => `<tr><td>${k}</td><td><input data-event="${k}" ${editable[k] ? "" : "readonly"} value="${feature.get(k)}"/></td></tr>`).join("")}</table>`;

            // show length of linear features
            {
                let geom = feature.getGeometry();
                if (geom instanceof ol.geom.MultiLineString) {
                    let distance = computeDistances({
                        map: map,
                        coordinates: geom.getCoordinates()[0]
                    }).reduce((a, b) => a + b);
                    div.appendChild(html(`<label>Distance: ${formatLength(distance)}`));
                }
            }

            $("input", div).change(args => {
                let target = <HTMLInputElement>args.target;
                let key = target.dataset.event;
                let value = target.value;
                value && feature.set(key, value); // disallow blank
            });

            return div;
        }

    });

}