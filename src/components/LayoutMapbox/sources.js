/* eslint-disable */
import CYBK from "./cybk";
import LINE from "./line";
// import LINE from "./line";
const BKLX = {
  南郊街道: "#FED799",
  南汇街道: "#BFC3FF",
  大南街道: "#AAFBB5",
  滨江街道: "#99E4FF",
  五马街道: "#AAFBB5",
  双屿街道: "#A3FDFF",
  丰门街道: "#A3FBD3",
  藤桥镇: "#C7CCF9",
  七都街道: "#FFFF99"
};
const HUGESIZE = 200;
const HUGEFILL = [65, 105, 225, 0.8];
const LITTLESIZE = 120;
const LITTLEFILL = [220, 20, 60, 0.7];

/**
 * 下发动态圈标
 * @param {*} _context_ vue
 * @param {*} shallZones 七区\一园 标识
 */
const addPulsingDot = (_context_, shallZones) => {
  const SIZE = shallZones ? LITTLESIZE : HUGESIZE;
  const INNERCOLOR = shallZones ? LITTLEFILL : HUGEFILL;
  return {
    width: SIZE,
    height: SIZE,
    data: new Uint8Array(SIZE * SIZE * 4),
    _context_,
    onAdd: function() {
      var canvas = document.createElement("canvas");
      canvas.width = this.width;
      canvas.height = this.height;
      this.context = canvas.getContext("2d");
    },
    render: function() {
      var duration = 2000;
      var t = (performance.now() % duration) / duration;
      var radius = (SIZE / 2) * 0.3;
      var outerRadius = (SIZE / 2) * 0.3 * t + radius;
      var context = this.context;
      // draw outer circle
      context.clearRect(0, 0, this.width, this.height);
      context.beginPath();
      context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
      context.fillStyle = "rgba(255, 200, 200," + (1 - t) + ")";
      context.fill();
      // draw inner circle
      context.beginPath();
      context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(${INNERCOLOR.join(",")})`;
      context.strokeStyle = "white";
      context.lineWidth = 2 + 4 * (1 - t);
      context.fill();
      context.stroke();
      this.data = context.getImageData(0, 0, this.width, this.height).data;
      this._context_.map.triggerRepaint();
      return true;
    }
  };
};
/**
 * 资源整合
 * @param {*} _context_ vue
 */
export const sources = _context_ => {
  return new Promise((resolve, reject) => {
    _context_.map.addSource("lines", { type: "geojson", data: LINE }); // 一带
    _context_.map.addSource("plate", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: CYBK.features.map(({ geometry, properties }) => {
          return {
            type: "Feature",
            geometry,
            properties: {
              ...properties,
              color: BKLX[properties.FNAME]
            }
          };
        })
      }
    }); // 产业板块
    _context_.map.addSource("areas", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: _context_.areas.map(({ geometry, attributes }) => {
          const { x, y } = geometry;
          return {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [x, y]
            },
            properties: attributes
          };
        })
      }
    }); // 七区
    _context_.map.addSource("zones", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: _context_.zones.map(({ geometry, attributes }) => {
          const { x, y } = geometry;
          return {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [x, y]
            },
            properties: attributes
          };
        })
      }
    }); // 一园
    _context_.map.addSource("zonePolygon", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: _context_.zonePolygon[0].geometry.rings
            }
          }
        ]
      }
    }); // 一园面
    _context_.map.addImage("areas-dot", addPulsingDot(_context_), {
      pixelRatio: 2
    }); //  七区样式
    _context_.map.addImage("zones-dot", addPulsingDot(_context_, true), {
      pixelRatio: 2
    }); //  一园样式
    resolve(true);
  });
};
