/* eslint-disable */
import BLANK from "./mb.json";
import QH_OUT from "./qhxw";
import QH_IN from "./qhxn";
/**
 * 资源整合
 * @param {*} _context_ vue
 */
export const rootSources = _context_ => {
  return new Promise((resolve, reject) => {
    _context_.map.addSource("blank", { type: "geojson", data: BLANK }); // 蒙白
    _context_.map.addSource("qh_out", { type: "geojson", data: QH_OUT }); // 外区划
    _context_.map.addSource("qh_in", { type: "geojson", data: QH_IN }); // 内区划
    resolve(true);
  });
};
