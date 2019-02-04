# schole-bus
Scholé Bus is a POI map-centric application geared toward Road-Trippin' Home Educators


```mermaid
sequenceDiagram
  title:preparing the loader
  Loader ->> CDN:get
  CDN -->> Loader:index.html
  Loader ->> CDN:get
  CDN -->> Loader:RequireJS
  Loader ->> require:config()
  require ->> CDN:get deps
  CDN -->> require:built/index.js
  require -->> Loader:callback()
  Loader ->> require:require(index)
  Loader ->> Runner:run()
```

```mermaid
sequenceDiagram
  title:preparing the map
  run ->> cssin:schole-bus
  run ->> ol:createView
  ol -->> run:view
  run ->> ol:createMap(view)
  ol -->> run:map
  run ->> layers:create
  layers -->> run:drawLayers
  run ->> run:addControls(map, drawLayers)
```

```mermaid
sequenceDiagram
  title:loading the controls
  run ->> map:addControl(MousePosition)
  run ->> app/layerswitcher:create(map)
  run ->> app/toolbar:create(map, drawLayers)
  run ->> app/search:create(map, drawLayers)
  run ->> app/popup:create(map)
```

```mermaid
sequenceDiagram
  title:setting up the environment
  User ->> CMD:Install IIS
  User ->> CMD:Install Node
  User ->> CMD:Install Git
  User ->> CMD:Git Clone ScholeBus
  User ->> CMD:Npm Install
  User ->> IIS:Add ScholeBus Application
  User ->> CMD:Install Postgres
  User ->> CMD:Install PostGIS
  User ->> CMD:Install GeoServer
  User ->> GeoServer:Register Postgres
  User ->> CMD:Create and Populate Tables
  CMD ->> Postgres:CREATE and INSERT
```
