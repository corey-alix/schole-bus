export const WFS_INFO = {
    srsName: "EPSG:3857",
    wfsUrl: `${location.protocol}//${location.hostname}:8080/geoserver/cite/wfs`,
    featureNS: "http://www.opengeospatial.net/cite",
    featurePrefix: "cite",
    gidField: "fid",
    keyField: "domain", //DOMAIN",
    commentField: "description",
    geomField: "geom",
    layerMapping: {
        "Point": "scholepoints",
        "MultiLineString": "scholelines",
        "MultiPolygon": "scholepolygons"
    }
};
