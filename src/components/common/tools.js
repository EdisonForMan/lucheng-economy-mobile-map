/* eslint-disable */

import {
  OPTION,
  MAPBOXLAYER,
  MAPBOXLAYER_WHITE,
} from "@/components/common/config";
import { styleHash } from "@/components/common/tableHash";
// import { loadModules } from "esri-loader";
// /**
//  *
//  * @param {*} map 地图指针
//  * @param {*} arr
//  * @param {*} val
//  */
// const switchStyle = (map, arr, val) => {
//   loadModules(
//     ["esri/layers/VectorTileLayer", "esri/layers/TileLayer"],
//     OPTION
//   ).then(([VectorTileLayer, TileLayer]) => {
//     const _layer = val == "影像图" ? TileLayer : VectorTileLayer;
//     arr.map(item => {
//       if (item == val) {
//         const layer = map.findLayerById(item);
//         layer
//           ? (layer.visible = true)
//           : map.add(
//               new _layer({
//                 url: styleHash[val],
//                 id: item
//               }),
//               1
//             );
//       } else {
//         const layer = map.findLayerById(item);
//         layer ? (layer.visible = false) : undefined;
//       }
//     });
//   });
// };

/**
 * 面板提示
 * @param {*} _context_
 * @param {*} properties
 * @param {*} param2
 */
const mapboxPop = (_context_, properties, { coordinates }) => {
  const { pop, s_key } = _context_.spaceValHash;
  const mapboxgl = _context_.$mapboxgl;
  _context_.popup = new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setHTML(
      `<div class="_pop">
        <div class="_pop_title"><span>${properties[s_key]}</span></div>
        <div class="baidu_around"><ul>${pop.attr
          .map(item => {
            return `<li>
      <div><label>${item.title}</label>：<span>${
              !parseInt(properties[item.key])
                ? properties[item.key]
                : parseInt(properties[item.key]).toFixed(2)
            }</span></div>
      </li>`;
          })
          .join("")}</ul><a class="Amap_jump" data-val="${
        properties[s_key]
      }" href="javascript:">高德导航</a></div>
      </div>`
    )
    .setMaxWidth("300px")
    .addTo(_context_.map);
};

const switchMapboxStyle = (map, val) => {
  var styleJson = map.getStyle();
  map.setStyle({
    ...styleJson,
    sources: {
      ...styleJson.sources,
      "raster-tiles": {
        tileSize: 256,
        type: "raster",
        tiles: [
          `${
            val == "简约风" ? MAPBOXLAYER : MAPBOXLAYER_WHITE
          }/WMTS/tile/1.0.0/MyM/default/default028mm/{z}/{y}/{x}.png`,
        ],
      },
    },
  });
};

/**
 * 深拷贝
 * @param {*} obj
 */
function clone(data) {
  return deepClone(data);
}

function deepClone(data) {
  if (!data || !(data instanceof Object) || typeof data == "function") {
    return data || undefined;
  }
  var constructor = data.constructor;
  var result = new constructor();
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      result[key] = deepClone(data[key]);
    }
  }
  return result;
}

export default {
  // switchStyle,
  mapboxPop,
  switchMapboxStyle,
  clone,
};
