<template>
  <div class="home">
    <header class="header">
      <i class="iconfont iconfanhui" @click="$util.goBack" />
      周边分析
      <a-dropdown class="noFloat mapStyle">
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
      <!-- <a-button class="clearLayer">清除图层</a-button> -->
    </header>
    <div class="container">
      <Mapbox ref="mapbox" :aroundType="aroundType" />
      <a-tooltip placement="topLeft">
        <template slot="title">本系统数据仅供参考，欢迎社会各界人士监督，监督电话：0577-88338620.感谢您的参与和支持！</template>
        <i class="iconfont icontishi" />
      </a-tooltip>
      <i class="iconfont iconshanchu" @click="$refs.mapbox._clearLayer()" />
      <div class="spin" v-if="mask">
        <a-spin>
          <a-icon slot="indicator" type="loading" style="font-size: 40px" spin />
        </a-spin>
      </div>
    </div>
    <footer>
      <ul>
        <li
          :class="{active:aroundType == item.val}"
          v-for="(item,key,index) in aroundTip"
          :key="index"
          @click="switchAround(item.val)"
        >
          <img :src="require(`@/assets/image/icon/${key}.png`)" />
          <p>{{key}}</p>
        </li>
      </ul>
    </footer>
  </div>
</template>

<script>
/* eslint-disable */
import Mapbox from "@/components/AroundMapbox/Mapbox";
import { styleHash } from "@/components/common/tableHash";
import { mapState } from "vuex";
import { styleTip, aroundTip } from "@/components/common/enum";
export default {
  name: "home",
  components: { Mapbox },
  data() {
    return {
      styleTip,
      aroundTip,
      aroundType: 0,
      mask: false
    };
  },
  computed: {
    ...mapState({
      loading: state => state.loading
    })
  },
  methods: {
    switchAround(val) {
      this.aroundType = val;
      this.$nextTick(() => {
        this.$refs.mapbox._switchAround();
      });
    }
  },
  watch: {
    loading(val) {
      this.mask = val;
    }
  }
};
</script>

<style scoped lang="less">
@import url("../components/AroundMapbox/AroundMapbox.less");
</style>