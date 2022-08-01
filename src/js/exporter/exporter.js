import language from '@/src/mixins/i18n/language.js'

import api from '@/src/mixins/api/api.js'

import axios from 'axios'
import moment from 'moment'

import Button from 'primevue/button'

import Datepicker from '@vuepic/vue-datepicker'

const created = function() {
	const that = this
	
	// set language
	this.setLanguage(this.$route)
}

const computed = {
	exporterClass() {
		return this.theme + '-exporter-' + this.themeVariety
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
	async storageProvider() {
		await this.getPowerGenerationEnergyConsumptionData()
	}
}

const mounted = async function() {
	this.dates = [
		moment().add((-1)*(this.history+1), 'day').toDate(),
		moment().add(-1, 'day').toDate()
	]
}

const methods = {
	async getPowerGenerationEnergyConsumptionData() {
		const powerNames = 'Solar pannels'
		const energyNames = 'Power grid plug'
		const from = this.dates[0].toISOString()
		const to = this.dates[1].toISOString()

		this.$emit('loading', true)

		const apiPowerData = await this.getChartData('power', this.storageProvider, powerNames, null, null, null, null, from, to)
		const powerData = apiPowerData.map((s) => {
			return [new Date(s.Time), s.Power]
		})

		const apiEnergyData = await this.getChartData('energy', this.storageProvider, energyNames, null, null, null, null, from, to)
		const energyData = apiEnergyData.map((s) => {
			return [new Date(s.Time), s.Energy]
		})


		this.$emit('loading', false)
	},
	getChartDataChunk(endPoint, storageProvider, names, locations, miners, racks, functions, from, to, offset, limit) {
		if(endPoint == undefined || storageProvider == undefined || from == undefined || to == undefined)
			return
		if(names == undefined)
			names = ''
		if(locations == undefined)
			locations = ''
		if(miners == undefined)
			miners = ''
		if(racks == undefined)
			racks = ''
		if(functions == undefined)
			functions = ''
		if(offset == undefined)
			offset = 0
		if(limit == undefined)
			limit = this.maxResults
		const self = this,
			getUri = this.apiProtocol + this.apiHost + ':' +
				this.apiAuthServerPort + this.apiPath + '/' + endPoint + '?storage_provider_id=' + storageProvider +
					'&names=' + names + '&locations=' + locations + '&miners=' + miners +
					'&racks=' + racks + '&functions=' + functions + '&from=' + from + '&to=' + to +
					'&offset=' + offset + '&limit=' + limit

		return axios(getUri, {
			method: 'get'
		})
	},
	async getChartData(endPoint, storageProvider, names, locations, miners, racks, functions, from, to) {
		if(endPoint == undefined || storageProvider == undefined || from == undefined || to == undefined)
			return

		if(names == undefined)
			names = ''
		if(locations == undefined)
			locations = ''
		if(miners == undefined)
			miners = ''
		if(racks == undefined)
			racks = ''
		if(functions == undefined)
			functions = ''

		let offset = 0
		let data = []
		let chunkData = []
		let br = false
		do {
			const chunk = await this.getChartDataChunk(endPoint, storageProvider, names, locations, miners,
				racks, functions, from, to, offset, this.maxResults)
			offset += this.maxResults
			chunkData = chunk.data
			data = data.concat(chunkData)
			br = offset > chunkData.length
		} while (chunkData.length && !br)

		return data
	},
	async datesChanged(dates) {
		if(dates == null)
			return
		const back = [this.dates[0], this.dates[1]]
		if(dates[0] == null || dates[1] == null) {
			this.dates = back
			return
		}

		await this.getPowerGenerationEnergyConsumptionData()
	}
}

const destroyed = function() {
}

export default {
	props: [
		'storageProvider'
	],
	mixins: [
		language,
		api
	],
	components: {
		Datepicker,
		Button
	},
	directives: {
	},
	name: 'Exporter',
	data () {
		return {
			maxResults: 1000000,
			exporter: {},
			dates: [],
			history: 7
		}
	},
	created: created,
	computed: computed,
	watch: watch,
	mounted: mounted,
	methods: methods,
	destroyed: destroyed
}
