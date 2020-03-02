<template>
  <div :class="{heat:true,cover:isOpen,show:isShow}" @click="toggle(false)">
    <!-- <div class="cover"> -->
    <div class="ant-tree-frame" :class="{left:!isOpen}" @click.stop="()=>{}">
      <a-tree
        :expandedKeys="expandedKeys"
        :autoExpandParent="autoExpandParent"
        @select="onSelect"
        :selectedKeys="selectedKeys"
        :treeData="treeData"
      />
    </div>
  </div>
  <!-- </div> -->
</template>

<script>
/* eslint-disable */
const treeData = [
  {
    title: "招商专题",
    key: "@1",
    selectable: false,
    children: [
      { title: "可供地块", key: "@1@u_ydkgdk@polygon" },
      { title: "已征待拆", key: "@1@u_ydyzdc@polygon" },
      { title: "招商地块", key: "@1@u_zsdkm@polygon" },
      { title: "招商楼宇", key: "@1@u_zdly@point" },
      { title: "鹿城公房", key: "@1@u_lcgf@point" }
    ]
  },
  {
    title: "经济特色",
    key: "@2",
    selectable: false,
    children: [
      { title: "专业市场", key: "@2@u_zysc@point" },
      { title: "重点项目", key: "@2@u_zdcy@point" },
      { title: "优质楼宇", key: "@2@u_zdly@point" },
      { title: "招商项目", key: "@2@u_zsdkd@point" }
    ]
  }
];
export default {
  name: "heat",
  data() {
    return {
      expandedKeys: ["@1", "@2"],
      autoExpandParent: true,
      selectedKeys: [],
      treeData,
      isOpen: false,
      isShow: false
    };
  },
  methods: {
    toggle(val) {
      if (val) {
        this.isOpen = true;
        this.isShow = true;
      } else {
        this.isOpen = false;
        setTimeout(() => {
          this.isShow = false;
        }, 600);
      }
    },
    onSelect(selectedKeys, { selectedNodes }) {
      if (!selectedKeys.length) return;
      this.selectedKeys = selectedKeys;
      const [_key, ...others] = selectedKeys;
      const [blank, index, table, mode] = _key.split("@");
      this.$parent.tableParam = { mode, table };
      this.toggle(false);
    }
  }
};
</script>

<style scoped lang="less">
.heat {
  height: 100%;
  overflow: hidden;
  position: absolute;
  z-index: 2;
  transition: all 0.6s;
  .ant-tree-frame {
    width: 260px;
    height: 100%;
    background-color: rgba(255, 255, 255);
    transition: all 0.6s;
    position: fixed;
    left: 0px;
    text-align: left;
    .ant-tree {
      box-sizing: border-box;
      padding-left: 10px;
    }
  }
  .left {
    left: -260px;
  }
}
.cover {
  background-color: rgba(0, 0, 0, 0.4);
}
.show {
  width: 100%;
}
</style>