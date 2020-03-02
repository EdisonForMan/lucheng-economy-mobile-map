/* eslint-disable */
import { WRT_config } from "@/components/common/config";
const { server } = WRT_config;
const _COMMONICON_ = `${server}/icon/commonIcon`;
const _P_MARKER_ = `${_COMMONICON_}/location_self.png`;
/**
 * 资源整合
 * @param {*} _context_ vue
 */
export const sources = ({ map }) => {
  return new Promise((resolve, reject) => {
    try {
      map.loadImage(_P_MARKER_, (E, i) => {
        map.addImage("_P_MARKER_", i);
      });
      resolve(true);
    } catch (e) {
      reject(e);
    }
  });
};
