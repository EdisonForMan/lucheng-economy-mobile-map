/* eslint-disable */
import { fetchArcgisServer } from "@/api/beans/space";
/**
 * 初始化定位工具
 * @param {*} _context_
 */
export const registeHit = async _context_ => {
  const params = _context_.$params;
  const { mode, value } = params;
  if (!Object.keys(_context_.spaceValHash).length)
    return window.alert("未找到该类型空间图层,请关注后续更新");
  const { arcgis, s_key, layer } = _context_.spaceValHash;
  const result = await fetchArcgisServer({
    where: `${s_key}='${value}'`,
    url: `${arcgis}/${layer}`
  });
  const { features } = result.data;
  if (!features.length) return window.alert("未找到相关数据");
  //  params传参落点
  if (mode === "point") {
    await forcePoint(_context_, features[0], s_key);
  } else if (mode === "polygon") {
    await forceArea(_context_, features[0], s_key);
  }
  eventAdd(_context_);
};

/**
 * 查询点数据并落点
 * @param {*} _context_
 * @param {*} param1
 */
export const forcePoint = async (_context_, feature, s_key) => {
  const params = _context_.$params;
  const { attributes, geometry } = feature;
  const center = [geometry.x, geometry.y];
  const properties = {
    ...attributes,
    _TITLE_: attributes[s_key],
    center
  };
  _context_.$store.commit("updateLocated", {
    params,
    attributes,
    geometry,
    center
  });
  _context_.map.addLayer({
    id: "self",
    type: "symbol",
    source: {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [geometry.x, geometry.y]
            },
            properties
          }
        ]
      }
    },
    layout: {
      "icon-image": "_MOBILE_LOCATION_SELF_",
      "icon-size": 0.5,
      "icon-allow-overlap": true,
      "text-field": "{_TITLE_}",
      "text-offset": [0, -2],
      "text-size": 16,
      "text-allow-overlap": true
    },
    paint: {
      "text-color": "#fff",
      "text-halo-width": 2,
      "text-halo-color": "rgba(0,0,0,0.6)"
    }
  });
  _context_.map.flyTo({
    center: [geometry.x, geometry.y],
    essential: true,
    zoom: 14
  });
};

/**
 * 查询面数据并落面
 * @param {*} _context_
 * @param {*} param1
 */
export const forceArea = async (_context_, feature, s_key) => {
  const params = _context_.$params;
  const { attributes, geometry } = feature;

  let sumX = 0,
    sumY = 0,
    length = geometry.rings[0].length,
    center = [];
  geometry.rings[0].map(([x, y]) => {
    sumX += x;
    sumY += y;
  });
  center = [sumX / length, sumY / length];
  const properties = {
    ...attributes,
    _TITLE_: attributes[s_key],
    center
  };
  _context_.$store.commit("updateLocated", {
    params,
    attributes,
    geometry,
    center
  });
  _context_.map.addLayer({
    id: "self",
    type: "fill",
    source: {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: geometry.rings
            },
            properties
          }
        ]
      }
    },
    layout: {},
    paint: {
      "fill-color": "rgba(227, 139, 79,0.8)",
      "fill-outline-color": "rgba(0,0,0,0.5)"
    }
  });
  _context_.map.addLayer({
    id: "self_tip",
    type: "symbol",
    source: {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: center
        },
        properties
      }
    },
    layout: {
      "icon-allow-overlap": true,
      "text-field": "{_TITLE_}",
      "text-offset": [0, -1],
      "text-size": 16,
      "text-allow-overlap": true
    },
    paint: {
      "text-color": "#fff",
      "text-halo-width": 2,
      "text-halo-color": "rgba(0,0,0,0.6)"
    }
  });
  _context_.map.flyTo({
    center,
    essential: true,
    zoom: 14
  });
};

/**
 * 地图事件绑定
 * @param {*} _context_
 * @param {*} layerId
 */
const eventAdd = _context_ => {
  const { map } = _context_;
  map.on("click", "self", ({ features }) => {
    const { geometry, properties } = features[0];
    _context_.$tools.mapboxPop(_context_, properties, {
      coordinates: JSON.parse(properties.center)
    });
  });
};
