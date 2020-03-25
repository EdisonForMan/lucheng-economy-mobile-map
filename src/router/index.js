import Vue from "vue";
import VueRouter from "vue-router";
import LayoutMapbox from "../views/LayoutMapbox.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "layoutMapbox",
    component: LayoutMapbox
  }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});

export default router;
