# Preparing the Database
Scholé Bus is a POI map-centric application geared toward Road-Trippin' Home Educators.  Here are the steps I took to setup the database for an Oregon Trail trip.

Find the Oregon Trail routes

    http://larow2.carollarow.com/Voyages/Lynchburg_Schools/Lynchburg2/Oregon_Trail.kmz

Import into Database

    ogr2ogr -f GeoJSON oregon.json oregon-trail.kml
    ogr2ogr -f PostgreSQL PG:"host=localhost user=postgres password=******** dbname=schole" oregon-trail.kml -nln oregontrailahead 
    Add it as a WMS layer

Create gid sequences

    CREATE SEQUENCE public.schole_points_fid_seq
        INCREMENT 1
        START 1
        MINVALUE 1
        MAXVALUE 9223372036854775807
        CACHE 1;

Create feature type for points

    CREATE TABLE schole_points
    (
        fid integer NOT NULL DEFAULT nextval('schole_points_fid_seq'::regclass),
        name character varying COLLATE pg_catalog."default",
        description character varying COLLATE pg_catalog."default",
        geom geometry,
        CONSTRAINT schole_points_pkey PRIMARY KEY (fid)
    )
    WITH (
        OIDS = FALSE
    )
    TABLESPACE pg_default;

Assign new ownership for Sequence

    ALTER SEQUENCE public.schole_points_fid_seq OWNED BY schole_points.fid;

Create feature type for lines

    CREATE TABLE schole_lines
    (
        fid integer NOT NULL DEFAULT nextval('schole_lines_fid_seq'::regclass),
        name character varying COLLATE pg_catalog."default",
        description character varying COLLATE pg_catalog."default",
        geom geometry,
        CONSTRAINT schole_lines_pkey PRIMARY KEY (fid)
    )
    WITH (
        OIDS = FALSE
    )
    TABLESPACE pg_default;

Import seed data from a gist

    ogr2ogr -f PostgreSQL PG:"host=localhost user=postgres password=******** dbname=schole" "https://gist.githubusercontent.com/ca0v/4fdc2a7c55a34743cb39c141e635324f/raw/94d57bc19b61f2530612a6385d66e418a427e5b0/geojson.geojson"

[Where does ogrgeojson get created?]

Put the points data into points table

    INSERT INTO schole_points (name, description, geom) 
    SELECT strname, comment, wkb_geometry 
    FROM ogrgeojson 
    WHERE st_geometrytype(wkb_geometry) = 'ST_Point'

Put the line data into the lines table

    INSERT INTO schole_lines (name, description, geom) 
    SELECT strname, comment, wkb_geometry
    FROM ogrgeojson 
    WHERE ST_GeometryType(wkb_geometry) = 'ST_MultiLineString'

Introduce 'domain' to allow multiple roadtrips to reside in same tables

    ALTER TABLE schole_points
    ADD COLUMN domain character varying

    ALTER TABLE schole_lines
    ADD COLUMN domain character varying

Introduce Polygons

    CREATE TABLE schole_polygons
    (
        fid integer NOT NULL DEFAULT nextval('schole_polygons_fid_seq'::regclass),
        name character varying COLLATE pg_catalog."default",
        description character varying COLLATE pg_catalog."default",
        geom geometry,
        CONSTRAINT schole_polygons_pkey PRIMARY KEY (fid)
    )
    WITH (
        OIDS = FALSE
    )
    TABLESPACE pg_default;

Examples that fix things I did wrong:

    ALTER TABLE schole_polygons ADD COLUMN domain character varying;
    ALTER TABLE public.schole_polygons ALTER COLUMN fid SET DEFAULT nextval('schole_polygons_fid_seq'::regclass);

Put the polygons into the polygon table

    INSERT INTO schole_polygons (name, description, geom) 
    SELECT strname, comment, wkb_geometry
    FROM ogrgeojson 
    WHERE ST_GeometryType(wkb_geometry) = 'ST_MultiPolygon'

Assign a domain value to points, lines and polygons

    update schole_points set domain = 'roadtrip_2017'
    update schole_lines set domain = 'roadtrip_2017'
    update schole_polygons set domain = 'roadtrip_2017'

Introduce UUID with auto-assign:

    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    ALTER TABLE public.schole_points ADD COLUMN uufid uuid DEFAULT uuid_generate_v4();
    ALTER TABLE public.schole_lines ADD COLUMN uufid uuid DEFAULT uuid_generate_v4();
    ALTER TABLE public.schole_polygons ADD COLUMN uufid uuid DEFAULT uuid_generate_v4();

Export POI to a json document (not sure where to specify the table name)

    ogr2ogr -f GeoJSON "backup.geojson" PG:"host=localhost user=postgres password=******** dbname=vegas" ogrgeojson

Convert KML to GeoJSON

    ogr2ogr -f GeoJSON oregon.json oregon-trail-kml.xml

Import POI into oregion-trail-poi

    ogr2ogr -f PostgreSQL PG:"host=localhost user=postgres password=******** dbname=schole" -nln oregon-trail-poi oregon-trail-geojson.json

    ogr2ogr -f PostgreSQL PG:"host=localhost user=postgres password=******** dbname=schole" -dim 2 -lco OVERWRITE=YES -lco FID=fid -lco GEOMETRY_NAME=geom -nln oregon-trail-poi oregon-trail-geojson.json

(alternative but does not work)

    ogr2ogr -f PostgreSQL -doo HOST=localhost -doo DBNAME=schole -doo USER=postgres -doo PASSWORD=******** -doo ACTIVE_SCHEMA=poi -nln oregon-trail-poi oregon-trail-geojson.json

Import OSM data (WARNING: geoserver doesn't understand hstore)

    ogr2ogr -f PostgreSQL PG:"dbname=osm host=localhost user=postgres password=********" "south-carolina-latest.osm.pbf" lines -lco GEOMETRY_NAME=geom -lco OVERWRITE=YES -lco SCHEMA=america -lco FID=fid -lco COLUMN_TYPES=other_tags=hstore

Routing
todo