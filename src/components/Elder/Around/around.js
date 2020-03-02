/* eslint-disable */
/** 存放周边分析相关函数 */
import { loadModules } from "esri-loader";
import { BUILDAROUND, WRT_config, OPTION } from "@/components/common/config";
const { server } = WRT_config;
const symbol = {
  type: "simple-fill",
  color: [0, 0, 0, 0.1],
  outline: {
    color: [255, 255, 255, 0.8],
    width: 1
  }
};
/**
 * 清除图层要素
 * @param {*} _context_ vue
 */
export const clearLayers = _context_ => {
  _context_.view.graphics.removeMany(
    _context_.view.graphics.items.filter(item => {
      return item.id == "click_point";
    })
  );
  _context_.view.popup.visible = false;
  _context_.graphicsLayer.removeAll();
  _context_.textLayer.removeAll();
};

/**
 * 周边查找 画周边圈
 * @param {*} _context_ vue
 * @param {*} val 周边类型
 */
export const switchAround = _context_ => {
  _context_.updateLoading(true);
  clearLayers(_context_);
  const { geometry, center } = _context_.$store.state.located;
  loadModules(
    ["esri/Graphic", "esri/geometry/Circle", "esri/geometry/Point"],
    OPTION
  ).then(([Graphic, Circle, Point]) => {
    let point;
    if (_context_.$params.mode === "point") {
      point = new Point({
        x: geometry.x,
        y: geometry.y
      });
    } else {
      point = new Point({
        x: center[0],
        y: center[1]
      });
    }
    const buffer = new Circle({
      center: point,
      radius: _context_.radius
    });
    _context_.graphicsLayer.add(
      new Graphic(
        {
          geometry: buffer,
          symbol
        },
        1
      )
    );
    _context_.view.goTo({
      center: point,
      zoom: 14
    });
    fetchAreaPoint(_context_, buffer);
  });
};

/**
 * 获取周边兴趣点
 * @param {*} graphicsLayer     图层
 * @param {*} geometry          空间位置
 * @param {*} val               兴趣点类型
 */
const fetchAreaPoint = (
  { graphicsLayer, textLayer, aroundType, updateLoading },
  geometry
) => {
  loadModules(
    ["esri/Graphic", "esri/tasks/QueryTask", "esri/tasks/support/Query"],
    OPTION
  ).then(([Graphic, QueryTask, Query]) => {
    const queryTask = new QueryTask({
      url: `${BUILDAROUND}/${aroundType}`
    });
    const query = new Query();
    query.outFields = ["*"];
    query.where = "1=1";
    query.extent = geometry.extent;
    query.geometry = geometry;
    // 查询参数为点
    query.returnGeometry = true;
    queryTask.execute(query).then(response => {
      if (!response.features.length) return updateLoading(false);
      response.features.map(item => {
        const z = 100;
        const point = {
          type: "point",
          x: item.geometry.x,
          y: item.geometry.y,
          z
        };
        const pointGraphic = new Graphic({
          geometry: point,
          symbol: {
            type: "picture-marker",
            url: `${server}/icon/aroundIcon/v5/${item.attributes.TYPE}.png`,
            width: "20px",
            height: "20px"
          }
        });
        const textGraphic = new Graphic({
          geometry: point,
          symbol: {
            type: "text",
            color: "#fff",
            haloColor: "#000",
            haloSize: "1px",
            text: item.attributes.SHORTNAME,
            yoffset: 10,
            font: {
              size: 12,
              family: "sans-serif"
            }
          }
        });
        graphicsLayer.add(pointGraphic, 2);
        textLayer.add(textGraphic, 2);
        updateLoading(false);
      });
    });
  });
};

/**
 * 点击地图
 * @param {*} _context_
 * @param {*} mapPoint
 */
export const mapClick = (_context_, mapPoint) => {
  _context_.view.graphics.removeMany(
    _context_.view.graphics.items.filter(item => {
      return item.id == "click_point";
    })
  );
  loadModules(
    [
      "esri/tasks/IdentifyTask",
      "esri/tasks/support/IdentifyParameters",
      "esri/Graphic"
    ],
    OPTION
  ).then(([IdentifyTask, IdentifyParameters, Graphic]) => {
    const identifyTask = new IdentifyTask({
      url: BUILDAROUND
    });
    const params = new IdentifyParameters();
    params.tolerance = 10;
    params.width = _context_.view.width;
    params.height = _context_.view.height;
    params.returnGeometry = true;
    params.geometry = mapPoint;
    params.mapExtent = _context_.view.extent;
    params.layerIds = [_context_.aroundType];
    identifyTask.execute(params).then(({ results }) => {
      if (results.length) {
        const obj = results[0].feature.attributes;
        const _mapPoint = results[0].feature.geometry;
        const { x, y } = _mapPoint;
        _context_.view.graphics.add(
          new Graphic({
            id: "click_point",
            geometry: _mapPoint,
            symbol: {
              type: "picture-marker", // autocasts as new PictureMarkerSymbol()
              url: `${server}/icon/commonIcon/location_self.png`,
              width: "26",
              height: "26",
              yoffset: 10
            }
          })
        );
        _context_.view.goTo(_mapPoint);
        const { wgs84togcj02, gcj02tobd09 } = _context_.$util;
        const { bd_lng, bd_lat } = gcj02tobd09(wgs84togcj02(x, y));
        //  百度地名地址
        _context_.$bGeo.getLocation(new BMap.Point(bd_lng, bd_lat), result => {
          if (result) {
            const { address, surroundingPois } = result;
            _context_.view.popup.open({
              title: obj["简称"],
              content: `<div class="_pop">
                <div class="_pop_title"><label>地址：</label><span>${
                  obj["地址"] && obj["地址"] != "Null" ? obj["地址"] : address
                }</span></div>
                <div class="_pop_title"><label>类型：</label><span>${
                  obj["类型"]
                }</span></div>
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
              </div>`,
              location: mapPoint,
              collapseEnabled: false
            });
            setTimeout(() => {
              document
                .getElementsByClassName("esri-popup__header-container")[0]
                .click();
            }, 0);
          }
        });
      }
    });
  });
};
