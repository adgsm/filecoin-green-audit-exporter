import language from '@/src/mixins/i18n/language.js'
import api from '@/src/mixins/api/api.js'

import HorizontalDivider from '@/src/components/helpers/HorizontalDivider.vue'

import axios from 'axios'
import moment from 'moment'
import Papa from 'papaparse'

import Datepicker from '@vuepic/vue-datepicker'
import Button from 'primevue/button'
import MultiSelect from 'primevue/multiselect'

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
	async storageProvider(state, before) {
		this.spaces = (await this.getSpaces(state)).data
			.filter((s) => {return s.Space != 'Data center installation'})
		for await(const space of this.spaces) {
			this.hardware[space.Space] = (await this.getSpaceHardware(state, space.Space)).data
		}

		this.extractMiners()
	}
}

const mounted = async function() {
	this.dates = [
		moment().add((-1)*(this.history+1), 'day').toDate(),
		moment().add(-1, 'day').toDate()
	]
}

const methods = {
	async getSolarPannelsPower() {
		const sources = 'Solar pannels'
		const locatTZOffset = new Date().getTimezoneOffset()
		const from = moment(this.dates[0]).add((-1) * locatTZOffset, 'minutes').add((-1) * this.storageProviterTimeZoneOffset, 'minutes').toISOString()
		const to = moment(this.dates[1]).add((-1) * locatTZOffset, 'minutes').add((-1) * this.storageProviterTimeZoneOffset, 'minutes').toISOString()

		this.$emit('loading', true)

		const solarPannelsPower = await this.getData('power', this.storageProvider, sources, null, null, null, null, from, to)

		const solarPannelsPowerHeader = ['"Name"', '"Time"', '"Power [W]"']
		const solarPannelsPowerColumnTypes = ["string", "string", "number"]

		let result = solarPannelsPowerHeader.join(",") + "\r\n" +
			Papa.unparse(solarPannelsPower.map((spp) => {return [spp.Name, spp.Time, spp.Power]}), {
				quotes: solarPannelsPowerColumnTypes.map((ct) => {return ct != 'number'}),
				quoteChar: '"',
				escapeChar: '"',
				delimiter: ",",
				header: false,
				newline: "\r\n",
				skipEmptyLines: false,
				columns: null
			})

		this.$emit('loading', false)

		const blob = new Blob([result], { type: 'text/csv' })
		const link = document.createElement('a')
		link.href = URL.createObjectURL(blob)
		link.download = `Solar pannels power generation - from ${from} to ${to}.csv`
		link.click()
		URL.revokeObjectURL(link.href)
	},
	async getGridEnergyConsumption() {
		const sources = 'Power grid plug'
		const locatTZOffset = new Date().getTimezoneOffset()
		const from = moment(this.dates[0]).add((-1) * locatTZOffset, 'minutes').add((-1) * this.storageProviterTimeZoneOffset, 'minutes').toISOString()
		const to = moment(this.dates[1]).add((-1) * locatTZOffset, 'minutes').add((-1) * this.storageProviterTimeZoneOffset, 'minutes').toISOString()

		this.$emit('loading', true)

		const gridEnergyConsumption = await this.getData('energy', this.storageProvider, sources, null, null, null, null, from, to)

		const gridEnergyConsumptionHeader = ['"Name"', '"Time"', '"Energy [Wh]"']
		const gridEnergyConsumptionColumnTypes = ["string", "string", "number"]

		let result = gridEnergyConsumptionHeader.join(",") + "\r\n" +
			Papa.unparse(gridEnergyConsumption.map((spp) => {return [spp.Name, spp.Time, spp.Energy]}), {
				quotes: gridEnergyConsumptionColumnTypes.map((ct) => {return ct != 'number'}),
				quoteChar: '"',
				escapeChar: '"',
				delimiter: ",",
				header: false,
				newline: "\r\n",
				skipEmptyLines: false,
				columns: null
			})

		this.$emit('loading', false)

		const blob = new Blob([result], { type: 'text/csv' })
		const link = document.createElement('a')
		link.href = URL.createObjectURL(blob)
		link.download = `Grid energy consumption - from ${from} to ${to}.csv`
		link.click()
		URL.revokeObjectURL(link.href)
	},
	getDataChunk(endPoint, storageProvider, names, locations, miners, racks, functions, from, to, offset, limit) {
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
	async getData(endPoint, storageProvider, names, locations, miners, racks, functions, from, to) {
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
			const chunk = await this.getDataChunk(endPoint, storageProvider, names, locations, miners,
				racks, functions, from, to, offset, this.maxResults)
			offset += this.maxResults
			chunkData = chunk.data
			data = data.concat(chunkData)
			br = this.maxResults > chunkData.length
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
	},
	getSpaces(storageProvider) {
		if(storageProvider == undefined)
			return
		const self = this,
			getUri = this.apiProtocol + this.apiHost + ':' +
				this.apiAuthServerPort + this.apiPath + '/list-spaces?storage_provider_id=' +
					storageProvider
		return axios(getUri, {
			method: 'get'
		})
	},
	getSpaceHardware(storageProvider, space) {
		if(storageProvider == undefined || space == undefined)
			return
		const self = this,
			getUri = this.apiProtocol + this.apiHost + ':' +
				this.apiAuthServerPort + this.apiPath + '/list-space-hardware?storage_provider_id=' +
					storageProvider + '&space=' + space
		return axios(getUri, {
			method: 'get'
		})
	},
	extractMiners() {
		this.miners.length = 0
		const hardware = Object.keys(this.hardware)
		for (const hw of hardware) {
			for (const rackhw of this.hardware[hw]) {
				if(this.miners.indexOf(rackhw.MinerId) == -1 && rackhw.MinerId.indexOf('f') == 0)
					this.miners.push(rackhw.MinerId)
			}
		}

		this.selectedMiners = this.miners.map((m) => m)
		this.minersListReady = true
	},
	filecoinEnergyModelData(miner, dataType, start, end, filter) {
		if(miner == undefined || dataType == undefined || start == undefined || end == undefined)
			return null
		const getUri = 'https://api.filecoin.energy:443/models/model?code_name=' + dataType +
			'&miner=' + miner +
			'&start=' + start +
			'&end=' + end +
			'&filter=' + ((filter != undefined) ? filter : 'day')
		return axios(getUri, {
			method: 'get'
		})
	},
	async dataFromModel(dataType, start, end, miner, filter){
		let dataPoints = []
		let merr = true
		while(merr) {
			try {
				dataPoints = (await this.filecoinEnergyModelData(miner, dataType, start, end, filter)).data.data
				merr = null
			} catch (error) {
				merr = error
			}
		}
	
		return dataPoints
	},
	async minersDataFromModel(model, title) {
		this.$emit('loading', true)

		const locatTZOffset = new Date().getTimezoneOffset()
		const from = moment(this.dates[0]).add((-1) * locatTZOffset, 'minutes').add((-1) * this.storageProviterTimeZoneOffset, 'minutes').format('YYYY-MM-DD')
		const to = moment(this.dates[1]).add((-1) * locatTZOffset, 'minutes').add((-1) * this.storageProviterTimeZoneOffset, 'minutes').format('YYYY-MM-DD')

		let data = []

		for await(const miner of this.selectedMiners) {
			const response = (await this.dataFromModel(model, from, to, miner, 'day'))
			const lower = response[0]
			const estimate = response[1]
			const upper = response[2]

			for (let index = 0; index < lower.data.length; index++) {
				const lowerDataItem = lower.data[index]
				const estimateDataItem = estimate.data[index]
				const upperDataItem = upper.data[index]

				data.push([miner, lower.title, lowerDataItem.value, estimate.title, estimateDataItem.value, upper.title, upperDataItem.value, lowerDataItem.start_date, lowerDataItem.end_date])
			}
		}

		const dataHeader = ['"Storage provider"', '"Bound/Estimate"', '"Energy [kWh]"', '"Bound/Estimate"', '"Energy [kWh]"', '"Bound/Estimate"', '"Energy [kWh]"', '"Start date"', '"End date"']
		const dataColumnTypes = ["string", "string", "number", "string", "number", "string", "number", "string", "string"]

		let result = dataHeader.join(",") + "\r\n" +
			Papa.unparse(data, {
				quotes: dataColumnTypes.map((ct) => {return ct != 'number'}),
				quoteChar: '"',
				escapeChar: '"',
				delimiter: ",",
				header: false,
				newline: "\r\n",
				skipEmptyLines: false,
				columns: null
			})

		this.$emit('loading', false)

		const blob = new Blob([result], { type: 'text/csv' })
		const link = document.createElement('a')
		link.href = URL.createObjectURL(blob)
		link.download = `${title} - Storage Providers ${this.selectedMiners.join(" ")} - from ${from} to ${to}.csv`
		link.click()
		URL.revokeObjectURL(link.href)
	}
}

const destroyed = function() {
}

export default {
	props: [
		'storageProvider',
		'storageProviterTimeZoneOffset'
	],
	mixins: [
		language,
		api
	],
	components: {
		HorizontalDivider,
		Datepicker,
		Button,
		MultiSelect
	},
	directives: {
	},
	name: 'Exporter',
	data () {
		return {
			maxResults: 1000,
			exporter: {},
			dates: [],
			history: 7,
			hardware: {},
			miners: [],
			selectedMiners: [],
			minersListReady: false
		}
	},
	created: created,
	computed: computed,
	watch: watch,
	mounted: mounted,
	methods: methods,
	destroyed: destroyed
}
