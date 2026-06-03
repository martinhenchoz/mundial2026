import { createRouter, createWebHistory } from 'vue-router'
export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('../views/DashboardView.vue') },
    { path: '/grupos', component: () => import('../views/GroupsView.vue') },
    { path: '/cruces', component: () => import('../views/KnockoutView.vue') },
    { path: '/estadisticas', component: () => import('../views/StatsView.vue') },
    { path: '/agenda', component: () => import('../views/AgendaView.vue') },
  ],
})
