<template>
  <div id="mapDeviceManagement"></div>
</template>

<script>
/* eslint-disable */
import { loadModules } from "esri-loader";
import { mapState, mapMutations } from "vuex";
import {
  WRT_config,
  TDTJY,
  QHMB,
  ALLLANDREGULATORY,
  OPTION
} from "@/components/common/config";
const { server } = WRT_config;
const _symbol = {
  type: "simple-fill",
  color: [227, 139, 79, 0.8],
  outline: {
    color: [0, 0, 0, 0.5],
    width: 1
  }
};
const _symbol_point = {
  type: "picture-marker", // autocasts as new PictureMarkerSymbol()
  url: `${server}/icon/commonIcon/location_self.png`,
  width: "20",
  height: "20",
  yoffset: 7
};
export default {
  name: "map-device-management",
  data() {
    return {
      vueArcGisApi: {
        SimpleMarkerSymbol: null,
        SimpleLineSymbol: null,
        ClassBreaksRenderer: null,
        PopupTemplate: null,
        SpatialReference: null,
        fcl: null
      },
      newArcGisModules: {
        map: null,
        mapView: null
      },
      kgLayer: undefined,
      nodesData: []
    };
  },
  computed: {
    ...mapState({
      spaceValHash: state => state.spaceValHash
    })
  },
  mounted() {
    this.updateLoading(true);
    this.loadedArcGisModules(() => {
      this.getGraphicsPointDataInit();
    });
  },
  methods: {
    ...mapMutations(["updateLoading"]),
    /**
     * 风格切换
     */
    switchStyle(arr, val) {
      this.$tools.switchStyle(this.newArcGisModules.map, arr, val);
    },
    /**
     * 控规图层控制
     */
    kgControll(shallKg) {
      const layer = this.kgLayer;
      const { map } = this.newArcGisModules;
      if (shallKg) {
        layer ? (map.findLayerById("kg").visible = true) : this.addKg();
      } else {
        layer ? (map.findLayerById("kg").visible = false) : undefined;
      }
    },
    /**
     * 添加控规图层
     */
    addKg() {
      loadModules(["esri/layers/MapImageLayer"], OPTION).then(
        ([MapImageLayer]) => {
          const { map } = this.newArcGisModules;
          this.kgLayer = new MapImageLayer({
            url: ALLLANDREGULATORY,
            id: "kg",
            sublayers: [{ id: 0 }],
            opacity: 0.6
          });
          map.add(this.kgLayer, 2);
        }
      );
    },
    async getGraphicsPointDataInit() {
      this.fetchData(nodesData => {
        this.nodesData = nodesData;
        this.$nextTick(() => {
          this.initLayer(this.nodesData);
        });
      });
    },
    fetchData(fn) {
      const { value } = this.$params;
      const _context_ = this;
      _context_.newArcGisModules.mapView.popup.visible = false;
      if (!Object.keys(_context_.spaceValHash).length)
        return window.alert("未找到该类型空间图层,请关注后续更新");
      const { arcgis, s_key, layer, where } = _context_.spaceValHash;
      const url = `${arcgis}/${layer}`;
      loadModules(
        ["esri/tasks/QueryTask", "esri/tasks/support/Query"],
        OPTION
      ).then(([QueryTask, Query]) => {
        const queryTask = new QueryTask({ url });
        const query = new Query();
        query.returnGeometry = true;
        query.outFields = ["*"];
        query.where = where || "1=1";
        queryTask.execute(query).then(({ features }) => {
          fn &&
            fn(
              features.map(item => {
                const { x, y } = item.geometry;
                const obj =
                  _context_.$params.mode == "point"
                    ? {
                        x: item.geometry.x,
                        y: item.geometry.y
                      }
                    : {
                        x: item.geometry.rings[0][0][0],
                        y: item.geometry.rings[0][0][1]
                      };
                return {
                  attributes: item.attributes,
                  mode: _context_.$params.mode,
                  geometry: item.geometry,
                  _symbol,
                  _symbol_point,
                  x: obj.x,
                  y: obj.y
                };
              })
            );
        });
      });
    },
    initLayer(data) {
      //  clearLayer
      this.newArcGisModules.map &&
        this.newArcGisModules.map.findLayerById("flare-cluster-layer") &&
        this.newArcGisModules.map.remove(
          this.newArcGisModules.map.findLayerById("flare-cluster-layer")
        );
      const defaultSym = new this.vueArcGisApi.SimpleMarkerSymbol({
        size: 6,
        color: "#FF0000",
        outline: null
      });

      const renderer = new this.vueArcGisApi.ClassBreaksRenderer({
        defaultSymbol: defaultSym
      });
      renderer.field = "clusterCount";

      const smSymbol = new this.vueArcGisApi.SimpleMarkerSymbol({
        size: 22,
        outline: new this.vueArcGisApi.SimpleLineSymbol({
          color: [221, 159, 34, 0.8]
        }),
        color: [255, 204, 102, 0.8]
      });
      const mdSymbol = new this.vueArcGisApi.SimpleMarkerSymbol({
        size: 28,
        outline: new this.vueArcGisApi.SimpleLineSymbol({
          color: [82, 163, 204, 0.8]
        }),
        color: [102, 204, 255, 0.8]
      });
      const lgSymbol = new this.vueArcGisApi.SimpleMarkerSymbol({
        size: 34,
        outline: new this.vueArcGisApi.SimpleLineSymbol({
          color: [41, 163, 41, 0.8]
        }),
        color: [51, 204, 51, 0.8]
      });
      const xlSymbol = new this.vueArcGisApi.SimpleMarkerSymbol({
        size: 40,
        outline: new this.vueArcGisApi.SimpleLineSymbol({
          color: [200, 52, 59, 0.8]
        }),
        color: [250, 65, 74, 0.8]
      });

      renderer.addClassBreakInfo(0, 19, smSymbol);
      renderer.addClassBreakInfo(20, 50, mdSymbol);
      renderer.addClassBreakInfo(51, 190, lgSymbol);
      renderer.addClassBreakInfo(191, Infinity, xlSymbol);

      let areaRenderer;

      // if area display mode is set. Create a renderer to display cluster areas. Use SimpleFillSymbols as the areas are polygons
      const defaultAreaSym = new this.vueArcGisApi.SimpleFillSymbol({
        style: "solid",
        color: [0, 0, 0, 0.2],
        outline: new this.vueArcGisApi.SimpleLineSymbol({
          color: [0, 0, 0, 0.3]
        })
      });

      areaRenderer = new this.vueArcGisApi.ClassBreaksRenderer({
        defaultSymbol: defaultAreaSym
      });
      areaRenderer.field = "clusterCount";

      const smAreaSymbol = new this.vueArcGisApi.SimpleFillSymbol({
        color: [255, 204, 102, 0.4],
        outline: new this.vueArcGisApi.SimpleLineSymbol({
          color: [221, 159, 34, 0.8],
          style: "dash"
        })
      });
      const mdAreaSymbol = new this.vueArcGisApi.SimpleFillSymbol({
        color: [102, 204, 255, 0.4],
        outline: new this.vueArcGisApi.SimpleLineSymbol({
          color: [82, 163, 204, 0.8],
          style: "dash"
        })
      });
      const lgAreaSymbol = new this.vueArcGisApi.SimpleFillSymbol({
        color: [51, 204, 51, 0.4],
        outline: new this.vueArcGisApi.SimpleLineSymbol({
          color: [41, 163, 41, 0.8],
          style: "dash"
        })
      });
      const xlAreaSymbol = new this.vueArcGisApi.SimpleFillSymbol({
        color: [250, 65, 74, 0.4],
        outline: new this.vueArcGisApi.SimpleLineSymbol({
          color: [200, 52, 59, 0.8],
          style: "dash"
        })
      });

      areaRenderer.addClassBreakInfo(0, 19, smAreaSymbol);
      areaRenderer.addClassBreakInfo(20, 150, mdAreaSymbol);
      areaRenderer.addClassBreakInfo(151, 1000, lgAreaSymbol);
      areaRenderer.addClassBreakInfo(1001, Infinity, xlAreaSymbol);

      // Set up another class breaks renderer to style the flares individually
      const flareRenderer = new this.vueArcGisApi.ClassBreaksRenderer({
        defaultSymbol: renderer.defaultSymbol
      });
      flareRenderer.field = "clusterCount";

      const smFlareSymbol = new this.vueArcGisApi.SimpleMarkerSymbol({
        size: 14,
        color: [255, 204, 102, 0.8],
        outline: new this.vueArcGisApi.SimpleLineSymbol({
          color: [221, 159, 34, 0.8]
        })
      });
      const mdFlareSymbol = new this.vueArcGisApi.SimpleMarkerSymbol({
        size: 14,
        color: [102, 204, 255, 0.8],
        outline: new this.vueArcGisApi.SimpleLineSymbol({
          color: [82, 163, 204, 0.8]
        })
      });
      const lgFlareSymbol = new this.vueArcGisApi.SimpleMarkerSymbol({
        size: 14,
        color: [51, 204, 51, 0.8],
        outline: new this.vueArcGisApi.SimpleLineSymbol({
          color: [41, 163, 41, 0.8]
        })
      });
      const xlFlareSymbol = new this.vueArcGisApi.SimpleMarkerSymbol({
        size: 14,
        color: [250, 65, 74, 0.8],
        outline: new this.vueArcGisApi.SimpleLineSymbol({
          color: [200, 52, 59, 0.8]
        })
      });

      flareRenderer.addClassBreakInfo(0, 19, smFlareSymbol);
      flareRenderer.addClassBreakInfo(20, 150, mdFlareSymbol);
      flareRenderer.addClassBreakInfo(151, 1000, lgFlareSymbol);
      flareRenderer.addClassBreakInfo(1001, Infinity, xlFlareSymbol);

      const { pop } = this.spaceValHash;
      const popupTemplate = new this.vueArcGisApi.PopupTemplate({
        title: `{${pop.title}}`,
        content: [
          {
            type: "fields",
            fieldInfos: pop.attr.map(item => {
              return { fieldName: item.key, label: item.title, visible: true };
            })
          }
        ]
      });

      const options = {
        id: "flare-cluster-layer",
        clusterRenderer: renderer,
        areaRenderer: areaRenderer,
        flareRenderer: flareRenderer,
        singlePopupTemplate: popupTemplate,
        displaySubTypeFlares: false,
        clusterToScale: 5000,
        maxSingleFlareCount: 10,
        clusterRatio: 80,
        clusterAreaDisplay: "activated",
        server,
        mapView: this.newArcGisModules.mapView,
        data
      };
      let clusterLayer = new this.vueArcGisApi.fcl.FlareClusterLayer(options);
      this.newArcGisModules.map.add(clusterLayer, 3);
    },
    loadedArcGisModules(fn) {
      const _context_ = this;
      loadModules(
        [
          "esri/Map",
          "esri/views/MapView",
          "esri/layers/MapImageLayer",
          "esri/layers/VectorTileLayer",
          "esri/PopupTemplate",
          "esri/symbols/SimpleMarkerSymbol",
          "esri/symbols/SimpleLineSymbol",
          "esri/symbols/SimpleFillSymbol",
          "esri/renderers/ClassBreaksRenderer",
          "esri/geometry/SpatialReference",
          "plugin/FlareClusterLayer_v4"
        ],
        OPTION
      )
        .then(
          ([
            Map,
            MapView,
            MapImageLayer,
            VectorTileLayer,
            PopupTemplate,
            SimpleMarkerSymbol,
            SimpleLineSymbol,
            SimpleFillSymbol,
            ClassBreaksRenderer,
            SpatialReference,
            fcl
          ]) => {
            this.vueArcGisApi = {
              PopupTemplate,
              SimpleMarkerSymbol,
              SimpleLineSymbol,
              SimpleFillSymbol,
              ClassBreaksRenderer,
              SpatialReference,
              fcl
            };
            const veclayer = new VectorTileLayer({
              url: TDTJY,
              id: "简约风"
            });
            const qh = new MapImageLayer({
              url: QHMB,
              id: "lcjjdt",
              sublayers: [{ id: 3 }, { id: 1 }, { id: 0 }]
            });
            const map = new Map({
              layers: [veclayer, qh]
            });
            const mapView = new MapView({
              map: map,
              container: "mapDeviceManagement",
              center: [120.61419448808013, 28.039695289562555],
              zoom: 11,
              constraints: {
                minZoom: 2
              }
              // rotation: 90
            });
            mapView.ui._removeComponents(["attribution"]); //去掉logo
            mapView.ui.move(["zoom"], "bottom-right"); // 缩放控件移动到右下方
            this.newArcGisModules = {
              map,
              mapView
            };
            this.newArcGisModules.mapView.when(() => {
              this.updateLoading(false);
              fn && fn();
            });
            this.newArcGisModules.mapView.on("click", evt => {
              this.newArcGisModules.mapView.hitTest(evt).then(({ results }) => {
                if (
                  results.length &&
                  results.filter(({ graphic }) => {
                    return graphic.attributes.OBJECTID;
                  }).length
                ) {
                  setTimeout(() => {
                    document
                      .getElementsByClassName(
                        "esri-popup__header-container--button"
                      )[0]
                      .click();
                  }, 200);
                }
              });
            });
          }
        )
        .catch(err => {
          // handle any errors
          console.error(err);
        });
    }
  }
};
</script>

<style scoped lang="less">
#mapDeviceManagement {
  height: 100%;
}
</style>