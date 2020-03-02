<template>
  <div class="heat">
    <div>
      <a-tree
        checkable
        @check="onCheck"
        @expand="onExpand"
        :expandedKeys="expandedKeys"
        :autoExpandParent="autoExpandParent"
        @select="onSelect"
        :selectedKeys="selectedKeys"
        :treeData="treeData"
      />
    </div>
  </div>
</template>

<script>
/* eslint-disable */
const treeData = [
  {
    title: "所有产业",
    key: "@",
    children: [
      {
        title: "第一产业",
        key: "@1",
        children: [{ title: "农林牧渔业", key: "农林牧渔业" }]
      },
      {
        title: "第二产业",
        key: "@2",
        children: [
          { title: "装备制造", key: "装备制造" },
          { title: "鞋材、鞋业", key: "鞋材、鞋业" },
          { title: "其他", key: "其他" }
        ]
      },
      {
        title: "第三产业",
        key: "@3",
        children: [
          { title: "房地产业", key: "房地产业" },
          { title: "交通运输、仓储和邮政业", key: "交通运输、仓储和邮政业" },
          { title: "金融业", key: "金融业" },
          { title: "批发和零售业", key: "批发和零售业" },
          { title: "其他服务业", key: "其他服务业" },
          {
            title: "信息传输、信息技术服务业",
            key: "信息传输、软件和信息技术服务业"
          },
          { title: "住宿和餐饮业", key: "住宿和餐饮业" }
        ]
      }
    ]
  }
];
export default {
  name: "heat",
  data() {
    return {
      expandedKeys: ["@1", "@2", "@3"],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      treeData
    };
  },
  methods: {
    onExpand(expandedKeys) {
      console.log("onExpand", expandedKeys);
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onCheck(checkedKeys) {
      console.log("onCheck", checkedKeys);
      this.checkedKeys = checkedKeys;
    },
    onSelect(selectedKeys, info) {
      console.log("onSelect", info);
      this.selectedKeys = selectedKeys;
    }
  }
};
</script>

<style scoped lang="less">
.heat {
  position: fixed;
  left: 130px;
  border-radius: 6px;
  bottom: 10px;
  background-color: #fff;
  padding: 0 10px 0 6px;
  max-width: 260px;
  overflow: hidden;
}
</style>