import ol = require("openlayers");
import { Directions } from "ol3-mapquest";
import { Button, ButtonOptions } from "ol3-draw/ol3-draw/ol3-button";
import { defaults } from "ol3-fun";
import { WFS_INFO } from "../wfs-info";

const MapQuestDirections = Directions.create({
    url: "//www.mapquestapi.com/directions/v2/route",
    key: "cwm3pF5yuEGNp54sh96TF0irs5kCLd5y"
});

function unflatten<T>(items: T[], dimension = 2): Array<T[]> {
    let result = <Array<T[]>>[];
    let size = Math.floor(items.length / dimension);
    for (let i = 0; i < size; i++) {
        result[i] = [];
        for (let j = 0; j < dimension; j++) {
            result[i][j] = items[i * dimension + j];
        }
    }
    return result;
}

function asLatLng(point: ol.geom.Point) {
    point = point.clone();
    point.transform("EPSG:3857", "EPSG:4326");
    return point.getCoordinates()
        .map(v => v.toFixed(6))
        .reverse()
        .join(",");
}

export function directions(options: {
    from: ol.Feature;
    to: ol.Feature;
    result: ol.Feature;
}) {
    let from = new ol.geom.Point(ol.extent.getCenter(options.from.getGeometry().getExtent()));
    let to = new ol.geom.Point(ol.extent.getCenter(options.to.getGeometry().getExtent()));

    return MapQuestDirections.directions({
        from: asLatLng(from),
        to: asLatLng(to)
    }).then(result => {
        let coords = <ol.Coordinate[]>unflatten(result.route.shape.shapePoints, 2);
        coords.forEach(c => c.reverse());

        let leg = new ol.geom.MultiLineString([coords]);
        leg.transform("EPSG:4326", "EPSG:3857");
        options.result.setGeometry(leg);
    });

}

/**
 * When active user clicks 1st feature/location
 * user clicks 2nd feature/location
 * directions generated from 1st to 2nd
 * 2nd becomes 1st
 * user clicks 3rd (the new second), etc.
 */
export interface DriveOptions extends ButtonOptions {
    routeLayer: ol.layer.Vector;
    commentFieldName?: string;
}

/**
 * When active, user clicks features and routes appear between them
 */
export class DriveButton extends Button {

    static DEFAULT_OPTIONS: DriveOptions = {
        routeLayer: null,
        className: "ol-driving-directions",
        position: "top right",
        label: "DD",
        title: "Driving Directions",
        eventName: "select-waypoint",
        commentFieldName: "comment",
        buttonType: DriveButton
    }

    static create(options?: DriveOptions) {
        options = defaults({}, options, DriveButton.DEFAULT_OPTIONS);
        return Button.create(options);
    }

    constructor(options: DriveOptions) {
        super(options);

        let selection = new ol.interaction.Select({
            condition: ol.events.condition.click,
            multi: false
        });

        selection.on("select", args => {
            let features = selection.getFeatures().getArray().filter(f => f.getGeometry() instanceof ol.geom.Point);
            switch (features.length) {
                case 0: break;
                case 1: break;
                case 2: {
                    debugger;
                    let from = features[0];
                    let to = features[1];
                    let routeLine = new ol.Feature({
                        [options.commentFieldName]: `To ${to.get(options.commentFieldName)}`
                    });
                    routeLine.setGeometryName(WFS_INFO.geomField);
                    directions({ from: from, to: to, result: routeLine }).then(() => {
                        options.routeLayer.getSource().addFeature(routeLine);
                    });
                    break;
                }
                default: break;
            }
        });

        this.once("change:active", () => {

            [selection].forEach(i => {
                i.setActive(false);
                options.map.addInteraction(i);
            });

            this.handlers.push(() => {
                [selection].forEach(i => {
                    i.setActive(false);
                    options.map.removeInteraction(i);
                });
            });
        });

        this.on("change:active", () => {
            let active = this.get("active");
            [selection].forEach(i => i.setActive(active));
            if (!active) selection.getFeatures().clear();
        });

    }

}