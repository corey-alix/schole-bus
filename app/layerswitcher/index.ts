import { cssin, html, mixin, getParameterByName } from "ol3-fun/ol3-fun/common";
import { LayerSwitcher } from "ol3-layerswitcher";

let css = `
.ol-control.layer-switcher {
  position: absolute;
  bottom: 0.5em;
  right: 0.5em;
  max-height: calc(100% - 3.5em);
  overflow-y: auto;
  text-align: left; }
  .ol-control.layer-switcher.shown .panel {
    display: block; }
  .ol-control.layer-switcher.shown button {
    position: absolute;
    right: 18px;
    top: 14px;
    width: 0;
    height: 0;
    color: black; }
    .ol-control.layer-switcher.shown button::after {
      content: "✖"; }
  .ol-control.layer-switcher .panel {
    padding: 0 1em 0 0;
    margin: 0;
    background-color: white;
    display: none;
    overflow-y: auto; }
    .ol-control.layer-switcher .panel ul.hide-layer-group {
      display: none; }
  .ol-control.layer-switcher button::after {
    content: "☑"; }
  .ol-control.layer-switcher ul {
    padding-left: 1em;
    list-style: none; }
  .ol-control.layer-switcher li.group {
    padding-top: 5px; }
    .ol-control.layer-switcher li.group > label {
      font-weight: bold; }
  .ol-control.layer-switcher li.layer {
    display: table; }
    .ol-control.layer-switcher li.layer::after {
      padding-left: 3px;
      padding-right: 5px;
      content: ""; }
    .ol-control.layer-switcher li.layer.loading::after {
      content: url("./progress-16.gif"); }
    .ol-control.layer-switcher li.layer label {
      display: table-cell;
      vertical-align: sub; }
    .ol-control.layer-switcher li.layer input {
      display: table-cell;
      vertical-align: sub; }
  .ol-control.layer-switcher input {
    margin: 4px; }
`;


export function create(options: {
    map: ol.Map
}) {
    cssin("layerswitcher", css);
    let switcher = new LayerSwitcher();
    options.map.addControl(switcher);

}