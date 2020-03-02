<template>
  <div class="layout">
    <div class="container">
      <div class="panel">
        <a-checkbox v-model="areas" @change="(e)=>{areas=e.target.checked}">一带一园七区</a-checkbox>
        <a-button @click="()=>{$refs.heat_tree.toggle(true)}">产业布局</a-button>
        <!-- <a-button class="clearLayer" @click="clearHeat">清除图层</a-button> -->
        <a-tag v-show="heat_title" class="title">{{heat_title}}</a-tag>
        <!-- <a-button class="set3d" @click="()=>{$refs.mapbox.changePitch()}">3D地图</a-button> -->
        <heat-tree ref="heat_tree" />
      </div>
      <Mapbox ref="mapbox" />
      <a-tooltip placement="topLeft">
        <template slot="title">本系统数据仅供参考，欢迎社会各界人士监督，监督电话：0577-88338620.感谢您的参与和支持！</template>
        <i class="iconfont icontishi" />
      </a-tooltip>
      <i class="iconfont iconshanchu" @click="clearHeat" />
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
import Mapbox from "@/components/LayoutMapbox/Mapbox";
import HeatTree from "@/components/LayoutMapbox/HeatTree";
import { mapState } from "vuex";
export default {
  name: "layoutMapbox",
  components: { Mapbox, HeatTree },
  data() {
    return {
      mask: false,
      areas: true,
      showTree: false,
      heat_tip: "",
      heat_title: ""
    };
  },
  computed: {
    ...mapState({
      loading: state => state.loading
    })
  },
  methods: {
    clearHeat() {
      this.heat_tip = "";
      this.heat_title = "";
      this.$nextTick(() => {
        this.$refs.heat_tree.selectedKeys = [];
        this.$refs.mapbox.changeHeat(this.heat_tip, false);
      });
    }
  },
  watch: {
    loading(val) {
      this.mask = val;
    },
    heat_tip(val, old) {
      val && this.$refs.mapbox.changeHeat(val);
    },
    areas(val) {
      this.$refs.mapbox.changeAreas(val);
    }
  }
};
</script>

<style lang="less">
@import url("../components/LayoutMapbox/LayoutMapbox.less");
</style>