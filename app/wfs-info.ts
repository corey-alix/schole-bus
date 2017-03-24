export const WFS_INFO = {
    srsName: "EPSG:3857",
    wfsUrl: `${location.protocol}//${location.hostname}:8080/geoserver/cite/wfs`,
    featureNS: "http://www.opengeospatial.net/cite",
    featurePrefix: "cite",
    keyField: "strname", //DOMAIN",
    commentField: "comment",
    geomField: "geom",
    layerMapping: {
        "Point": "addresses", //SCHOLEBUS",
        "MultiLineString": "streets",
        "MultiPolygon": "parcels"
    }
};
