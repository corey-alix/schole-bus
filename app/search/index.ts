import ol = require("openlayers");
import { create as createGoto } from "./goto";
import { create as CreateFilter } from "./filter";
import { create as createSearchForm } from "./search-input";
import { create as createAddToMapButton } from "./what-is-here-button";

import { WFS_INFO } from "../wfs-info";

export function create(options: {
    map: ol.Map;
    layers: {
        pointLayer: ol.layer.Vector;
        lineLayer: ol.layer.Vector;
    };
    textFieldName?: string;
}) {
    createGoto(options);
    CreateFilter(options);
    createSearchForm(options);
    createAddToMapButton(options);
}
