/**
 * [tableHash] 业务表\空间表映射
 * [key]    表名
 * @s_key   空间表字段
 * @arcgis  arcgis服务名
 * @layer   arcgis图层
 */
import {
  TDTJY,
  TDTDSJ,
  TDTXZQH,
  CYBJ,
  DKHX,
  JJTS,
  ZSZY,
  LVYOU,
  LCGF,
  TDTIMAGE2017
} from "./config";
export const styleHash = {
  简约风: TDTJY,
  大数据: TDTDSJ,
  行政区划: TDTXZQH,
  影像图: TDTIMAGE2017
};
export const Hash = {
  default: {
    s_key: undefined,
    arcgis: undefined,
    layer: undefined
  },
  //  企业 [point]
  u_qyzc: {
    title: "在册企业",
    s_key: "企业名称",
    arcgis: CYBJ,
    layer: 4,
    pop: {
      title: "企业名称",
      attr: [
        {
          key: "行业分类",
          title: "行业分类"
        },
        {
          key: "mc",
          title: "地址"
        },
        {
          key: "统一社会信",
          title: "社会统一信用代码"
        }
      ]
    }
  },
  //  可供地块 [polygon]
  u_ydkgdk: {
    title: "可供地块",
    s_key: "dkzl",
    arcgis: DKHX,
    layer: 0,
    where: `lx='可供地块'`,
    pop: {
      title: "dkzl",
      attr: [
        {
          key: "ydxz",
          title: "用地性质"
        },
        {
          key: "mj",
          title: "用地面积(亩)"
        },
        {
          key: "lx",
          title: "用地类型"
        }
      ]
    }
  },
  //  已征待拆 [polygon]
  u_ydyzdc: {
    title: "已征待拆地块",
    s_key: "dkzl",
    arcgis: DKHX,
    layer: 0,
    where: `lx='已征待拆'`,
    pop: {
      title: "dkzl",
      attr: [
        {
          key: "ydxz",
          title: "用地性质"
        },
        {
          key: "mj",
          title: "用地面积(亩)"
        },
        {
          key: "lx",
          title: "用地类型"
        }
      ]
    }
  },
  //  重点项目 [point]
  u_zdcy: {
    title: "重点项目",
    s_key: "name",
    arcgis: JJTS,
    layer: 1,
    pop: {
      title: "name",
      attr: [
        {
          key: "duty",
          title: "责任单位"
        },
        {
          key: "invest",
          title: "投资额(万)"
        },
        {
          key: "rate",
          title: "完成进度"
        }
      ]
    }
  },
  //  重点楼宇 [point]
  u_zdly: {
    title: "重点楼宇",
    s_key: "name",
    arcgis: JJTS,
    layer: 2,
    pop: {
      title: "name",
      attr: [
        {
          key: "address",
          title: "详细地址"
        },
        {
          key: "ssjd",
          title: "所属街道"
        }
      ]
    }
  },
  //  专业市场 [point]
  u_zysc: {
    title: "专业市场",
    s_key: "name",
    arcgis: JJTS,
    layer: 3,
    pop: {
      title: "name",
      attr: [
        {
          key: "ssjd",
          title: "所属街道"
        }
      ]
    }
  },
  //  招商地块 [point]
  u_zsdkd: {
    title: "招商项目",
    s_key: "name",
    arcgis: JJTS,
    layer: 4,
    pop: {
      title: "name",
      attr: [
        {
          key: "ssjd",
          title: "所属街道"
        },
        {
          key: "address",
          title: "项目地址"
        }
      ]
    }
  },
  // 招商地块面 [polygon]
  u_zsdkm: {
    title: "招商地块",
    s_key: "xmmc",
    arcgis: ZSZY,
    layer: 3,
    pop: {
      title: "xmmc",
      attr: [
        {
          key: "ssjd",
          title: "所在街道"
        },
        {
          key: "ydmj",
          title: "用地面积(亩)"
        },
        {
          key: "jzmj",
          title: "建筑面积(㎡)"
        }
      ]
    }
  },
  // 鹿城旅游 [point]
  u_lvyou: {
    title: "特色旅游",
    s_key: "name",
    arcgis: LVYOU,
    layer: 0,
    pop: {
      title: "name",
      attr: [
        {
          key: "type",
          title: "类型"
        },
        {
          key: "jj",
          title: "简介"
        }
      ]
    }
  },
  // 鹿城公房 [point]
  u_lcgf: {
    title: "鹿城公房",
    s_key: "dz",
    arcgis: LCGF,
    layer: 0,
    pop: {
      title: "dz",
      attr: [
        {
          key: "mj",
          title: "建筑面积(㎡)"
        },
        {
          key: "fwyt",
          title: "房屋用途"
        },
        {
          key: "qsdw",
          title: "权属单位"
        },
        {
          key: "fwzt",
          title: "房屋状态"
        }
      ]
    }
  }
};
