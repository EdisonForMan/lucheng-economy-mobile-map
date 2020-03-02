import Vue from "vue";
import VueRouter from "vue-router";
import AroundMapbox from "../views/AroundMapbox.vue";
import LayoutMapbox from "../views/LayoutMapbox.vue";
import PolymerizationMapbox from "../views/PolymerizationMapbox.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "around",
    component: AroundMapbox
  },
  {
    path: "/layout",
    name: "layoutMapbox",
    component: LayoutMapbox
  },
  {
    path: "/polymerization",
    name: "polymerization",
    component: PolymerizationMapbox
  }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});

export default router;
