<template>
  <div :class="{heat:true,cover:isOpen,show:isShow}" @click="toggle(false)">
    <!-- <div class="cover"> -->
    <div class="ant-tree-frame" :class="{left:!isOpen}" @click.stop="()=>{}">
      <a-tree
        @expand="onExpand"
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
import { treeData } from "./treeHash";
export default {
  name: "heat",
  data() {
    return {
      expandedKeys: ["@1", "@2", "@3"],
      autoExpandParent: true,
      selectedKeys: [],
      treeData,
      isOpen: false,
      isShow: false,
      screenWidth: 0
    };
  },
  created() {
    this.screenWidth = window.screen.availWidth;
  },
  watch: {
    checkedKeys(val) {
      console.log("onCheck", this.checkedKeys);
      this.$parent.$refs.arcgis.heat(this.checkedKeys);
    }
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
    onExpand(expandedKeys) {
      // console.log("onExpand", expandedKeys);
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onSelect(selectedKeys, { selectedNodes }) {
      // console.log(selectedNodes)
      this.selectedKeys = selectedKeys;
      this.$parent.heat_tip = this.getChildNode(selectedNodes);
      this.$parent.heat_title = selectedNodes[0].data.props.title;
      this.toggle(false);
    },
    getChildNode(nodes) {
      let arr = [];
      nodes.map(item => {
        arr = arr.concat(
          item.componentOptions.children.length
            ? this.getChildNode(item.componentOptions.children)
            : [item.data.props.title]
        );
      });
      return arr;
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