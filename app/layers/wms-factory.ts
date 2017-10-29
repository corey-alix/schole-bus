import ol = require("openlayers");
import { defaults } from "ol3-fun";

declare module Wms {

    export interface ContactPersonPrimary {
        ContactPerson: string;
        ContactOrganization: string;
    }

    export interface ContactAddress {
        AddressType: string;
        Address: string;
        City: string;
        StateOrProvince: string;
        PostCode: string;
        Country: string;
    }

    export interface ContactInformation {
        ContactPersonPrimary: ContactPersonPrimary;
        ContactPosition: string;
        ContactAddress: ContactAddress;
        ContactVoiceTelephone: string;
        ContactElectronicMailAddress: string;
    }

    export interface Service {
        Name: string;
        Title: string;
        Abstract: string;
        KeywordList: string[];
        OnlineResource: string;
        ContactInformation: ContactInformation;
        Fees: string;
        AccessConstraints: string;
        LayerLimit: number;
        MaxWidth: number;
        MaxHeight: number;
    }

    export interface Get {
        OnlineResource: string;
    }

    export interface Post {
        OnlineResource: string;
    }

    export interface HTTP {
        Get: Get;
        Post: Post;
    }

    export interface DCPType {
        HTTP: HTTP;
    }

    export interface GetCapabilities {
        Format: string[];
        DCPType: DCPType[];
    }

    export interface Get2 {
        OnlineResource: string;
    }

    export interface HTTP2 {
        Get: Get2;
    }

    export interface DCPType2 {
        HTTP: HTTP2;
    }

    export interface GetMap {
        Format: string[];
        DCPType: DCPType2[];
    }

    export interface Get3 {
        OnlineResource: string;
    }

    export interface HTTP3 {
        Get: Get3;
    }

    export interface DCPType3 {
        HTTP: HTTP3;
    }

    export interface GetFeatureInfo {
        Format: string[];
        DCPType: DCPType3[];
    }

    export interface Request {
        GetCapabilities: GetCapabilities;
        GetMap: GetMap;
        GetFeatureInfo: GetFeatureInfo;
    }

    export interface AuthorityURL {
        OnlineResource: string;
        name: string;
    }

    export interface BoundingBox {
        crs: string;
        extent: number[];
        res: number[];
    }

    export interface BoundingBox2 {
        crs: string;
        extent: number[];
        res: number[];
    }

    export interface LogoURL {
        Format: string;
        OnlineResource: string;
        size: number[];
    }

    export interface Attribution {
        Title: string;
        OnlineResource: string;
        LogoURL: LogoURL;
    }

    export interface FeatureListURL {
        Format: string;
        OnlineResource: string;
    }

    export interface LegendURL {
        Format: string;
        OnlineResource: string;
        size: number[];
    }

    export interface StyleSheetURL {
        Format: string;
        OnlineResource: string;
    }

    export interface Style {
        Name: string;
        Title: string;
        Abstract: string;
        LegendURL: LegendURL[];
        StyleSheetURL: StyleSheetURL;
    }

    export interface MetadataURL {
        Format: string;
        OnlineResource: string;
        type: string;
    }

    export interface LegendURL2 {
        Format: string;
        OnlineResource: string;
        size: number[];
    }

    export interface StyleSheetURL2 {
        Format: string;
        OnlineResource: string;
    }

    export interface Style2 {
        Name: string;
        Title: string;
        Abstract: string;
        LegendURL: LegendURL2[];
        StyleSheetURL: StyleSheetURL2;
    }

    export interface BoundingBox3 {
        crs: string;
        extent: number[];
        res: number[];
    }

    export interface LogoURL2 {
        Format: string;
        OnlineResource: string;
        size: number[];
    }

    export interface Attribution2 {
        Title: string;
        OnlineResource: string;
        LogoURL: LogoURL2;
    }

    export interface Dimension {
        name: string;
        units: string;
        unitSymbol?: any;
        default: string;
        values: string;
        nearestValue?: boolean;
    }

