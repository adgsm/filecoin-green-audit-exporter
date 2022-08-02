import language from '@/src/mixins/i18n/language.js'

import ProgressSpinner from 'primevue/progressspinner'

import StorageProviders from '@/src/components/storage-providers/StorageProviders.vue'
import Exporter from '@/src/components/exporter/Exporter.vue'
import Footer from '@/src/components/footer/Footer.vue'

const created = function() {
	const that = this
	
	// set language
	this.setLanguage(this.$route)
}

const computed = {
	auditClass() {
		return this.theme + '-audit-' + this.themeVariety
	},
	locale() {
		return this.$store.getters['audit/getLocale']
	},
	theme() {
		return this.$store.getters['audit/getTheme']
	},
	themeVariety() {
		return this.$store.getters['audit/getThemeVariety']
	}
}

const watch = {
}

const mounted = async function() {
}

const methods = {
}

const destroyed = function() {
}

export default {
	mixins: [
		language
	],
	components: {
		ProgressSpinner,
		StorageProviders,
		Exporter,
		Footer
	},
	directives: {
	},
	name: 'Audit',
	data () {
		return {
			loading: false,
			storageProvider: null,
			storageProviterTimeZoneOffset: 0
		}
	},
	created: created,
	computed: computed,
	watch: watch,
	mounted: mounted,
	methods: methods,
	destroyed: destroyed
}
