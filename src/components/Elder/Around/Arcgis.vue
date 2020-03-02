<template>
  <div id="arcgis"></div>
</template>

<script>
/* eslint-disable */
import { loadModules } from "esri-loader";
import { TDTJY, QHMB, OPTION } from "@/components/common/config";
import { mapState, mapMutations } from "vuex";
import { registeHit } from "./hit";
import { switchAround, mapClick, clearLayers } from "./around";
export default {
  name: "around_arcgis",
  data() {
    return {
      map: null,
      view: null,
      graphicsLayer: null,
      textLayer: null,
      aroundType: 0
    };
  },
  computed: {
    ...mapState({
      radius: state => state.radius,
      located: state => state.located,
      spaceValHash: state => state.spaceValHash
    })
  },
  mounted() {
    this.updateLoading(true);
    this.createMap(() => {
      this.$params && registeHit(this);
    });
  },
  methods: {
    ...mapMutations(["updateLoading"]),
    /**
     * 图层清除
     */
    clearLayer() {
      clearLayers(this);
    },
    /**
     * 风格切换
     */
    switchStyle(arr, val) {
      this.$tools.switchStyle(this.map, arr, val);
    },
    /**
     * 周边切换
     */
    _switchAround(val) {
      this.aroundType = val;
      switchAround(this);
    },
    /**
     * @param {Function} callback
     */
    createMap(fn) {
      const _context_ = this;
      loadModules(
        [
          "esri/Map",
          "esri/views/MapView",
          "esri/layers/VectorTileLayer",
          "esri/layers/MapImageLayer",
          "esri/layers/GraphicsLayer"
        ],
        OPTION
      ).then(
        ([Map, MapView, VectorTileLayer, MapImageLayer, GraphicsLayer]) => {
          const veclayer = new VectorTileLayer({
            url: TDTJY,
            id: "简约风"
          });
          const qh = new MapImageLayer({
            url: QHMB,
            id: "lcjjdt",
            sublayers: [{ id: 3 }, { id: 1 }, { id: 0 }]
          });
          _context_.map = new Map({
            layers: [veclayer, qh]
          });
          _context_.view = new MapView({
            container: "arcgis",
            map: _context_.map,
            center: [120.61419448808013, 28.039695289562555],
            zoom: 11
          });
          //  绘画图层Graphics
          _context_.graphicsLayer = new GraphicsLayer({
            id: "graphicsLayer"
          });
          _context_.map.add(_context_.graphicsLayer);
          //  文字图层Graphics
          _context_.textLayer = new GraphicsLayer({
            id: "textLayer",
            visible: false
          });
          _context_.map.add(_context_.textLayer);
          _context_.view.on("mouse-wheel", evt => {
            const zoom = _context_.view.zoom + (evt.deltaY > 0 ? -1 : 1);
            const shallPlate = zoom > 15 ? true : false;
            _context_.map.findLayerById("textLayer").visible = shallPlate;
          });
          _context_.view.on("click", ({ mapPoint }) => {
            mapClick(_context_, mapPoint);
          });
          //  地图加载完成后去除mask
          _context_.view.whenLayerView(veclayer).then(veclayerView => {
            _context_.updateLoading(false);
          });
          fn && fn();
        }
      );
    }
  }
};
</script>

<style scoped lang="less">
#arcgis {
  height: 100%;
}
</style>