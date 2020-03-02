<template>
  <div id="arcgis"></div>
</template>

<script>
/* eslint-disable */
import { loadModules } from "esri-loader";
import { styleHash } from "@/components/common/tableHash";
import { TDTJY, QHMB, CYBJ, OPTION } from "@/components/common/config";
import { mapState, mapMutations } from "vuex";
const heatHash = {
  农林牧渔业: 40,
  装备制造: 40,
  "鞋材、鞋业": 30,
  房地产业: 300,
  其他: 20,
  "交通运输、仓储和邮政业": 40,
  金融业: 25,
  企业服务业: 20,
  住宿和餐饮业: 200
};
export default {
  name: "layout_arcgis",
  data() {
    return {
      map: null,
      view: null,
      graphicsLayer: null,
      textLayer: null,
      legend: null
    };
  },
  props: ["block", "six"],
  watch: {
    block(val) {
      this.layer(val, "block");
    },
    six(val) {
      this.layer(val, "six");
    }
  },
  computed: {
    ...mapState({
      located: state => state.located
    })
  },
  mounted() {
    this.updateLoading(true);
    this.createMap(() => {
      this.block && this._block();
      this.six && this._six();
    });
  },
  methods: {
    ...mapMutations(["updateLoading"]),
    /**
     * 风格切换
     */
    switchStyle(arr, val) {
      this.$tools.switchStyle(this.map, arr, val);
    },
    heat(val = []) {
      const _context_ = this;
      const arr = [];
      val.map(item => {
        !item.includes("@") && arr.push(item);
      });
      _context_.map.findLayerById("heat") &&
        _context_.map.remove(_context_.map.findLayerById("heat"));
      loadModules(
        ["esri/layers/FeatureLayer", "esri/renderers/HeatmapRenderer"],
        OPTION
      ).then(([FeatureLayer, HeatmapRenderer]) => {
        const definitionExpression = `行业分类 in (${arr
          .map(item => {
            return `'${item}'`;
          })
          .join(`,`)})`;
        var heatmapRenderer = new HeatmapRenderer({
          blurRadius: 6,
          colorStops: [
            { ratio: 0, color: "rgba(0, 255, 0, 0)" },
            { ratio: 0.02, color: "rgb(34, 151, 143)" },
            { ratio: 0.03, color: "rgb(0, 255, 0)" },
            { ratio: 0.04, color: "rgb(50, 255, 0)" },
            { ratio: 0.05, color: "rgb(250, 255, 0)" },
            { ratio: 0.06, color: "rgb(255, 205, 0)" },
            { ratio: 0.07, color: "rgb(255, 150, 0)" },
            { ratio: 0.08, color: "rgb(255, 95, 0)" },
            { ratio: 0.09, color: "rgb(255, 40, 0)" },
            { ratio: 0.1, color: "rgb(255, 0, 0)" }
          ],
          maxPixelIntensity: arr.length == 11 ? 600 : heatHash[arr[0]] || 600,
          minPixelIntensity: 1
        });
        const heat = new FeatureLayer({
          url: CYBJ + "/4",
          id: "heat",
          definitionExpression,
          renderer: heatmapRenderer,
          opacity: 0.7
        });
        _context_.map.add(heat, 3);
      });
    },
    layer(check, val) {
      const _context_ = this;
      const _layer = _context_.map.findLayerById(val);
      const _fun = val == "block" ? this._block : this._six;
      check
        ? _layer
          ? (_layer.visible = true)
          : _fun()
        : _layer
        ? (_layer.visible = false)
        : undefined;
    },
    _block() {
      const _context_ = this;
      loadModules(["esri/layers/MapImageLayer"], OPTION).then(
        ([MapImageLayer]) => {
          const block = new MapImageLayer({
            url: CYBJ,
            id: "block",
            sublayers: [{ id: 3 }]
          });
          _context_.map.add(block, 1);
          _context_.legend.layerInfos.push({
            layer: block
          });
        }
      );
    },
    _six() {
      const _context_ = this;
      loadModules(["esri/layers/MapImageLayer"], OPTION).then(
        ([MapImageLayer]) => {
          const six = new MapImageLayer({
            url: CYBJ,
            id: "six",
            sublayers: [{ id: 1 }, { id: 0 }]
          });
          _context_.map.add(six, 2);
          _context_.legend.layerInfos.push({
            layer: six
          });
        }
      );
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
          "esri/widgets/Legend",
          "esri/layers/VectorTileLayer",
          "esri/layers/MapImageLayer",
          "esri/layers/GraphicsLayer"
        ],
        OPTION
      ).then(
        ([
          Map,
          MapView,
          Legend,
          VectorTileLayer,
          MapImageLayer,
          GraphicsLayer
        ]) => {
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
            zoom: 13
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
          _context_.legend = new Legend({
            view: _context_.view
          });
          _context_.view.on("mouse-wheel", evt => {
            const zoom = _context_.view.zoom + (evt.deltaY > 0 ? -1 : 1);
            const shallPlate = zoom > 15 ? true : false;
            _context_.map.findLayerById("textLayer").visible = shallPlate;
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