/* eslint-disable */
/**
 * http api interface url config
 * get env by domain
 * update by eds 2019/8/20
 */
import Vue from "vue";
/**
 * 环境配置获取
 * [dev]      本地  自动登录admin
 * [prod]     生产  需token严重
 * [outside]  对外  自动登录游客
 */
window.env =
  location.host.includes("localhost") || location.host.includes("192.168.0.200")
    ? "outside"
    : "outside";
Vue.prototype.$env = window.env;
/**
 * 是否需要登录
 * 1.需要登录    直接通过js登录获取token 用于本地调试、对外用户 无需跳转重登
 * 2.不需要登录  通过外部登录的session获取token 若失效需跳转重登
 */
window.shallLogin =
  location.host.includes("localhost") ||
  location.host.includes("lysb.lucheng.gov.cn");
//  此console不删
console.log(`[env]${window.env}`, `[shallLogin]${window.shallLogin}`);

//  开发环境配置
const CONFIG_DEV = {
  ARCGIS_API_URL:
    "http://192.168.0.200:9003/s/lc/libs/arcgis_js_v412_api/arcgis_js_api/library/4.12/dojo/dojo.js",
  LOCAL_DOMAIN: "http://192.168.0.100",
  LOCAL_HOST: "http://192.168.0.100/server/rest/services",
  FORWARD_HOST: "http://192.168.0.123:6080/arcgis/rest/services",
  OTHER_HOST: "https://services.wzmap.gov.cn/server/rest/services",
  SERVER_HOST: "http://192.168.0.200:9003/s/lc",
  API_HOST: "http://192.168.0.200:9003",
  LOGIN_HOST: "http://192.168.0.200:9003"
};
//  外网环境配置
const CONFIG_OUTSIDE = {
  ARCGIS_API_URL:
    "https://lysb.lucheng.gov.cn/lc/libs/arcgis_js_v412_api/arcgis_js_api/library/4.12/dojo/dojo.js",
  LOCAL_DOMAIN: "https://jjdtgis.lucheng.gov.cn",
  LOCAL_HOST: "https://jjdtgis.lucheng.gov.cn/arcgis/rest/services",
  FORWARD_HOST: "https://jjdtgis.lucheng.gov.cn/arcgis/rest/services",
  OTHER_HOST: "https://services.wzmap.gov.cn/server/rest/services",
  SERVER_HOST: "https://lysb.lucheng.gov.cn/s/lc",
  API_HOST: "https://lysb.lucheng.gov.cn",
  LOGIN_HOST: " https://lysb.lucheng.gov.cn"
};
const TO_CONFIG = Vue.prototype.$env == "dev" ? CONFIG_DEV : CONFIG_OUTSIDE;
//  环境变量 配置信息获取
const {
  ARCGIS_API_URL,
  LOCAL_DOMAIN,
  LOCAL_HOST,
  FORWARD_HOST,
  OTHER_HOST,
  SERVER_HOST,
  API_HOST,
  LOGIN_HOST
} = TO_CONFIG;
//  api/apibean config
export const WRT_config = {
  server: SERVER_HOST,
  serverCompatible: API_HOST,
  etag: "+mOUb1hDtJA=",
  token: "",
  login: LOGIN_HOST
};
//  ARCGIS FOR JS库本地地址
export const OPTION = {
  url: ARCGIS_API_URL,
  dojoConfig: {
    parseOnLoad: true,
    packages: [
      {
        location: `${SERVER_HOST}/libs/plugin`,
        name: "plugin"
      },
      {
        name: "src",
        location: location.pathname.replace(/\/[^/]+$/, "") + "../src"
      }
    ]
  }
};

/******** 2019/10/16 new config ********/
//  招商资源    [0.招商项目点 1.鹿城全景 2.数字产业园 3.招商地块面]
export const ZSZY = `${FORWARD_HOST}/lcjjdt/zszy/MapServer`;
//  地块画像    [0.已征待拆 1.可供地块 2.控规-已征待拆 3.控规-可供地块]
export const DKHX = `${FORWARD_HOST}/lcjjdt/dkhx/MapServer`;
//  经济特色    [0.产业平台 1.重点项目 2.重点楼宇 3.专业市场 4.招商地块 5.百强企业]
export const JJTS = `${FORWARD_HOST}/lcjjdt/jjts/MapServer`;
//  产业布局    [0.八大平台 1.一廊 2.三轴 3.产业板块 4.行业点]
export const CYBJ = `${FORWARD_HOST}/lcjjdt/cybj/MapServer`;
//  区划蒙白    [0.区划线 1.外围蒙白 2.切块蒙白 3.街道标注]
export const QHMB = `${FORWARD_HOST}/lcjjdt/qhmb/MapServer`;
//  鹿城公房    [0.公房点 1.公房面]
export const LCGF = `${FORWARD_HOST}/lcjjdt/gongfang/MapServer`;
//  鹿城旅遊    [0.旅游]
export const LVYOU = `${FORWARD_HOST}/lcjjdt/lvyou/MapServer`;
/******** ********/

// mapbox底图
export const MAPBOXLAYER = `${FORWARD_HOST}/lcjjdt/LCDT1219/MapServer`;
export const MAPBOXLAYER_WHITE = `${FORWARD_HOST}/lcjjdt/LCDT1115/MapServer`;
//  mapbox token
export const MAPBOXTOKEN =
  "pk.eyJ1IjoiZWRzaW9uc2hhbyIsImEiOiJjazRjM2FlN3EwZnVmM2twYjI0M3c5b2Z2In0.qnKMOhKLGmHbmQzhWb81Lg";
//  天地图-大数据
export const TDTDSJ =
  window.env == "outside"
    ? `${OTHER_HOST}/Hosted/DSJ/VectorTileServer`
    : `${LOCAL_HOST}/Hosted/kfq_WGS84/VectorTileServer`;
//  天地图-行政区划
export const TDTXZQH = `${OTHER_HOST}/Hosted/XZQH/VectorTileServer`;
//  天地图-招商-影像图2017
export const TDTIMAGE2017 = `${OTHER_HOST}/TDT/YX2017/MapServer`;
//  天地图-招商-简约地图
export const TDTJY = `${OTHER_HOST}/Hosted/JYB/VectorTileServer`;
//  楼宇-兴趣点1000米兴趣点1000米
export const BUILDAROUND = `${FORWARD_HOST}/lcjjdt/poi56b1000/MapServer`;
//  用地-总用地规划
export const ALLLANDREGULATORY = `${FORWARD_HOST}/lcjjdt/guihua/MapServer`;
