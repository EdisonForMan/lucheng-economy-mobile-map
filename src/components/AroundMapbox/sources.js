/* eslint-disable */
import { WRT_config } from "@/components/common/config";
const { server } = WRT_config;
const _COMMONICON_ = `${server}/icon/commonIcon`;
const _AROUNDICON_ = `${server}/icon/aroundIcon/v5`;
const _MOBILE_LOCATION_SELF_ = `${_COMMONICON_}/mobile_location_self.png`;
const _FORCE_LOCATION_ = `${_COMMONICON_}/location_self.png`;
const _AROUND_1_ = `${_AROUNDICON_}/娱乐健身.png`;
const _AROUND_2_ = `${_AROUNDICON_}/便利店.png`;
const _AROUND_3_ = `${_AROUNDICON_}/餐饮.png`;
const _AROUND_4_ = `${_AROUNDICON_}/宾馆酒店.png`;
const _AROUND_5_ = `${_AROUNDICON_}/公交站.png`;
const _AROUND_6_ = `${_AROUNDICON_}/停车场.png`;
const _AROUND_7_ = `${_AROUNDICON_}/银行.png`;
const _AROUND_8_ = `${_AROUNDICON_}/购物百货.png`;
const _AROUND_9_ = `${_AROUNDICON_}/房产小区.png`;
const _AROUND_10_ = `${_AROUNDICON_}/大楼大厦.png`;
const _AROUND_11_ = `${_AROUNDICON_}/医院.png`;
const _AROUND_12_ = `${_AROUNDICON_}/学校.png`;
const _AROUND_13_ = `${_AROUNDICON_}/加油站.png`;
const _AROUND_14_ = `${_AROUNDICON_}/公园广场.png`;
/**
 * 资源整合
 * @param {*} _context_ vue
 */
export const sources = ({ map }) => {
  return new Promise((resolve, reject) => {
    try {
      map.loadImage(_MOBILE_LOCATION_SELF_, (E, i) => {
        map.addImage("_MOBILE_LOCATION_SELF_", i);
      });
      map.loadImage(_FORCE_LOCATION_, (E, i) => {
        map.addImage("_FORCE_LOCATION_", i);
      });
      map.loadImage(_AROUND_1_, (E, i) => {
        map.addImage("_AROUND_1_", i);
      });
      map.loadImage(_AROUND_2_, (E, i) => {
        map.addImage("_AROUND_2_", i);
      });
      map.loadImage(_AROUND_3_, (E, i) => {
        map.addImage("_AROUND_3_", i);
      });
      map.loadImage(_AROUND_4_, (E, i) => {
        map.addImage("_AROUND_4_", i);
      });
      map.loadImage(_AROUND_5_, (E, i) => {
        map.addImage("_AROUND_5_", i);
      });
      map.loadImage(_AROUND_6_, (E, i) => {
        map.addImage("_AROUND_6_", i);
      });
      map.loadImage(_AROUND_7_, (E, i) => {
        map.addImage("_AROUND_7_", i);
      });
      map.loadImage(_AROUND_8_, (E, i) => {
        map.addImage("_AROUND_8_", i);
      });
      map.loadImage(_AROUND_9_, (E, i) => {
        map.addImage("_AROUND_9_", i);
      });
      map.loadImage(_AROUND_10_, (E, i) => {
        map.addImage("_AROUND_10_", i);
      });
      map.loadImage(_AROUND_11_, (E, i) => {
        map.addImage("_AROUND_11_", i);
      });
      map.loadImage(_AROUND_12_, (E, i) => {
        map.addImage("_AROUND_12_", i);
      });
      map.loadImage(_AROUND_13_, (E, i) => {
        map.addImage("_AROUND_13_", i);
      });
      map.loadImage(_AROUND_14_, (E, i) => {
        map.addImage("_AROUND_14_", i);
      });
      resolve(true);
    } catch (e) {
      reject(e);
    }
  });
};
