import ol = require("openlayers");
const wgs84Sphere = new ol.Sphere(6378137);

// move to ol3-fun
export const MeterConvert = {
    "m": 1,
    "km": 1 / 1000,
    "ft": 3.28084,
    "mi": 0.000621371
}

export function formatLength(l: number, longUom = "mi") {
    let uom = l < 100 ? "m" : longUom;
    return (MeterConvert[uom] * l).toPrecision(5) + " " + uom;
}

// move to ol3-fun
export function flatten(args: { geom: ol.geom.Geometry }) {
    let coordinates: ol.Coordinate[];

    if (args.geom instanceof ol.geom.LineString) {
        coordinates = args.geom.getCoordinates();
    }
    else if (args.geom instanceof ol.geom.MultiLineString) {
        coordinates = args.geom.getLineString(0).getCoordinates();
    }
    else if (args.geom instanceof ol.geom.Polygon) {
        coordinates = args.geom.getLinearRing(0).getCoordinates();
    }
    else if (args.geom instanceof ol.geom.MultiPolygon) {
        coordinates = args.geom.getPolygon(0).getLinearRing(0).getCoordinates();
    }
    return coordinates;
}

// move to ol3-fun
export function computeDistances(args: { coordinates: ol.Coordinate[]; map: ol.Map }) {
    let sourceProj = args.map.getView().getProjection();
    let coordinates = args.coordinates.map(c => ol.proj.transform(c, sourceProj, 'EPSG:4326'));
    return coordinates.map((c, i) => wgs84Sphere.haversineDistance(i ? coordinates[i - 1] : c, c));
}

