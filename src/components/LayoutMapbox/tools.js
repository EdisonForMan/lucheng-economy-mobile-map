/* eslint-disable */
import { CYBJ } from "@/components/common/config";
import { fetchArcgisServer } from "@/api/beans/space";
/**
 * 添加一带
 * @param {*} _context_
 * @param {*} tag
 */
const addLine = (_context_, tag) => {
  _context_.map.addLayer({
    id: "lines",
    type: "line",
    source: "lines",
    paint: {
      "line-color": "rgb(230,152,0)",
      "line-width": 26,
      "line-dasharray": [0.1, 0.1]
    }
  });
};
/**
 * 添加八区
 * @param {*} _context_
 */
const addAreas = _context_ => {
  _context_.map.addLayer({
    id: "areas",
    type: "symbol",
    source: "areas",
    layout: {
      "icon-image": "areas-dot",
      "icon-allow-overlap": true,
      "text-field": "{name1009}",
      "text-allow-overlap": true,
      "text-offset": [0, -2],
      "text-size": 18
    },
    paint: {
      "text-color": "#fff",
      "text-halo-width": 2,
      "text-halo-color": "rgba(0,0,0,0.5)"
    }
  });
};
/**
 * 添加一园
 * @param {*} _context_
 */
const addZones = _context_ => {
  _context_.map.addLayer({
    id: "zones",
    type: "symbol",
    source: "zones",
    layout: {
      "icon-image": "zones-dot",
      "icon-allow-overlap": true,
      "text-field": "{name1009}",
      "text-allow-overlap": true,
      "text-offset": [0, -1],
      "text-size": 16
    },
    paint: {
      "text-color": "#fff",
      "text-halo-width": 1,
      "text-halo-color": "rgba(0,0,0,0.5)"
    }
  });
};
/**
 * 添加一园面
 * @param {*} _context_
 */
const addZonePolygon = _context_ => {
  _context_.map.addLayer(
    {
      id: "zonePolygon",
      type: "fill",
      source: "zonePolygon",
      layout: {},
      paint: {
        "fill-color": "rgba(227, 139, 79,0.3)",
        "fill-outline-color": "rgba(0,0,0,0.8)"
      }
    },
    "zones"
  );
};
/**
 * 添加产业板块
 * @param {*} _context_
 */
const addPlate = _context_ => {
  _context_.map.addLayer({
    id: "plate",
    type: "fill",
    source: "plate",
    paint: {
      "fill-color": { type: "identity", property: "color" },
      "fill-opacity": 0.6
    }
  });
};
/**
 * 添加热力图
 * @param {*} _context
 * @param {*} type
 * @param {*} tag 若为false则关闭热力图
 */
let timestamp = -1;
export const mapboxChangeHeat = (_context, type, tag) => {
  return new Promise(async (resolve, reject) => {
    _context.map.getLayer("heat" + timestamp) &&
      _context.map.removeLayer("heat" + timestamp);
    _context.map.getLayer("heat-point" + timestamp) &&
      _context.map.removeLayer("heat-point" + timestamp);
    if (!tag) {
      resolve(true);
      return;
    }
    const result = await fetchArcgisServer({
      where: type
        ? `行业分类 in (${type.map(item => {
            return `'${item}'`;
          })})`
        : "1=1",
      url: CYBJ + "/4"
    });
    const { features } = result.data;
    const data = {
      type: "FeatureCollection",
      crs: {
        type: "name",
        properties: { name: `heat_${+new Date()}` }
      },
      features: features.map(item => {
        const { attributes, geometry } = item;
        return {
          geometry: {
            type: "Point",
            coordinates: [geometry.x, geometry.y, 0.1]
          },
          properties: attributes,
          type: "Feature"
        };
      })
    };
    timestamp = +new Date();
    _context.map.addLayer(
      {
        id: "heat" + timestamp,
        type: "heatmap",
        source: { type: "geojson", data },
        maxzoom: 15,
        paint: {
          "heatmap-weight": [
            "interpolate",
            ["linear"],
            ["get", "mag"],
            0,
            0,
            6,
            1
          ],
          "heatmap-intensity": 2,
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(33,102,172,0)",
            0.2,
            "rgb(103,169,207)",
            0.4,
            "rgb(209,229,240)",
            0.6,
            "rgb(253,219,199)",
            0.8,
            "rgb(239,138,98)",
            1,
            "rgb(178,24,43)"
          ],
          "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 6, 10, 8],
          "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 10, 1, 15, 0]
        }
      },
      "areas"
    );
    _context.map.addLayer(
      {
        id: "heat-point" + timestamp,
        type: "circle",
        source: { type: "geojson", data },
        minzoom: 13,
        paint: {
          // Size circle radius by earthquake magnitude and zoom level
          "circle-radius": 4,
          // Color circle by earthquake magnitude
          "circle-color": "#00BFFF",
          "circle-stroke-color": "white",
          "circle-stroke-width": 1,
          "circle-opacity": ["interpolate", ["linear"], ["zoom"], 13, 0, 15, 1]
        }
      },
      "areas"
    );
    resolve(true);
  });
};
/**
 * 添加一带八区
 * @param {*} _context_
 */
export const mapboxChangeAreas = (_context_, tag) => {
  if (!tag) {
    _context_.map.getLayer("lines") && _context_.map.removeLayer("lines");
    _context_.map.getLayer("areas") && _context_.map.removeLayer("areas");
    _context_.map.getLayer("zones") && _context_.map.removeLayer("zones");
    _context_.map.getLayer("zonePolygon") &&
      _context_.map.removeLayer("zonePolygon");
  } else {
    addLine(_context_);
    addAreas(_context_);
    addZones(_context_);
    addZonePolygon(_context_);
  }
};

const eventAdd = _context_ => {
  _context_.map.on("click", "areas", ({ features }) => {
    const { geometry, properties } = features[0];
    console.log(properties);
    // _context_.$tools.mapboxPop(_context_, properties, {
    //   coordinates: JSON.parse(properties.center)
    // });
  });
};
/**
 * 初始化地图工具
 * @param {*} _context_
 */
export const initTool = _context_ => {
  return new Promise((resolve, reject) => {
    addPlate(_context_);
    mapboxChangeAreas(_context_, true);
    eventAdd(_context_);
    resolve(true);
  });
};
