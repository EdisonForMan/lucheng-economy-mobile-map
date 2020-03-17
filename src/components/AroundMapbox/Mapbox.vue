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
      radius: state => state.radius,
      located: state => state.located,
      spaceValHash: state => state.spaceValHash
    })
  },
  async mounted() {
    await this.initRoot();
    // await sources(this);
    // this.$params && (await registeHit(this));
  },
  methods: {
    ...mapMutations(["updateLoading"]),
    _switchStyle(val) {
      this.$tools.switchMapboxStyle(this.map, val);
    },
    _clearLayer() {
      clearLayers(this);
    },
    _switchAround(val) {
      switchAround(this);
    }
  }
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