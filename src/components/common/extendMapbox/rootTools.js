/* eslint-disable */
/**
 * 添加鹿城蒙白
 * @param {*} _context_
 */
const addBlank = _context_ => {
  _context_.map.addLayer({
    id: "blank",
    type: "fill",
    source: "blank",
    paint: { "fill-color": "#000000", "fill-opacity": 0.4 }
  });
};
/**
 * 添加区划
 * @param {*} _context_
 */
const addQH = _context_ => {
  _context_.map.addLayer(
    {
      id: "qh_out",
      type: "line",
      source: "qh_out",
      paint: {
        "line-color": "rgb(37,183,251)",
        "line-width": 7
      }
    },
  );
  _context_.map.addLayer(
    {
      id: "qh_in",
      type: "line",
      source: "qh_in",
      paint: {
        "line-color": "rgb(37,183,251)",
        "line-width": 4,
        "line-dasharray": [2, 2]
      }
    },
  );
};
/**
 * 初始根地图
 * 添加蒙白/区划
 * @param {*} _context_
 */
export const rootTool = _context_ => {
  return new Promise((resolve, reject) => {
    addBlank(_context_);
    addQH(_context_);
    resolve(true);
  });
};
