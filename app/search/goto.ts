import ol = require("openlayers");
import { cssin, defaults, dms } from "ol3-fun";
import { Input, InputOptions } from "ol3-input";
import { Button } from "ol3-draw/ol3-draw/ol3-button";

export function create(options: InputOptions) {

    cssin("goto", `
.ol-goto input {
    text-transform: uppercase;
}
`
    );

    let DEFAULT_OPTIONS = <InputOptions>{
        className: "ol-goto",
        position: "bottom left",
        autoCollapse: true,
        placeholderText: `DMS`
    };

    options = defaults({}, options, DEFAULT_OPTIONS);
    let input = Input.create(options);

    input.on("change", args => {
        let map = options.map;
        let result = dms.parse(args.value.toLocaleUpperCase());
        if (typeof result === "number") {
            alert(result);
        } else {
            let location = new ol.geom.Point(<ol.Coordinate>[result.lon, result.lat]);
            location.transform("EPSG:4326", map.getView().getProjection());
            map.getView().setCenter(location.getFirstCoordinate());
        }

    });

}