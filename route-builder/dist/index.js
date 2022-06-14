export function run() {
    console.log("run");
    const map = createMap();
    // remember this marker
    const markers = JSON.parse(localStorage.getItem("markers") ||
        "[]");
    if (!markers.length) {
        data.forEach(d => markers.push(d));
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
        const polyline = [];
        markers.forEach((marker) => polyline.push([
            marker.lon,
            marker.lat,
        ]));
        if (markers.length > 1) {
            map.fitBounds([
                asPoint(markers[markers.length - 2]),
                asPoint(markers[markers.length - 1]),
            ]);
        }
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
    const geocoder = new maptiler.Geocoder({
        input: "search",
        key: "f0zkb15NK1sqOcE72HCf",
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
        if (markers.length > 1) {
            map.fitBounds([
                asPoint(markers[markers.length - 2]),
                asPoint(markers[markers.length - 1]),
            ]);
        }
        else if (markers.length > 0) {
            map.setCenter(asPoint(markers[markers.length - 1]));
        }
        localStorage.setItem("markers", JSON.stringify(markers));
    });
}
function addMarker(item, map) {
    const { text, center } = item;
    const marker = new mapboxgl.Marker({
        draggable: true,
        text: text,
    });
    // set marker text
    marker.setLngLat(center);
    marker.addTo(map);
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
const data = [
    {
        lon: -82.3698745,
        lat: 34.8333188,
        text: "Greenville",
    },
    {
        lon: -97.387217,
        lat: 37.6853439,
        text: "Wichita",
    },
    {
        lon: -96.6421455,
        lat: 39.8463415,
        text: "Marysville",
    },
    {
        lon: -96.6887845,
        lat: 40.797108,
        text: "Lincoln",
    },
    {
        lon: -96.0249651,
        lat: 41.2918233,
        text: "Omaha",
    },
    {
        lon: -90.6912553,
        lat: 42.4845214,
        text: "Dubuque",
    },
    {
        lon: -89.3380894,
        lat: 43.062164,
        text: "Monona",
    },
    {
        lon: -89.0289834,
        lat: 43.3362069,
        text: "Columbus",
    },
    {
        lon: -88.5568306,
        lat: 44.0180513,
        text: "Oshkosh",
    },
    {
        lon: -89.5722535,
        lat: 44.5302235,
        text: "Stevens Point",
    },
    {
        lon: -87.3950903,
        lat: 46.5537609,
        text: "Marquette",
    },
    {
        lon: -88.5753433,
        lat: 47.1195822,
        text: "Houghton",
    },
    {
        lon: -88.5753433,
        lat: 47.1195822,
        text: "Houghton",
    },
    {
        lon: -92.1212623,
        lat: 46.764657,
        text: "Duluth",
    },
    {
        lon: -93.027374,
        lat: 48.437695,
        text: "Kabetogama",
    },
    {
        lon: -93.4197129,
        lat: 48.5855184,
        text: "International Falls",
    },
    {
        lon: -94.8913155,
        lat: 47.478677,
        text: "Bemidji",
    },
    {
        lon: -96.7483905,
        lat: 46.8656166,
        text: "Moorhead",
    },
    {
        lon: -100.7640799,
        lat: 46.809081,
        text: "Bismarck",
    },
    {
        lon: -104.5162697,
        lat: 48.1492025,
        text: "Culbertson",
    },
    {
        lon: -109.0304433,
        lat: 48.5844436,
        text: "Zurich",
    },
    {
        lon: -111.9088208,
        lat: 48.4294615,
        text: "Shelby",
    },
    {
        lon: -114.1870951,
        lat: 48.371273,
        text: "Columbia Falls",
    },
    {
        lon: -116.2956682,
        lat: 48.6910085,
        text: "Bonners Ferry",
    },
    {
        lon: -117.9026321,
        lat: 48.5498264,
        text: "Colville",
    },
    {
        lon: -120.1766296,
        lat: 48.472546,
        text: "Winthrop",
    },
    {
        lon: -121.5976335,
        lat: 48.485671,
        text: "Rockport",
    },
    {
        lon: -123.4802737,
        lat: 48.1702474,
        text: "Port Angeles",
    },
    {
        lon: -124.3854552,
        lat: 47.9526679,
        text: "Forks",
    },
    {
        lon: -122.1597797,
        lat: 47.5978697,
        text: "Bellevue",
    },
    {
        lon: -122.2930653,
        lat: 47.4425995,
        text: "SeaTac",
    },
    {
        lon: -122.2677947,
        lat: 46.8698435,
        text: "Eatonville",
    },
    {
        lon: -122.0221184,
        lat: 46.752282,
        text: "Ashford",
    },
    {
        lon: -122.9517978,
        lat: 46.0950105,
        text: "Rainier",
    },
    {
        lon: -122.7365002,
        lat: 46.3248338,
        text: "Toutle",
    },
    {
        lon: -122.9725418,
        lat: 45.300596,
        text: "Newberg",
    },
    {
        lon: -121.7828015,
        lat: 43.2165181,
        text: "Chemult",
    },
    {
        lon: -122.4889245,
        lat: 42.7509608,
        text: "Prospect",
    },
    {
        lon: -123.6422122,
        lat: 42.167597,
        text: "Cave Junction",
    },
    {
        lon: -123.9695195,
        lat: 41.8453907,
        text: "Gasquet",
    },
    {
        lon: -124.0384069,
        lat: 41.5265091,
        text: "Klamath",
    },
    {
        lon: -122.9447474,
        lat: 40.6520896,
        text: "Douglas City",
    },
    {
        lon: -123.2106044,
        lat: 39.142123,
        text: "Ukiah",
    },
    {
        lon: -122.492678,
        lat: 37.8589362,
        text: "Sausalito",
    },
    {
        lon: -123.0466412,
        lat: 37.7291734,
        text: "San Francisco",
    },
    {
        lon: -122.3439628,
        lat: 37.689127,
        text: "Brisbane",
    },
    {
        lon: -121.7440095,
        lat: 38.5550857,
        text: "Davis",
    },
    {
        lon: -121.8006399,
        lat: 36.6900785,
        text: "Marina",
    },
    {
        lon: -121.8871325,
        lat: 36.6114267,
        text: "Monterey",
    },
    {
        lon: -121.1206161,
        lat: 35.5935899,
        text: "San Simeon State Park",
    },
    {
        lon: -120.8499013,
        lat: 35.3658074,
        text: "Morro Bay",
    },
    {
        lon: -120.6912456,
        lat: 35.6267653,
        text: "Paso Robles",
    },
    {
        lon: -119.430183,
        lat: 35.418306,
        text: "Buttonwillow",
    },
    {
        lon: -119.1244986,
        lat: 35.3501809,
        text: "Bakersfield",
    },
    {
        lon: -118.4561967,
        lat: 35.7068961,
        text: "Wofford Heights",
    },
    {
        lon: -118.9045446,
        lat: 36.4388364,
        text: "Three Rivers",
    },
    {
        lon: -118.913718,
        lat: 36.7849455,
        text: "Hume",
    },
    {
        lon: -119.5605225,
        lat: 36.6993365,
        text: "Sanger",
    },
    {
        lon: -119.7118119,
        lat: 36.9877273,
        text: "Friant",
    },
    {
        lon: -119.6404311,
        lat: 37.4785497,
        text: "Fish Camp",
    },
    {
        lon: -119.6549161,
        lat: 37.5368699,
        text: "Wawona",
    },
    {
        lon: -119.7500832,
        lat: 37.69915,
        text: "Yosemite National Park Road",
    },
];
//# sourceMappingURL=index.js.map