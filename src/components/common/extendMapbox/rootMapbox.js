/**
 * created by eds 2019.12.18
 * common mapbox root component
 */

/* eslint-disable */
import { rootSources } from "./rootSource";
import { mapMutations } from "vuex";
import { rootTool } from "./rootTools";
import { MAPBOXLAYER, MAPBOXLAYER_WHITE } from "@/components/common/config";
import ZW_JSON from "./street_zw";
const _CENTER_ = [120.66052090621764, 28.010845855663625];
const _ZOOM_ = 11;
const _MINZOOM_ = 6;
const _MAXZOOM_ = 18;
const _MAPBOX_OPTION_ = {
  center: _CENTER_,
  zoom: _ZOOM_,
  minZoom: _MINZOOM_,
  maxZoom: _MAXZOOM_,
  renderWorldCopies: false,
  repaint: true,
  trackResize: true,
  attributionControl: false,
  transformRequest: (url, resourceType) => {
    if (resourceType === "Tile") {
      url += `&domain=www.zjditu.cn`;
      if (url.includes("{key}")) {
        return {
          url: url.replace("{key}", "85b88ce10c15f390ee75bf571688b3b7")
        };
      }
      if (url.includes("{tdtcode}")) {
        return {
          url: url.replace("{tdtcode}", "zhejiang")
        };
      }
    }
  }
};
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
          style: ZW_JSON
        });
        this.map.on("style.load", () => {
          // this.map.setStyle(ZW_JSON, { diff: false });
          this.updateLoading(false);
          fn && fn();
          return resolve(true);
        });
      });
    }
  }
};
