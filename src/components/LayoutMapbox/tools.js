/* eslint-disable */
import { fetchArcgisServer } from "@/api/beans/space";

const eventAdd = _context_ => {
  _context_.map.on("click", "evo", ({ features }) => {
    const { geometry, properties } = features[0];
    console.log(geometry, properties);
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
    eventAdd(_context_);
    resolve(true);
  });
};
