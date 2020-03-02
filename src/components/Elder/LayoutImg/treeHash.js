export const imgArr = [
  "default*一带八区",
  "@*所有产业",
  "@1*第一产业",
  "@1@1*农林牧渔业",
  "@2*第二产业",
  "@2@1*装备制造",
  "@2@2*鞋材、鞋业",
  "@2@3*其他",
  "@3*第三产业",
  "@3@1*房地产业",
  "@3@2*交通运输、仓储和邮政业",
  "@3@3*金融业",
  "@3@4*批发和零售业",
  "@3@5*其他服务业",
  "@3@6*信息传输、信息技术服务业",
  "@3@7*住宿和餐饮业"
];
export const treeData = [
  {
    title: "所有产业",
    key: "@",
    children: [
      {
        title: "第一产业",
        key: "@1",
        children: [{ title: "农林牧渔业", key: "@1@1" }]
      },
      {
        title: "第二产业",
        key: "@2",
        children: [
          { title: "装备制造", key: "@2@1" },
          { title: "鞋材、鞋业", key: "@2@2" },
          { title: "其他", key: "@2@3" }
        ]
      },
      {
        title: "第三产业",
        key: "@3",
        children: [
          { title: "房地产业", key: "@3@1" },
          { title: "交通运输、仓储和邮政业", key: "@3@2" },
          { title: "金融业", key: "@3@3" },
          { title: "批发和零售业", key: "@3@4" },
          { title: "其他服务业", key: "@3@5" },
          { title: "信息传输、信息技术服务业", key: "@3@6" },
          { title: "住宿和餐饮业", key: "@3@7" }
        ]
      }
    ]
  }
];