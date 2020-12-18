<!--
 * @Author: eds
 * @Date: 2020-03-25 11:01:14
 * @LastEditTime: 2020-08-13 19:55:21
 * @LastEditors: eds
 * @Description: 
 * @FilePath: \lucheng-economy-mobile-map\src\components\AroundMapbox\Mapbox.vue
-->
<template>
  <div id="mapbox"></div>
</template>

<script>
/* eslint-disable */
import { mapState, mapMutations } from "vuex";
import { sources } from "./sources";
import rootMapBox from "@/components/common/extendMapbox/rootMapbox";
import { registeHit } from "./hit";
import { switchAround, clearLayers } from "./around"; 
export default {
  mixins: [rootMapBox],
  name: "around_mapbox",
  props: ["aroundType"],
  computed: {
    ...mapState({
      radius: (state) => state.radius,
      located: (state) => state.located,
      spaceValHash: (state) => state.spaceValHash,
    }),
  },
  async mounted() {
    await this.initRoot();
    await sources(this);
    this.$params && (await registeHit(this));
    this.exRegisteEvent();
  },
  methods: {
    ...mapMutations(["updateLoading"]),
    exRegisteEvent() {
      $("body").on("click", ".Amap_jump", function () {
        const name = $(this).attr("data-val");
        const url = `https://lysb.lucheng.gov.cn/Amap/Amap.html?name=${name}`;
        if (window.parent == window) {
          window.location.href = url;
        } else {
          window.parent.location.href = url;
        }
      });
    },
    _switchStyle(val) {
      this.$tools.switchMapboxStyle(this.map, val);
    },
    _clearLayer() {
      clearLayers(this);
    },
    _switchAround(val) {
      switchAround(this);
    },
  },
};
</script>

<style lang="less">
#mapbox {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
}
</style>