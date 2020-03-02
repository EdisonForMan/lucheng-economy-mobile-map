/* eslint-disable */
import qs from "qs";
import { getDefaultAxios, getArcgisAxios } from "@/api/index.js";
/**
 * 更新\插入空间信息
 * @param {*} sql SQL语句
 */
export async function updateDataStores(sql) {
  const axios = getDefaultAxios();
  console.log("[sql]", sql);
  return await axios.post("/etl/sql_all", {
    sql
  });
}

export async function fetchArcgisServer({ where = "1=1", url, outFields }) {
  const axios = getArcgisAxios();
  return await axios.get(`${url}/query`, {
    params: {
      f: "json",
      outFields: outFields || "*",
      where,
      returnGeometry: true,
      spatialRel: "esriSpatialRelIntersects",
      relationParameter: (+new Date()).toString()
    }
  });
}

export async function fetchArcgisGeometry(url, _params_) {
  const axios = getArcgisAxios();
  return await axios.post(
    `${url}/query`,
    qs.stringify({
      f: "json",
      outFields: "*",
      spatialRel: "esriSpatialRelIntersects",
      // relationParameter: (+new Date()).toString(),
      ..._params_
    }),
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" } //加上这个
    }
  );
}
