import {createRouter, createWebHistory} from "vue-router"
import * as vueRouter from 'vue-router'
import { createApp } from "vue";

createApp(vueRouter);

const routes = [
   {
    path:'/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "Home" */ '../views/home.vue')
   }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;