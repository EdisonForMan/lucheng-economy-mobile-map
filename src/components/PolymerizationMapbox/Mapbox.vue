<template>
  <div id="mapbox"></div>
</template>

<script>
/* eslint-disable */
import { mapState, mapMutations, mapActions } from "vuex";
import rootMapBox from "@/components/common/extendMapbox/rootMapbox";
import { fetchData, initClusterLayer } from "./tool";
import { kgControll } from "./kgController";
import { sources } from "./source";
export default {
  mixins: [rootMapBox],
  name: "around_mapbox",
  computed: {
    ...mapState({
      spaceValHash: state => state.spaceValHash,
      kg: state => state.kg
    })
  },
  async mounted() {
    await this.initRoot();
    await sources(this);
  },
  methods: {
    ...mapMutations(["updateLoading"]),
    ...mapActions(["fetchKg"]),
    _switchStyle(val) {
      this.$tools.switchMapboxStyle(this.map, val);
    },
    async _switchPolymerization() {
      await fetchData(this);
    },
    _kgControll(val) {
      kgControll(this, val);
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