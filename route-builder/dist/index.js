import { data } from "./data.js";
export function run() {
    console.log("run");
    const map = createMap();
    const markers = JSON.parse(localStorage.getItem("markers") ||
        "[]");
    if (!markers.length) {
        data.forEach((d) => markers.push(d));
    }
    markers.forEach((marker) => addMarker({
        text: marker.text,
        center: [
            marker.lon,
            marker.lat,
        ],
    }, map));
    if (markers.length) {
        const marker = markers[markers.length - 1];
        map.setCenter([
            marker.lon,
            marker.lat,
        ]);
    }
    map.on("load", () => {
        showMarkers(markers, map);
        const polyline = [];
        markers.forEach((marker) => polyline.push([
            marker.lon,
            marker.lat,
        ]));
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
                "line-width": 8,
            },
        });
    });
    const input = document.getElementById("search");
    input.addEventListener("change", async (e) => {
        const value = input.value;
        // if value is a comma separated list of numbers
        if (value.match(/^[-0-9.]+, [-0-9.]+$/)) {
            // get the numbers
            const numbers = value
                .split(",")
                .map((n) => parseFloat(n));
            // if there are two numbers create a marker
            if (numbers.length === 2) {
                const marker = {
                    lon: numbers[0],
                    lat: numbers[1],
                    text: value,
                };
                input.value = numbers
                    .reverse()
                    .join(",");
            }
        }
    });
    const geocoder = new maptiler.Geocoder({
        input: "search",
        key: "f0zkb15NK1sqOcE72HCf",
        language: "en",
        bbox: [-135, 20, -80, 50],
    });
    geocoder.on("select", function (item) {
        console.log("Selected", item);
        console.log("relevance and center", item.relevance, item.center);
        const center = item.center;
        // add a marker at the center
        addMarker(item, map);
        markers.push({
            lon: center[0],
            lat: center[1],
            text: item.text,
        });
        localStorage.setItem("markers", JSON.stringify(markers));
        map.setCenter(asPoint(markers[markers.length - 1]));
        const bounds = map
            .getBounds()
            .toArray();
        if (markers.length > 0)
            bounds.push(asPoint(markers[markers.length - 1]));
        if (markers.length > 1)
            bounds.push(asPoint(markers[markers.length - 2]));
        map.fitBounds(bounds, {
            padding: {
                top: 10,
                bottom: 25,
                left: 15,
                right: 5,
            },
        });
    });
}
function showMarkers(markers, map) {
    if (markers.length > 1) {
        const bounds = [
            asPoint(markers[markers.length - 2]),
            asPoint(markers[markers.length - 1]),
        ];
        map.fitBounds(bounds, {
            padding: {
                top: 10,
                bottom: 25,
                left: 15,
                right: 5,
            },
        });
    }
}
function addMarker(item, map) {
    const { text, center } = item;
    const popup = new mapboxgl.Popup({
        offset: 25,
    }).setText(text);
    const marker = new mapboxgl.Marker({
        draggable: true,
        text: text,
    });
    // set marker text
    marker
        .setLngLat(center)
        .setPopup(popup)
        .addTo(map);
}
function createMap() {
    // creates a maptiler map
    const map = new mapboxgl.Map({
        container: "map",
        style: "https://api.maptiler.com/maps/fd41a7e9-86be-4da8-aff1-f8edfcf37a4b/style.json?key=f0zkb15NK1sqOcE72HCf",
        center: [-83.5, 35],
        zoom: 12,
    });
    return map;
}
function asPoint(marker) {
    return [marker.lon, marker.lat];
}
function promptForAccessKey() {
    if (!localStorage.getItem("accessKey")) {
        const key = prompt("Please enter your access key:", "");
        if (key) {
            localStorage.setItem("accessKey", key);
        }
    }
    return localStorage.getItem("accessKey");
}
async function geoLocate(address) {
    const accessKey = promptForAccessKey();
    const url = `http://open.mapquestapi.com/geocoding/v1/address?key=${accessKey}&location=${address}`;
    const location = await fetch(url);
    const data = (await location.json());
    return data;
}
//# sourceMappingURL=index.js.map