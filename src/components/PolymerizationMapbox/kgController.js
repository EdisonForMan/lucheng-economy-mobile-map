/* eslint-disable */
import { ALLLANDREGULATORY } from "@/components/common/config";
import { colorHash } from "./kgHash";

/**
 * 控规开关
 * @param {*} _context_ 
 * @param {*} shallKg 
 */
export const kgControll = async (_context_, shallKg) => {
  if (shallKg) {
    if (!_context_.map.getLayer("kg")) {
      const data = _context_.kg.length
        ? _context_.kg
        : await _fetchKg(_context_);
      addKg(_context_, data);
    } else {
      _context_.map.setLayoutProperty("kg", "visibility", "visible");
    }
  } else {
    _context_.map.setLayoutProperty("kg", "visibility", "none");
  }
};

/**
 * 获取控规信息
 * @param {*} _context_ 
 */
const _fetchKg = async _context_ => {
  const data = await _context_.fetchKg({
    url: ALLLANDREGULATORY + "/0",
    outFields: "YDDM,YDXZ"
  });
  return data;
};

/**
 * 控规画图
 * @param {*} _context_ 
 * @param {*} kgs 
 */
const addKg = (_context_, kgs) => {
  _context_.map.addLayer(
    {
      id: "kg",
      type: "fill",
      source: {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: kgs.map(item => {
            const { geometry, attributes } = item;
            const colorObj = colorHash[attributes["YDDM"]];
            return {
              type: "Feature",
              geometry: {
                type: "Polygon",
                coordinates: geometry.rings
              },
              properties: {
                ...attributes,
                color: colorObj ? colorObj.color : "rgba(227, 139, 79,0.8)",
                outline: colorObj ? colorObj.outline : "rgba(0, 0, 0, 0.5)"
              }
            };
          })
        }
      },
      layout: {},
      paint: {
        "fill-color": { type: "identity", property: "color" },
        "fill-outline-color": { type: "identity", property: "outline" }
      }
    },
    "blank"
  );
};
