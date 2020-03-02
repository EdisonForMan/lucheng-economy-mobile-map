<template>
  <div class="heatImg">
    <div class="heatImg_title">{{title}}</div>
    <swiper :options="swiperOption" ref="mySwiper">
      <swiper-slide v-for="(item,index) in imgs" :key="index">
        <img :src="item" />
      </swiper-slide>
      <div class="swiper-button-prev" slot="button-prev"></div>
      <div class="swiper-button-next" slot="button-next"></div>
    </swiper>
  </div>
</template>

<script>
/* eslint-disable */
import { imgArr } from "./treeHash";
export default {
  name: "heatImg",
  data() {
    return {
      imgs: [],
      title: "一带八区",
      swiperOption: {
        slidesPerView: 1,
        spaceBetween: 10,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        },
        direction: "vertical"
      }
    };
  },
  props: ["heat_tip"],
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
  },
  created() {
    this.imgs = imgArr.map(item => {
      return require(`@/assets/image/${item.split("*")[0]}.png`);
    });
  },
  mounted() {
    this.swiper.on("transitionEnd", e => {
      let index = this.swiper.snapIndex;
      this.title = imgArr[index].split("*")[1];
    });
  },
  watch: {
    heat_tip(val) {
      const index = imgArr
        .map(item => {
          return item.split("*")[0];
        })
        .indexOf(val);
      this.swiper.slideTo(index, 800, false);
      this.title = imgArr[index].split("*")[1];
    }
  }
};
</script>

<style lang="less">
.heatImg {
  height: 100%;
  width: 100%;
  overflow: auto;
  .heatImg_title {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 2;
    font-size: 16px;
    background-color: rgba(255, 255, 255, 0.8);
    font-weight: 700;
    padding: 0px 10px;
    line-height: 40px;
    border-radius: 4px;
    // transform: translate(50%, -50%) rotate(90deg);
  }
  img {
    height: 100%;
    // width: 100%;
  }
  .swiper-container {
    height: 100%;
    overflow: auto;
    .swiper-button-prev {
      position: fixed;
      top: unset;
      left: unset;
      bottom: 50% !important;
      right: 30px;
      -webkit-transform: rotate(90deg);
      transform: translateY(-50px) rotate(90deg)!important;
    }
    .swiper-button-next {
      position: fixed;
      top: unset;
      left: unset;
      bottom: 50% !important;
      right: 30px;
      transform: rotate(90deg);
    }
  }
}
</style>