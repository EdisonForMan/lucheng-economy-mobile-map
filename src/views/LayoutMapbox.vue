<template>
  <div class="layout">
    <div class="container">
      <Mapbox ref="mapbox" />
      <a-tooltip placement="topLeft">
        <template slot="title">本系统数据仅供参考，欢迎社会各界人士监督，监督电话：0577-88338620.感谢您的参与和支持！</template>
        <i class="iconfont icontishi" />
      </a-tooltip>
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
      areas: true
    };
  },
  computed: {
    ...mapState({
      loading: state => state.loading
    })
  },
  methods: {},
  watch: {
    loading(val) {
      this.mask = val;
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