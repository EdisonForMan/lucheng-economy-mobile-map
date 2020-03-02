/* eslint-disable */
import { getDefaultAxios } from "@/api/index.js";

/**
 * 获取信息
 * @param {*} _option 额外配置
 * @param {*} hash    业务表
 */
async function fetchDataStores({ where, table, cols }) {
  const axios = getDefaultAxios();
  const option = {
    module: "dwbean",
    action: "001",
    count: 1,
    res: "testsql_all",
    ds: {
      buffers: [],
      tables: [
        {
          alias: "a",
          orm: "",
          name: table,
        }
      ],
      cols,
      module: "testsql_all",
      where,
    }
  };
  return await axios.post("/dw/ds", option);
}

export default fetchDataStores;
