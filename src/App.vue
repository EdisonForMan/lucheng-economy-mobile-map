<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
/* eslint-disable */
import { mapMutations } from "vuex";
import { Hash } from "@/components/common/tableHash";
export default {
  name: "app",
  created() {
    const { table } = this.$params;
    this.updateSpaceValHash(Hash[table]);
  },
  methods: {
    ...mapMutations(["updateSpaceValHash"])
  }
};
</script>
<style lang="less">
@import url("./assets/css/common.less");
</style>
