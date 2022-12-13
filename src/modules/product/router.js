const routeModule = {
  path: "/products",
  component: () => import(/* webpackChunkName: "products" */ "./module.vue"),
  children: [
    {
      path: "",
      name: "products.index",
      component: () =>
        import(/* webpackChunkName: "products index" */ "./view/home.vue"),
    },
    {
      path: "/detail",
      name: "products.detail",
      component: () =>
        import(/* webpackChunkName: "products detail" */ "./view/product.vue"),
    },
  ],
};

export default (router) => {
  router.addRoute(routeModule);
};
