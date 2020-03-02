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
            @click="$refs.arcgis.switchStyle(styleTip,item)"
          >
            <a href="javascript:;">{{item}}</a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
      <pick-tree ref="pick_tree" />
      <Arcgis ref="arcgis" />
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
import PickTree from "@/components/Polymerization/PickTree";
import Arcgis from "@/components/Polymerization/Arcgis";
import { mapState, mapMutations } from "vuex";
import { Hash } from "@/components/common/tableHash";
export default {
  name: "polymerization",
  components: { PickTree, Arcgis },
  data() {
    return {
      styleTip: ["简约风", "大数据", "行政区划", "影像图"],
      tableParam: {
        mode: null,
        table: null
      },
      mask: false,
      shallKg: false,
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
          this.$refs.arcgis.vueArcGisApi.SimpleMarkerSymbol &&
            this.$refs.arcgis.getGraphicsPointDataInit();
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
        this.$refs.arcgis.kgControll(this.shallKg);
      });
    }
  }
};
</script>

<style lang="less">
.polymerization {
  height: 100%;
  display: flex;
  flex-direction: column;
  .container {
    position: relative;
    .pick_btn {
      position: absolute;
      top: 10px;
      left: 10px;
      z-index: 1;
    }
    .kg_btn {
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 1;
    }
    .style_btn {
      position: absolute;
      top: 50px;
      right: 10px;
      z-index: 1;
      padding: 6px 10px;
      border-radius: 4px;
      background-color: #3b83ee;
      border-color: #3b83ee;
      color: #fff;
    }
  }
}
</style>