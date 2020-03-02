<template>
  <div class="polymerization">
    <div class="container">
      <a-button
        class="pick_btn"
        @click="()=>{$refs.pick_tree.toggle(true)}"
      >{{`专题:${spaceValHash.title}`}}</a-button>
      <a-button class="kg_btn" @click="kgChange">{{shallKg ? "关闭控规":"开启控规"}}</a-button>
      <a-dropdown class="style_btn">
        <a class="ant-dropdown-link" href="#">
          地图风格
          <a-icon type="down" />
        </a>
        <a-menu slot="overlay">
          <a-menu-item
            v-for="(item,index) in styleTip"
            :key="index"
            @click="$refs.mapbox._switchStyle(item)"
          >
            <a href="javascript:;">{{item}}</a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
      <pick-tree ref="pick_tree" />
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
import Vue from "vue";
import PickTree from "@/components/PolymerizationMapbox/PickTree";
import Mapbox from "@/components/PolymerizationMapbox/Mapbox";
import { mapState, mapMutations } from "vuex";
import { Hash } from "@/components/common/tableHash";
import { styleTip, aroundTip } from "@/components/common/enum";

export default {
  name: "polymerization",
  components: { PickTree, Mapbox },
  data() {
    return {
      styleTip,
      tableParam: {
        mode: null,
        table: null
      },
      mask: false,
      shallKg: false
    };
  },
  computed: {
    ...mapState({
      spaceValHash: state => state.spaceValHash,
      loading: state => state.loading
    })
  },
  watch: {
    loading(val) {
      this.mask = val;
    },
    tableParam: {
      handler(val) {
        //  修改vue原型参数 一般情况不建议这么做
        Vue.prototype.$params = val;
        const { table } = val;
        this.updateSpaceValHash(Hash[table]);
        this.$nextTick(() => {
          this.$refs.mapbox.map && this.$refs.mapbox._switchPolymerization();
        });
      },
      deep: true
    }
  },
  created() {
    const { mode, table } = this.$params;
    this.tableParam = { mode, table };
  },
  methods: {
    ...mapMutations(["updateSpaceValHash"]),
    kgChange(e) {
      this.shallKg = !this.shallKg;
      this.$nextTick(() => {
        this.$refs.mapbox._kgControll(this.shallKg);
      });
    }
  }
};
</script>

<style lang="less">
@import url("../components/PolymerizationMapbox/PolymerizationMapbox.less");
</style>