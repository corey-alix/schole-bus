"use strict";

function saveCoordinate(coordinate) {
  const coordinates = getCoordinates();
  coordinates.push(coordinate);
  localStorage.setItem(
    "coordinates",
    JSON.stringify(coordinates)
  );
}

function getCoordinates() {
  const coordinates = JSON.parse(
    localStorage.getItem(
      "coordinates"
    ) || "[]"
  );
  return coordinates;
}

function parseGoogleUrl(url) {
  const result = [];
  const tokens = url.split("!");
  let tokenIndex = 0;
  while (tokenIndex < tokens.length) {
    const t1 = tokens[tokenIndex++];
    if (0 === t1.indexOf("1d")) {
      const t2 = tokens[tokenIndex];
      const lon = parseFloat(
        t1.substring(2)
      );
      const lat = parseFloat(
        t2.substring(2)
      );
      result.push({ lon, lat });
    }
  }

  if (!result.length) {
    // @44.848,-107.306,16z
    const regex =
      /\@(\d+\.\d+,-\d+\.\d+)/g;

    const data = regex.exec(url)[1];
    if (data) {
      const [lat, lon] = data
        .split(",")
        .map((v) => parseFloat(v));
      result.push({ lon, lat });
    }
  }
  console.log(result);
  return result;
}

async function getLocation() {
  return new Promise((good, bad) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords
            .longitude,
        };
        good(pos);
      }
    );
  });
}
export async function run() {
  const pos = await getLocation();
  const mapDiv =
    document.querySelector(".map");
  console.log(pos);
  const map = L.map(mapDiv).setView(
    [pos.lat, pos.lng],
    7
  );
  L.mapboxGL({
    style:
      "https://api.maptiler.com/maps/outdoor/style.json?key=f0zkb15NK1sqOcE72HCf",
  }).addTo(map);

  const input =
    document.querySelector("#url");
  input.addEventListener(
    "change",
    () => {
      const value = input.value;
      const coordinates =
        parseGoogleUrl(value);
      drawCoordinates(coordinates);
      coordinates.forEach((c) =>
        saveCoordinate(c)
      );
    }
  );

  drawCoordinates(getCoordinates());

  function drawCoordinates(
    coordinates
  ) {
    if (1 === coordinates.length) {
      coordinates.forEach(
        (coordinate) => {
          const marker = L.marker([
            coordinate.lat,
            coordinate.lon,
          ]);
          marker.addTo(map);
        }
      );
    }
    L.polyline(
      coordinates.map((c) => [
        c.lat,
        c.lon,
      ])
    ).addTo(map);
  }
}