    export interface Layer3 {
        Name: string;
        Title: string;
        Abstract: string;
        KeywordList: string[];
        Identifier: string[];
        MetadataURL: MetadataURL[];
        Style: Style2[];
        queryable: boolean;
        opaque: boolean;
        noSubsets: boolean;
        CRS: string[];
        EX_GeographicBoundingBox: number[];
        BoundingBox: BoundingBox3[];
        Attribution: Attribution2;
        MinScaleDenominator: number;
        MaxScaleDenominator: number;
        Dimension: Dimension[];
    }

    export interface AuthorityURL2 {
        OnlineResource: string;
        name: string;
    }

    export interface Dimension2 {
        name: string;
        units: string;
        unitSymbol?: any;
        default: string;
        values: string;
    }

    export interface Layer2 {
        Name: string;
        Title: string;
        CRS: string[];
        EX_GeographicBoundingBox: number[];
        BoundingBox: BoundingBox2[];
        Attribution: Attribution;
        Identifier: string[];
        FeatureListURL: FeatureListURL[];
        Style: Style[];
        MinScaleDenominator: number;
        MaxScaleDenominator: number;
        Layer: Layer3[];
        queryable: boolean;
        opaque: boolean;
        noSubsets: boolean;
        AuthorityURL: AuthorityURL2[];
        Dimension: Dimension2[];
        fixedWidth?: number;
        fixedHeight?: number;
        cascaded?: number;
    }

    export interface Layer {
        Title: string;
        CRS: string[];
        AuthorityURL: AuthorityURL[];
        BoundingBox: BoundingBox[];
        Layer: Layer2[];
    }

    export interface Capability {
        Request: Request;
        Exception: string[];
        Layer: Layer;
    }

    export interface GetCapsResponse {
        version: string;
        Service: Service;
        Capability: Capability;
    }

}


export const DEFAULT_OPTIONS = {
    visible: false,
    basemap: false,
}

export function create(options: {
    map: ol.Map;
    url: string;
    layer: string;
    title?: string;
    visible?: boolean;
    basemap?: boolean;
}) {

    options = defaults(options, DEFAULT_OPTIONS);
    let map = options.map;

    return new Promise<{ layer: ol.layer.Tile }>((resolve, reject) => {

        fetch(`${options.url}?service=WMS&version=1.1.0&request=GetCapabilities&tile=true`).then(response => {
            if (!response.ok) {
                reject(response);
                return;
            }
            response.text().then(text => {
                let caps = new ol.format.WMSCapabilities();
                let result = <Wms.GetCapsResponse>caps.read(text);
                let layer = result.Capability.Layer.Layer.find(v => v.Name === options.layer);
                if (!layer) {
                    reject("layer not found");
                }
                {
                    let bbox = layer.BoundingBox[0];
                    let extent = <ol.Extent>bbox.extent;
                    let mapSrs = map.getView().getProjection().getCode();
                    extent = ol.geom.Polygon.fromExtent(extent).transform(bbox.crs || "EPSG:4326", mapSrs).getExtent();

                    // TODO: does not seem to be using owc tile cache until switch to image/jpeg (not transparent!)
                    // not sure how to get tileset (http://ca0v-pc:8080/geoserver/gwc/service/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=getcapabilities&TILED=true)
                    let source = new ol.source.TileWMS({
                        projection: mapSrs,
                        url: result.Capability.Request.GetMap.DCPType[0].HTTP.Get.OnlineResource,
                        params: {
                            'FORMAT': "image/png",
                            'LAYERS': layer.Name,
                            'TILED': true
                        },
                        serverType: 'geoserver'
                    });

                    let wmsLayer = new ol.layer.Tile({
                        title: options.title || options.layer,
                        type: options.basemap ? "base" : "overlay",
                        visible: options.visible,
                        extent: extent,
                        source: source
                    });
                    resolve({
                        layer: wmsLayer
                    });
                }
                result.Capability.Request.GetMap.DCPType

            });
        });

    });

}