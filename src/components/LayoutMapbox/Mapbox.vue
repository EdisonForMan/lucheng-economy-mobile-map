<template>
  <div id="mapbox"></div>
</template>

<script>
/* eslint-disable */
import { mapState, mapMutations, mapActions } from "vuex";
import { CYBJ } from "@/components/common/config";
import { sources } from "./sources";
import { initTool } from "./tools";
import rootMapBox from "@/components/common/extendMapbox/rootMapbox";

export default {
  mixins: [rootMapBox],
  name: "layout_mapbox",
  computed: {
    ...mapState({
      areas: state => state.areas,
      zones: state => state.zones,
      zonePolygon: state => state.zonePolygon
    })
  },
  async mounted() {
    await this.fetchLocatedSpace({ url: `${CYBJ}/0` });
    await this.fetchLocatedZones({ url: `${CYBJ}/2` });
    await this.fetchLocatedZonePolygon({
      url: `${CYBJ}/5`,
      where: "OBJECTID = 13"
    });
    await this.initRoot();
    await sources(this);
    await initTool(this);
  },
  methods: {
    ...mapActions([
      "fetchLocatedSpace",
      "fetchLocatedZones",
      "fetchLocatedZonePolygon"
    ]),
    /**
     * 一带八区开关
     */
    changeAreas(tag) {
      mapboxChangeAreas(this, tag);
    },
    /**
     * 热力图类型切换
     */
    async changeHeat(type, tag = true) {
      this.updateLoading(true);
      await mapboxChangeHeat(this, type, tag);
      this.updateLoading(false);
    },
    /**
     * 3d切换
     */
    changePitch(_3d) {
      this.map.flyTo({
        center: this.map.getCenter(),
        zoom: this.map.getZoom(),
        speed: 0.2,
        pitch: this.map.getPitch() ? 0 : 60
      });
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