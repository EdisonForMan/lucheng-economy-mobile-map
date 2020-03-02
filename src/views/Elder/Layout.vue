<template>
  <div class="layout">
    <header class="header">
      <a-dropdown class="mapStyle">
        <a class="ant-dropdown-link" href="#">
          地图风格
          <a-icon type="down" />
        </a>
        <a-menu slot="overlay">
          <a-menu-item
            v-for="(item,index) in styleTip"
            :key="index"
            @click="$refs.arcgis.switchStyle(styleTip,item)"
          >
            <a href="javascript:;">{{item}}</a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </header>
    <div class="container">
      <Arcgis ref="arcgis" :block="block" :six="six" />
      <div class="panel">
        <a-checkbox v-model="block" @change="(e)=>{block=e.target.checked}">产业板块</a-checkbox>
        <a-checkbox v-model="six" @change="(e)=>{six=e.target.checked}">一带六区</a-checkbox>
        <a-button @click="()=>{showTree=!showTree}">热力图</a-button>
        <heat-tree v-show="showTree" :option="tree" />
      </div>
      <div class="spin" v-if="mask">
        <a-spin>
          <a-icon slot="indicator" type="loading" style="font-size: 40px" spin />
        </a-spin>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import Arcgis from "@/components/Layout/Arcgis";
import HeatTree from "@/components/Layout/HeatTree";
import { styleHash } from "@/components/common/tableHash";
import { mapState } from "vuex";
export default {
  name: "layout",
  components: { Arcgis, HeatTree },
  data() {
    return {
      styleTip: ["简约风", "大数据", "行政区划", "影像图"],
      block: true,
      six: true,
      showTree: false,
      tree: [],
      mask: false
    };
  },
  computed: {
    ...mapState({
      loading: state => state.loading
    })
  },
  watch: {
    loading(val) {
      this.mask = val;
    }
  }
};
</script>

<style lang="less">
.layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  .header {
    height: 0px;
    .mapStyle {
      top: 14px;
    }
  }
  .container {
    .panel {
      position: fixed;
      bottom: 10px;
      left: 10px;
      text-align: left;
      background-color: #fff;
      padding: 10px;
      border-radius: 8px;
      width: 110px;
      > * {
        display: block;
        margin: 0px !important;
      }
      .ant-btn {
        height: 30px;
        line-height: 30px;
        margin-top: 4px !important;
      }
    }
  }
}
</style>