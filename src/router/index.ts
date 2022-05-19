import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'
import Home from '../views/Home.vue'
import {Nav} from "@/components/SideBar/SideBar.vue";

const sideBarNav: Nav[] = [
    {
        label: '介绍',
        icon: 'home',
        link: '/description'
    },
    {
        label: '游戏',
        link: '/game',
        icon: 'game'
        // children: [
        //     {
        //         label: '选项1',
        //         link: '/main/game'
        //     },
        //     {
        //         label: '选项2',
        //     }
        // ]
    },
    {
        label: '武器',
        icon: 'weapon',
        link: '/weapon'
        // children: [
        //     {
        //         label: '选项1',
        //         children: [
        //             {
        //                 label: '选项1-1',
        //                 link: '/main/about',
        //             },
        //             {
        //                 label: '选项1-2',
        //             }]
        //     },
        //     {
        //         label: '选项2',
        //     }
        // ]
    }]

const routes: Array<RouteRecordRaw> = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/Register.vue')
    },
    {
        path: '/',
        name: 'MainView',
        props: {
            nav: sideBarNav
        },
        component: () => import('../views/MainView.vue'),
        children: [
            {
                path: '/description',
                name: 'Description',
                component: () => import('../views/Description.vue')
            },
            {
                path: '/game',
                name: 'Game',
                component: () => import('../views/Game.vue')
            },
            {
                path: '/weapon',
                name: 'Weapon',
                component: () => import('../views/Weapon.vue')
            },
            // {
            //     path: 'about',
            //     name: 'About',
            //     component: () => import('../views/About.vue')
            // },
        ]
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
