// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Lobby from '../views/Lobby.vue'
import Game from '../views/Game.vue'


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/lobby/:id',
    name: 'Lobby',
    component: Lobby,
    props: (route) => ({roomCode: String(route.params.id), userName: route.query.name})
  },
  {
    path: '/game/:id',
    name: 'Game',
    component: Game,
    props: (route) => ({roomCode: String(route.params.id), userName: route.query.name})
  }
 
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
