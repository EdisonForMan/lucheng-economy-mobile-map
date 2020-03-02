/* eslint-disable */
/** 存放定位相关函数 */
import { loadModules } from "esri-loader";
import { WRT_config, OPTION } from "@/components/common/config";
const { server } = WRT_config;

/**
 * 初始化定位工具
 * @param {*} _context_
 */
export const registeHit = _context_ => {
  const params = _context_.$params;
  const { mode } = params;
  //  params传参落点
  if (mode === "point") {
    forcePoint(_context_, params);
  } else if (mode === "polygon") {
    forceArea(_context_, params);
  }
};

/**
 * 查询点数据并落点
 * @param {*} _context_
 * @param {*} param1
 */
export const forcePoint = (_context_, params) => {
  const { value } = params;
  if (!Object.keys(_context_.spaceValHash).length)
    return window.alert("未找到该类型空间图层,请关注后续更新");
  const { arcgis, s_key, layer } = _context_.spaceValHash;
  const url = `${arcgis}/${layer}`;
  loadModules(
    ["esri/tasks/QueryTask", "esri/tasks/support/Query", "esri/Graphic"],
    OPTION
  ).then(([QueryTask, Query, Graphic]) => {
    const queryTask = new QueryTask({ url });
    const query = new Query();
    query.returnGeometry = true;
    query.outFields = ["*"];
    query.where = `${s_key}='${value}'`;
    queryTask.execute(query).then(({ features }) => {
      const { x, y } = features[0].geometry;
      const geometry = { type: "point", x, y };
      const graphic = new Graphic({
        geometry,
        symbol: {
          type: "picture-marker", // autocasts as new PictureMarkerSymbol()
          url: `${server}/icon/commonIcon/mobile_location_self.png`,
          width: "24",
          height: "34",
          yoffset: 8
        }
      });
      _context_.$store.commit("updateLocated", {
        params,
        geometry: features[0].geometry,
        attributes: features[0].attributes
      });
      _context_.view.graphics.add(graphic);
      const textGraphic = new Graphic({
        geometry,
        symbol: {
          type: "text",
          color: "#fff",
          haloColor: "#000",
          haloSize: "2px",
          yoffset: 24,
          text: _context_.$params.value,
          font: {
            size: 13
          }
        }
      });
      _context_.view.graphics.add(textGraphic);
      setTimeout(() => {
        _context_.view.goTo({
          center: [x, y],
          zoom: 16
        });
      }, 2000);
    });
  });
};

/**
 * 查询面数据并落面
 * @param {*} _context_
 * @param {*} param1
 */
export const forceArea = (_context_, params) => {
  const { value, table } = params;
  if (!Object.keys(_context_.spaceValHash).length)
    return window.alert("未找到该类型空间图层,请关注后续更新");
  const { arcgis, s_key, layer } = _context_.spaceValHash;
  const url = `${arcgis}/${layer}`;
  loadModules(
    ["esri/tasks/QueryTask", "esri/tasks/support/Query", "esri/Graphic"],
    OPTION
  ).then(([QueryTask, Query, Graphic]) => {
    const queryTask = new QueryTask({ url });
    const query = new Query();
    query.returnGeometry = true;
    query.outFields = ["*"];
    query.where = `${s_key}=${s_key == `pid` ? `${value}` : `'${value}'`}`;
    queryTask.execute(query).then(({ features }) => {
      const geometry = features[0].geometry;
      const fillSymbol = {
        type: "simple-fill",
        color: [227, 139, 79, 0.8],
        outline: {
          color: [0, 0, 0, 0.5],
          width: 1
        }
      };
      const polygonGraphic = new Graphic({
        geometry,
        symbol: fillSymbol
      });
      _context_.view.graphics.add(polygonGraphic);
      let center = [0, 0];
      const len = features[0].geometry.rings[0].length;
      features[0].geometry.rings[0].map(item => {
        center[0] += item[0];
        center[1] += item[1];
      });
      center = [center[0] / len, center[1] / len];
      _context_.$store.commit("updateLocated", {
        params,
        geometry: features[0].geometry,
        attributes: features[0].attributes,
        center
      });
      const textGraphic = new Graphic({
        geometry: {
          type: "point",
          x: center[0],
          y: center[1]
        },
        symbol: {
          type: "text",
          color: "#fff",
          haloColor: "#000",
          haloSize: "2px",
          text: _context_.$params.value,
          font: {
            size: 13
          }
        }
      });
      _context_.view.graphics.add(textGraphic);
      setTimeout(() => {
        _context_.view.goTo({
          center,
          zoom: 16
        });
      }, 2000);
    });
  });
};
