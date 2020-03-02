<template>
  <div class="layoutImg">
    <div class="panel">
      <a-button class="toTree" @click="()=>{$refs.heat_tree.toggle(true)}">产业布局</a-button>
      <a-button class="toMap" @click="()=>{$router.push('/layout')}">
        <i class="iconfont icon-ditu" />地图
      </a-button>
      <heat-tree ref="heat_tree" />
      <heat-img :heat_tip="heat_tip" />
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import HeatTree from "@/components/LayoutImg/HeatTree";
import HeatImg from "@/components/LayoutImg/HeatImg";
export default {
  name: "layoutImg",
  components: { HeatTree, HeatImg },
  data() {
    return {
      showTree: false,
      heat_tip: "@"
    };
  }
};
</script>

<style lang="less">
.layoutImg {
  height: 100%;
  display: flex;
  flex-direction: column;
  .panel {
    flex: 1;
    text-align: left;
    background-color: #fff;
    border-radius: 8px;
    height: 100%;
    width: 100%;
    > * {
      display: block;
      margin: 0px !important;
    }
    .ant-btn {
      height: 40px;
      line-height: 40px;
      left: 10px;
      position: absolute;
      // transform: rotate(90deg);
      z-index: 2;
    }
    .toTree {
      top: 10px;
    }
    .toMap {
      top: 60px;
      * {
        vertical-align: top;
      }
      .icon-ditu {
        font-size: 24px;
      }
    }
  }
}
</style>