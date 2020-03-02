/* eslint-disable */
import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
import { fetchArcgisServer } from "@/api/beans/space";
export default new Vuex.Store({
  state: {
    /** 空间范围查询 */
    radius: 1500, // default
    /** 空间信息更新 */
    located: undefined,
    /** hash表信息 */
    spaceValHash: undefined,
    /** Loading */
    loading: false,
    /** 一带n区/一园/一园面 */
    areas: [],
    zones: [],
    zonePolygon: [],
    /** 控规数据 */
    kg: []
  },
  mutations: {
    /**
     * 修改loading mask
     * @param {*} state
     * @param {*} val
     */
    updateLoading(state, val) {
      state.loading = val;
    },
    /**
     * 修改缓冲区半径
     * @param {*} state
     * @param {*} val
     */
    updateRadius(state, val) {
      state.radius = val;
    },
    /**
     * 若传入信息已有空间化数据,则保存在状态管理内
     * @param {*} state
     * @param {*} val
     */
    updateLocated(state, val = undefined) {
      state.located = val;
    },
    /**
     * 空间/业务映射hash获取
     */
    updateSpaceValHash(state, val = {}) {
      state.spaceValHash = val;
    },
    /**
     * n区更新
     */
    updateAreas(state, val = []) {
      state.areas = val;
    },
    /**
     * 一园数据
     */
    updateZones(state, val = []) {
      state.zones = val;
    },
    /**
     * 一园面数据
     */
    updateZonePolygon(state, val = []) {
      state.zonePolygon = val;
    },
    /**
     * n区更新
     */
    updateKg(state, val = []) {
      state.kg = val;
    }
  },
  actions: {
    /**
     * 获取一带七区坐标
     * @param {*} param0
     * @param {*} option
     */
    async fetchLocatedSpace({ state, commit }, option) {
      const { data } = await fetchArcgisServer(option);
      commit("updateAreas", data.features);
      return data.features;
    },
    async fetchLocatedZones({ state, commit }, option) {
      const { data } = await fetchArcgisServer(option);
      commit("updateZones", data.features);
      return data.features;
    },
    async fetchLocatedZonePolygon({ state, commit }, option) {
      const { data } = await fetchArcgisServer(option);
      commit("updateZonePolygon", data.features);
      return data.features;
    },
    /**
     * 获取控规面信息(上限1000,需修改配置)
     * @param {*} param0
     * @param {*} option
     */
    async fetchKg({ state, commit }, option) {
      const { data } = await fetchArcgisServer(option);
      commit("updateKg", data.features);
      return data.features;
    }
  }
});
