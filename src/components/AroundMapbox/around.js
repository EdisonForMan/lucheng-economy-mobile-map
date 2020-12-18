/* eslint-disable */
import { fetchArcgisGeometry } from "@/api/beans/space";
import { BUILDAROUND } from "@/components/common/config";
let layerTimeStamp = undefined; //图层时间戳
let iconTimeStamp = undefined; //图标时间戳
/**
 * 清除图层要素
 * @param {*} _context_ vue
 */
export const clearLayers = _context_ => {
  _context_.map.getLayer(`CIRCLE${layerTimeStamp}`) &&
    _context_.map.removeLayer(`CIRCLE${layerTimeStamp}`);
  _context_.map.getLayer(`AROUND_${layerTimeStamp}`) &&
    _context_.map.removeLayer(`AROUND_${layerTimeStamp}`);
  _context_.popup && _context_.popup.remove();
  clearIcons(_context_);
};

export const clearIcons = _context_ => {
  _context_.map.getLayer(`AROUND_ICON_${iconTimeStamp}`) &&
    _context_.map.removeLayer(`AROUND_ICON_${iconTimeStamp}`);
};
/**
 * 生成圆形面
 * @param {*} param0
 * @param {*} km
 * @param {*} points
 */
const createGeoJSONCircle = ([longitude, latitude], km = 1, points = 64) => {
  const ret = [];
  const distanceX = km / (111.32 * Math.cos((latitude * Math.PI) / 180));
  const distanceY = km / 110.574;
  let theta, x, y;
  for (let i = 0; i < points; i++) {
    theta = (i / points) * (2 * Math.PI);
    x = distanceX * Math.cos(theta);
    y = distanceY * Math.sin(theta);
    ret.push([longitude + x, latitude + y]);
  }
  ret.push(ret[0]);
  return {
    type: "geojson",
    data: {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [ret],
      },
    },
  };
};

/**
 * 周边查找 画周边圈
 * @param {*} _context_ vue
 * @param {*} val 周边类型
 */
export const switchAround = _context_ => {
  _context_.updateLoading(true);
  eventRemove(_context_, `AROUND_${layerTimeStamp}`);
  clearLayers(_context_);
  layerTimeStamp = +new Date();
  const { center } = _context_.$store.state.located;
  const source = createGeoJSONCircle(center);
  _context_.map.addLayer({
    id: `CIRCLE${layerTimeStamp}`,
    type: "fill",
    source,
    layout: {},
    paint: {
      "fill-color": "rgba(0,0,0,0.1)",
      "fill-outline-color": "rgba(255, 255, 255, 0.8)",
    },
  });
  fetchAreaPoint(_context_, source.data.geometry.coordinates);
};

/**
 * 获取周边兴趣点
 * @param {*} param0
 * @param {*} rings
 */
const fetchAreaPoint = async (_context_, rings) => {
  const { aroundType, updateLoading } = _context_;
  const result = await fetchArcgisGeometry(`${BUILDAROUND}/${aroundType}`, {
    geometryType: "esriGeometryPolygon",
    inSR: 4326,
    outSR: 4326,
    where: "1=1",
    geometry: JSON.stringify({
      spatialReference: { wkid: 4326 },
      rings,
    }),
  });
  const { features } = result.data;
  if (!features.length) return updateLoading(false);
  const data = {
    type: "FeatureCollection",
    features: features.map(item => {
      const { attributes, geometry } = item;
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [geometry.x, geometry.y],
        },
        properties: attributes,
      };
    }),
  };

  _context_.map.addLayer({
    id: `AROUND_${layerTimeStamp}`,
    type: "symbol",
    source: {
      type: "geojson",
      data,
    },
    layout: {
      "icon-image": `_AROUND_${aroundType}_`,
      "icon-size": 0.5,
      "icon-allow-overlap": true,
    },
  });
  eventAdd(_context_, `AROUND_${layerTimeStamp}`);
  updateLoading(false);
};

/**
 * 点击地图
 * @param {*} _context_
 * @param {*} mapPoint
 */
export const clickHandler = (_context_, mapPoint) => {};

/**
 * 地图事件绑定
 * @param {*} _context_
 * @param {*} layerId
 */
const eventAdd = (_context_, layerId) => {
  _context_.map.on("click", layerId, function(e) {
    iconTimeStamp && clearIcons(_context_);
    iconTimeStamp = +new Date();
    const { geometry, properties } = e.features[0];
    _context_.map.addLayer({
      id: `AROUND_ICON_${iconTimeStamp}`,
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
                coordinates: geometry.coordinates,
              },
            },
          ],
        },
      },
      layout: {
        "icon-image": "_FORCE_LOCATION_",
        "icon-size": 0.3,
        "icon-allow-overlap": true,
        "icon-offset": [0, -40],
      },
    });
    //  no async/await
    baiduApiFetch(_context_, geometry.coordinates, properties);
    _context_.map.flyTo({ center: geometry.coordinates });
  });
};

/**
 * 调用百度api获取地名地址
 * @param {*} _context_
 * @param {*} param1
 */
const baiduApiFetch = (_context_, [x, y], obj) => {
  const { wgs84togcj02, gcj02tobd09 } = _context_.$util;
  const { bd_lng, bd_lat } = gcj02tobd09(wgs84togcj02(x, y));
  _context_.$bGeo.getLocation(new BMap.Point(bd_lng, bd_lat), result => {
    const { address, surroundingPois } = result;
    const mapboxgl = _context_.$mapboxgl;
    _context_.popup = new mapboxgl.Popup({
      className: "my-class",
    })
      .setLngLat([x, y])
      .setHTML(
        `<div class="_pop">
      <div class="_pop_title"><label>地址：</label><span>${obj["SHORTNAME"] ||
        address}</span></div>
      <div class="_pop_title"><label>类型：</label><span>${
        obj["TYPE"]
      }</span></div>
      <a class="Amap_jump" data-val="${obj["SHORTNAME"] ||
        address}" href="javascript:">高德导航</a>
      ${
        surroundingPois.length
          ? `<div class="baidu_around"><p>周边信息</p><ul>${surroundingPois
              .map(item => {
                return `<li>
        <strong>${item.title}</strong>
        <div><label>类型：</label><span>${item.Si}</span></div>
        <div><label>地址：</label><span>${item.address}</span></div>
        </li>`;
              })
              .join("")}</ul></div>`
          : ``
      }
    </div>`
      )
      .setMaxWidth("300px")
      .addTo(_context_.map);
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
