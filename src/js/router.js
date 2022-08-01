import { createApp } from 'vue/dist/vue.esm-bundler'
import { createWebHistory, createRouter } from 'vue-router'
import { createI18n } from 'vue-i18n/dist/vue-i18n.esm-browser.prod'
import { createStore  } from 'vuex'

import Locale_en_GB from '@/src/locales/en_GB.js'
import AuditStore from '@/src/stores/audit.js'

import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'

const store = createStore({
	modules: {
		audit: AuditStore
	}
});

const messages = {
	'en_GB': Locale_en_GB
}

const i18n = createI18n({
	locale: 'en_GB',
	fallbackLocale: 'en_GB',
	messages
})

const Audit = () => import('@/src/components/Audit.vue')

const routes = [
	{
		path: '/audit',
		name: 'audit',
		title: 'Audit',
		component: Audit,
		children: [
			{
				path: ':lang',
				component: Audit
			}
		]
	}
];

const router = createRouter({
	history: createWebHistory(),
	routes
})

const routerApp = createApp(router)
routerApp.use(router)
routerApp.use(i18n)
routerApp.use(store)
routerApp.use(PrimeVue, {ripple: true})
routerApp.use(ConfirmationService)
routerApp.use(ToastService)
routerApp.mount('#router_app')
