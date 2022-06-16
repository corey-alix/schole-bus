import { data } from "./data.js";
const globals = {
    mapKey: "",
};
const markers = loadMarkers();
function promptFor(key) {
    globals[key] =
        localStorage.getItem(key) || "";
    if (!globals[key]) {
        globals[key] =
            prompt(`Enter your ${key}`) || "";
        localStorage.setItem(key, globals[key]);
    }
    return globals[key];
}
function showAllMarkers(map) {
    const bounds = new mapboxgl.LngLatBounds();
    markers.forEach((m) => bounds.extend(asPoint(m)));
    map.fitBounds(bounds, {
        padding: {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50,
        },
    });
    const polyline = markers.map((marker) => [marker.lon, marker.lat]);
    const source = map.getSource("route");
    if (!source) {
        map.addSource("route", {
            type: "geojson",
            data: {
                type: "Feature",
                properties: {},
                geometry: {
                    type: "LineString",
                    coordinates: polyline,
                },
            },
        });
    }
    else {
        source.setData({
            type: "Feature",
            properties: {},
            geometry: {
                type: "LineString",
                coordinates: polyline,
            },
        });
    }
}
function addMarker(item, map) {
    const { text, lon, lat } = item;
    const popup = new mapboxgl.Popup({
        offset: 25,
    }).setText(text);
    const marker = new mapboxgl.Marker({
        draggable: true,
        text: text,
    });
    // set marker text
    marker
        .setLngLat([lon, lat])
        .setPopup(popup)
        .addTo(map);
    marker.on("dragend", () => {
        const lngLat = marker.getLngLat();
        item.lat = lngLat.lat;
        item.lon = lngLat.lng;
        showAllMarkers(map);
        saveMarkers();
    });
    return marker;
}
function createMap() {
    // creates a maptiler map
    const map = new mapboxgl.Map({
        container: "map",
        style: `https://api.maptiler.com/maps/fd41a7e9-86be-4da8-aff1-f8edfcf37a4b/style.json?key=${globals.mapKey}`,
        center: [-83.5, 35],
        zoom: 12,
    });
    return map;
}
function asPoint(marker) {
    return [marker.lon, marker.lat];
}
export function run() {
    promptFor("mapKey");
    const map = createMap();
    if (!markers.length) {
        data.forEach((d) => markers.push(d));
    }
    markers.forEach((marker) => addMarker(marker, map));
    map.on("load", () => {
        showAllMarkers(map);
        map.addLayer({
            id: "route",
            type: "line",
            source: "route",
            layout: {
                "line-join": "round",
                "line-cap": "round",
            },
            paint: {
                "line-color": "#888",
                "line-width": 4,
            },
        });
    });
    const input = document.getElementById("search");
    input.addEventListener("change", async (e) => {
        const value = input.value;
        // if value is a comma-separated list of numbers
        if (value.match(/^[-0-9.]+, [-0-9.]+$/)) {
            // get the numbers
            const numbers = value
                .trim()
                .split(",")
                .map((n) => parseFloat(n));
            // if there are two numbers create a marker
            if (numbers.length === 2) {
                input.value = numbers
                    .reverse()
                    .join(",");
            }
        }
    });
    const geocoder = new maptiler.Geocoder({
        input: "search",
        key: globals.mapKey,
        language: "en",
        bbox: [-135, 20, -80, 50],
    });
    geocoder.on("select", function (item) {
        const center = item.center;
        // add a marker at the center
        const marker = {
            lon: center[0],
            lat: center[1],
            text: item.text,
        };
        addMarker(marker, map);
        markers.push(marker);
        saveMarkers();
        const bounds = map.getBounds();
        if (markers.length > 0)
            bounds.extend(asPoint(markers[markers.length - 1]));
        showAllMarkers(map);
    });
}
function saveMarkers() {
    localStorage.setItem("markers", JSON.stringify(markers));
}
function loadMarkers() {
    return JSON.parse(localStorage.getItem("markers") ||
        "[]");
}
//# sourceMappingURL=index.js.map