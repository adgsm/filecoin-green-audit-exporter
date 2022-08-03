const computed = {
	horizontalDividerClass() {
		return this.theme + '-horizontal-divider-' + this.themeVariety
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

export default {
	name: 'HorizontalDivider',
	data () {
		return {
		}
	},
	computed: computed
}
