import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'
import Home from '../views/Home.vue'
import {Nav} from "@/components/SideBar/SideBar.vue";

const sideBarNav: Nav[] = [
    {
        label: '主页',
        icon: 'home'
    },
    {
        label: '选项',
        children: [
            {
                label: '选项1',
                link: '/main/game'
            },
            {
                label: '选项2',
            }
        ]
    },
    {
        label: '选项',
        children: [
            {
                label: '选项1',
                children: [
                    {
                        label: '选项1-1',
                        link: '/main/about',
                    },
                    {
                        label: '选项1-2',
                    }]
            },
            {
                label: '选项2',
            }
        ]
    }]

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/main',
        name: 'MainView',
        props: {
            nav: sideBarNav
        },
        component: () => import('../views/MainView.vue'),
        children: [
            {
                path: 'game',
                name: 'Game',
                component: () => import('../views/Game.vue')
            },
            {
                path: 'about',
                name: 'About',
                component: () => import('../views/About.vue')
            },
        ]
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
