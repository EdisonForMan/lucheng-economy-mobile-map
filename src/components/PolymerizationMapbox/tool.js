/* eslint-disable */
import { fetchArcgisServer } from "@/api/beans/space";
let layerTimeStamp = undefined; //图层时间戳
let UnClusterPolygonTimeStamp = undefined; //未聚合时间戳
/**
 * 清除图层要素
 * @param {*} _context_ vue
 */
const clearLayers = _context_ => {
  if (!_context_.map) return;
  _context_.map.getLayer(`clusters${layerTimeStamp}`) &&
    _context_.map.removeLayer(`clusters${layerTimeStamp}`);
  _context_.map.getLayer(`cluster-count${layerTimeStamp}`) &&
    _context_.map.removeLayer(`cluster-count${layerTimeStamp}`);
  _context_.map.getLayer(`unclustered-point${layerTimeStamp}`) &&
    _context_.map.removeLayer(`unclustered-point${layerTimeStamp}`);
  _context_.popup && _context_.popup.remove();
  clearUnClusterPolygon(_context_);
  eventRemove(_context_, `clusters${layerTimeStamp}`);
};

/**
 * 清除面聚合
 * @param {*} _context_
 */
const clearUnClusterPolygon = _context_ => {
  if (!_context_.map) return;
  _context_.map.getLayer(`unclustered-polygon${UnClusterPolygonTimeStamp}`) &&
    _context_.map.removeLayer(
      `unclustered-polygon${UnClusterPolygonTimeStamp}`
    );
  eventRemove(_context_, `unclustered-polygon${UnClusterPolygonTimeStamp}`);
};

/**
 * 数据获取,绑定source
 * @param {*} _context_
 */
export const fetchData = async _context_ => {
  const { mode } = _context_.$params;
  if (!Object.keys(_context_.spaceValHash).length)
    return window.alert("未找到该类型空间图层,请关注后续更新");
  const { arcgis, layer, where } = _context_.spaceValHash;
  const result = await fetchArcgisServer({
    where: where || "1=1",
    outFields: _context_.spaceValHash.pop.attr
      .map(item => {
        return item.key;
      })
      .concat(_context_.spaceValHash.pop.title)
      .join(","),
    url: `${arcgis}/${layer}`
  });
  const { features } = result.data;
  const source = {
    type: "geojson",
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50,
    data: {
      type: "FeatureCollection",
      features: features.map(item => {
        const { attributes, geometry } = item;
        let center = [];
        if (mode === "point") {
          center = [geometry.x, geometry.y];
        } else {
          let sumX = 0,
            sumY = 0,
            length = geometry.rings[0].length;
          geometry.rings[0].map(([x, y]) => {
            sumX += x;
            sumY += y;
          });
          center = [sumX / length, sumY / length];
        }
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: center
          },
          properties: { ...attributes, geometry, mode, center }
        };
      })
    }
  };
  initClusterLayer(_context_, source);
};

/**
 *
 * @param {*} _context_
 * @param {*} source
 */
const initClusterLayer = (_context_, source) => {
  clearLayers(_context_);
  const { mode } = _context_.$params;
  const { s_key } = _context_.spaceValHash;
  const { map } = _context_;
  layerTimeStamp = +new Date();
  _context_.map.addLayer({
    id: `clusters${layerTimeStamp}`,
    type: "circle",
    source,
    filter: ["has", "point_count"],
    paint: {
      "circle-color": [
        "step",
        ["get", "point_count"],
        "#51bbd6",
        10,
        "#F0E68C",
        50,
        "#F08080"
      ],
      "circle-radius": ["step", ["get", "point_count"], 20, 10, 30, 50, 40],
      "circle-stroke-width": 2,
      "circle-stroke-color": "#F5F5DC",
      "circle-stroke-opacity": 0.8
    }
  });

  map.addLayer({
    id: `cluster-count${layerTimeStamp}`,
    type: "symbol",
    source,
    filter: ["has", "point_count"],
    layout: {
      "text-field": `{point_count_abbreviated}`,
      "text-size": 18,
      "text-allow-overlap": true
    }
  });

  map.addLayer({
    id: `unclustered-point${layerTimeStamp}`,
    type: "symbol",
    source,
    filter: ["!", ["has", "point_count"]],
    layout: {
      "icon-image": mode == "point" ? "_P_MARKER_" : "",
      "icon-size": 0.3,
      "icon-allow-overlap": true,
      "text-field": `{${s_key}}`,
      "text-offset": [0, -1.5],
      "text-size": 14
    },
    paint: {
      "text-color": "#fff",
      "text-halo-width": 2,
      "text-halo-color": "rgba(0,0,0,0.6)"
    }
  });
  eventAdd(_context_);
  //  非聚合图层加载完成后画面
  //  mode === "polygon" && drawUnClusterPolygon(_context_);
};

/**
 * 地图事件绑定
 * @param {*} _context_
 * @param {*} layerId
 */
const eventAdd = _context_ => {
  const { map } = _context_;
  map.on("click", `clusters${layerTimeStamp}`, ({ point }) => {
    var features = map.queryRenderedFeatures(point, {
      layers: [`clusters${layerTimeStamp}`]
    });
    map.easeTo({
      center: features[0].geometry.coordinates,
      zoom: map.getZoom() + 1
    });
  });
  map.on("click", `unclustered-point${layerTimeStamp}`, ({ features }) => {
    const { geometry, properties } = features[0];
    _context_.$tools.mapboxPop(_context_, properties, geometry);
  });
  map.on("zoomend", e => {
    clearUnClusterPolygon(_context_);
    drawUnClusterPolygon(_context_);
  });
};

/**
 * 地图事件移除
 * @param {*} _context_
 * @param {*} layerId
 */
const eventRemove = (_context_, layerId) => {
  _context_.map.off("click", layerId);
};

/**
 * 画聚合面
 * @param {*} _context_
 */
const drawUnClusterPolygon = _context_ => {
  const { $params, map, $tools } = _context_;
  const { mode } = $params;
  if (mode == "point") return;
  UnClusterPolygonTimeStamp = +new Date();
  const unclusterLayer = map.getLayer(`unclustered-point${layerTimeStamp}`);
  const renderPoint = map
    .queryRenderedFeatures()
    .filter(({ source }) => source == unclusterLayer.source);
  const _data_ = {
    id: `unclustered-polygon${UnClusterPolygonTimeStamp}`,
    type: "fill",
    source: {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: renderPoint.map(({ properties }) => {
          const _geometry_ = JSON.parse($tools.clone(properties.geometry));
          const _properties_ = $tools.clone(properties);
          delete _properties_.geometry;
          return {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: _geometry_.rings
            },
            properties: _properties_
          };
        })
      }
    },
    layout: {},
    paint: {
      "fill-color": "rgba(227, 139, 79,0.8)",
      "fill-outline-color": "rgba(0,0,0,0.5)"
    }
  };
  map.addLayer(_data_, `unclustered-point${layerTimeStamp}`);
  map.on(
    "click",
    `unclustered-polygon${UnClusterPolygonTimeStamp}`,
    ({ features }) => {
      const { properties } = features[0];
      _context_.$tools.mapboxPop(_context_, properties, {
        coordinates: JSON.parse(properties.center)
      });
    }
  );
};
