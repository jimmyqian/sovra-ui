import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Landing from './views/Landing.vue'
import SearchResults from './views/SearchResults.vue'
import './style.css'

const routes = [
  { path: '/', component: Landing },
  { path: '/search', component: SearchResults }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

createApp(App).use(router).mount('#app')