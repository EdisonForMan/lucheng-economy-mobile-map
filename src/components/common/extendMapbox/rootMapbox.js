/**
 * created by eds 2019.12.18
 * common mapbox root component
 */

/* eslint-disable */
import { rootSources } from "./rootSource";
import { mapMutations } from "vuex";
import { rootTool } from "./rootTools";
import { MAPBOXLAYER } from "@/components/common/config";
const _CENTER_ = [120.66052090621764, 28.010845855663625];
const _ZOOM_ = 11;
const _MINZOOM_ = 9;
const _MAXZOOM_ = 15;
const _MAPBOX_OPTION_ = {
  center: _CENTER_,
  zoom: _ZOOM_,
  minZoom: _MINZOOM_,
  maxZoom: _MAXZOOM_
};
const _MAP_ = `${MAPBOXLAYER}/WMTS/tile/1.0.0/MyM/default/default028mm/{z}/{y}/{x}.png`;

export default {
  name: "rootMapbox",
  data: () => {
    return {
      map: undefined,
      popup: undefined
    };
  },
  methods: {
    ...mapMutations(["updateLoading"]),
    async initRoot(fn) {
      await this.initMap(fn);
      await rootSources(this);
      await rootTool(this);
    },
    async initMap(fn) {
      return new Promise((resolve, reject) => {
        const mapboxgl = this.$mapboxgl;
        this.map = new mapboxgl.Map({
          container: "mapbox",
          ..._MAPBOX_OPTION_,
          style: {
            version: 8,
            name: "map",
            glyphs: "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
            sources: {
              "raster-tiles": {
                type: "raster",
                tiles: [_MAP_],
                tileSize: 256
              }
            },
            layers: [
              {
                id: "map",
                type: "raster",
                source: "raster-tiles"
              }
            ]
          }
        });
        this.map.on("style.load", () => {
          this.updateLoading(false);
          fn && fn()
          return resolve(true);
        });
      });
    }
  }
};
