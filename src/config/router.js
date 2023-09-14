import { createRouter, createWebHistory } from "vue-router";
import store from './store/store'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			component: () => import('@/components/DoIndex'),
			name: 'index',
			redirect: '/vacancy',
			children: [
				{
					path: 'vacancy',
					component: () => import('@/components/vacancy/DoVacancyIndex'),
					name: 'vacancy',
					meta: { requiresAuth: true },
					children: [
						{
							path: ':idVacancy',
							component: () => import('@/components/vacancy/DoVacancyPage'),
							name: 'vacancyPage'
						},
						{
							path: 'add',
							component: () => import('@/components/vacancy/DoVacancyAdd'),
							name: 'vacancyAdd'
						},
						{
							path: 'edit/:idVacancy',
							component: () => import('@/components/vacancy/DoVacancyAdd'),
							name: 'vacancyEdit'
						},
					]
				},
				{
					path: 'summary',
					component: () => import('@/components/summary/DoSummaryIndex'),
					name: 'summary',
					meta: { requiresAuth: true },
					children: [
						{
							path: ':idSummary',
							component: () => import('@/components/summary/DoSummaryPage'),
							name: 'summaryPage'
						},
						{
							path: 'add',
							component: () => import('@/components/summary/DoSummaryAdd'),
							name: 'summaryAdd'
						},
						{
							path: 'edit/:idSummary',
							component: () => import('@/components/summary/DoSummaryAdd'),
							name: 'summaryEdit'
						},
					]
				},
				{
					path: 'response',
					component: () => import('@/components/response/DoResponseIndex'),
					name: 'response',
					meta: { requiresAuth: true },
				},
				{
					path: 'account',
					component: () => import('@/components/account/DoAccountIndex'),
					name: 'account',
					meta: { requiresAuth: true },
				},
			]
		},
		{
			path: '/auth',
			component: () => import('@/components/auth/DoAuthIndex'),
			name: 'auth'
		}
	],
	scrollBehavior(to, from, savedPosition){
		if(savedPosition) return savedPosition
			else  return { top: 0 }
	}
})

router.beforeEach((to, from, next) => {
	if(!localStorage.token||!localStorage.user){
		if (to.matched.some(record => record.meta.requiresAuth)) {
			if(!store.getters.getAuth) {
				next({
					path: '/auth',
					query: {
						redirect: to.fullPath
					}
				})
			} else {
				next()
			}
		} else {
			next()
		}
	}
	next()
})
export default router
