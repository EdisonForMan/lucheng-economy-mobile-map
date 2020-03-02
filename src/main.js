/* eslint-disable */
import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store/index";
import {
  Button,
  Spin,
  Dropdown,
  Menu,
  Icon,
  Checkbox,
  Tag,
  Tree,
  Tooltip
} from "ant-design-vue";
import util from "./components/common/util";
import tools from "./components/common/tools";
import { MAPBOXTOKEN } from "@/components/common/config";
// import "@/assets/css/arcgis.css"
import "ant-design-vue/dist/antd.css";
import "@/assets/font/iconfont.css";
Vue.use(Button);
Vue.use(Spin);
Vue.use(Dropdown);
Vue.use(Menu);
Vue.use(Icon);
Vue.use(Checkbox);
Vue.use(Tag);
Vue.use(Tree);
Vue.use(Tooltip);
Vue.config.productionTip = false;
window.mapboxgl.accessToken = MAPBOXTOKEN;
Vue.prototype.$mapboxgl = window.mapboxgl;
Vue.prototype.$bGeo = new window.BMap.Geocoder();
Vue.prototype.$util = util;
Vue.prototype.$tools = tools;
/**
 * 入口函数,父页面调用传参后初始化地图并定位
 * @param {Object} ↓
 *  @param {String} key   value对应key
 *  @param {String} value 数值
 *  @param {String} mode  point/polygon/polymerization
 *  @param {String} table hash表
 */
const getParamsInitMap = params => {
  Vue.prototype.$params = params;
  //  初始化地图
  window._vue_ = new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount("#app");
};
window.getParamsInitMap = getParamsInitMap;
/**
 * 1.同源下直接调用函数 getParamsInitMap();
 * 2.非同源下frame.contentWindow.postMessage (data, {}) 调用
 */
window.addEventListener("message", ({ data }) => {
  console.log("[data]", data);
  //event.data获取传过来的数
  data && data instanceof Object && data.mode && window.getParamsInitMap(data);
});

// window.postMessage(
//   {
//     value: "七都科技文化中心",
//     mode: "polygon",
//     table: "u_zsdkm"
//   },
//   "*"
// );
