import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from './App.vue'
import Landing from './views/Landing.vue'
import SearchResults from './views/SearchResults.vue'
import SearchDetail from './views/SearchDetail.vue'
import Timeline from './views/Timeline.vue'
import './style.css'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/landing', component: Landing },
  { path: '/search', component: SearchResults },
  { path: '/dashboard/:id?', component: SearchDetail, name: 'SearchDetail' },
  { path: '/timeline', component: Timeline, name: 'Timeline' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // If user navigated with back/forward buttons, use saved position
    if (savedPosition) {
      return savedPosition
    }

    // For routes that use SearchLayout (search results and search detail),
    // preserve scroll position to maintain conversation panel state
    const isFromSearchLayout =
      from.path === '/search' ||
      from.path.startsWith('/dashboard/') ||
      from.path === '/timeline'
    const isToSearchLayout =
      to.path === '/search' ||
      to.path.startsWith('/dashboard/') ||
      to.path === '/timeline'

    if (isFromSearchLayout && isToSearchLayout) {
      // Preserve scroll position when navigating between SearchLayout routes
      return false
    }

    // For other navigations, scroll to top
    return { top: 0 }
  }
})

const pinia = createPinia()

createApp(App).use(pinia).use(router).mount('#app')
