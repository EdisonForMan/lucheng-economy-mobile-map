<template>
  <div class="home">
    <header class="header">
      <i class="iconfont icon-fanhui" @click="$util.goBack"></i>
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
            @click="$refs.arcgis.switchStyle(styleTip,item)"
          >
            <a href="javascript:;">{{item}}</a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
      <a-button class="clearLayer" @click="$refs.arcgis.clearLayer()">清除图层</a-button>
    </header>
    <div class="container">
      <Arcgis ref="arcgis" />
      <div class="spin" v-if="mask">
        <a-spin>
          <a-icon slot="indicator" type="loading" style="font-size: 40px" spin />
        </a-spin>
      </div>
    </div>
    <footer>
      <ul>
        <li
          v-for="(item,key,index) in aroundTip"
          :key="index"
          @click="$refs.arcgis._switchAround(item.val)"
        >
          <img :src="require(`@/assets/image/icon/${key}.png`)" />
          <!-- <p :class="`iconfont icon-${item.icon}`" /> -->
          <p>{{key}}</p>
        </li>
      </ul>
    </footer>
  </div>
</template>

<script>
/* eslint-disable */
import Arcgis from "@/components/Around/Arcgis";
import { styleHash } from "@/components/common/tableHash";
import { mapState } from "vuex";
export default {
  name: "home",
  components: { Arcgis },
  data() {
    return {
      styleTip: ["简约风", "大数据", "行政区划", "影像图"],
      aroundTip: {
        娱乐健身: { val: 1, icon: "yulejianshen" },
        便利店: { val: 2, icon: "bianlidian" },
        餐饮: { val: 3, icon: "canyin" },
        宾馆酒店: { val: 4, icon: "binguanjiudian" },
        公交站: { val: 5, icon: "gongjiaochezhan" },
        停车场: { val: 6, icon: "tingchechang" },
        银行: { val: 7, icon: "yinhang" },
        购物百货: { val: 8, icon: "baihuo" },
        房产小区: { val: 9, icon: "fangchanxiaoqu" },
        大楼大厦: { val: 10, icon: "daloudasha" },
        医院: { val: 11, icon: "yiyuan1" },
        学校: { val: 12, icon: "xuexiao" },
        加油站: { val: 13, icon: "jiayouzhanzulin01" },
        公园广场: { val: 14, icon: "gongyuan" }
      },
      mask: false
    };
  },
  computed: {
    ...mapState({
      loading: state => state.loading
    })
  },
  watch: {
    loading(val) {
      this.mask = val;
    }
  }
};
</script>

<style scoped lang="less">
.home {
  height: 100%;
  display: flex;
  flex-direction: column;
  footer {
    width: 100%;
    display: flex;
    overflow-y: hidden;
    overflow-x: auto;
    height: 62px;
    white-space: nowrap;
    ul {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      background: #fff;
      li {
        cursor: pointer;
        margin: 0px 4px;
        width: 60px;
        box-sizing: border-box;
        padding-top: 6px;
        color: #394061;
        text-align: center;
        .iconfont {
          margin: 0;
          line-height: 30px;
        }
        .iconfont:before {
          font-size: 24px;
        }
        img {
          height: 32px;
          width: 32px;
          margin: 0px;
          display: inline-block;
        }
        p {
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(57, 64, 97, 1);
        }
      }
    }
  }
}
</style>