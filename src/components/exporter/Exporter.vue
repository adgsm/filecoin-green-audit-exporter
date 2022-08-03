<template>
	<section :class="exporterClass">
		<div class="header">
			<div class="calendar">
				<Datepicker v-model="dates" range
					@update:modelValue="datesChanged" />
			</div>
			<div class="row align-width">
				<horizontal-divider>
					{{ $t('message.exporter.data-center-related') }}
				</horizontal-divider>
			</div>
			<div class="row">
				<div class="txt">
					{{ $t('message.exporter.get-solar-pannels-power') }}
				</div>
				<div class="btn">
					<Button :label="$t('message.exporter.download')" class="p-button-sm p-button p-component p-button-raised" icon="pi pi-cloud-download"
						@click="getSolarPannelsPower" />
				</div>
			</div>
			<div class="row">
				<div class="txt">
					{{ $t('message.exporter.get-grid-energy-consumption') }}
				</div>
				<div class="btn">
					<Button :label="$t('message.exporter.download')" class="p-button-sm p-button p-component p-button-raised" icon="pi pi-cloud-download"
						@click="getGridEnergyConsumption" />
				</div>
			</div>
			<div class="row align-width"
				v-show="minersListReady">
				<horizontal-divider>
					{{ $t('message.exporter.miners-related') }}
				</horizontal-divider>
			</div>
			<div class="row align-width"
				v-show="minersListReady">
				<MultiSelect v-model="selectedMiners" :options="miners" :placeholder="$t('message.exporter.select-miners')" display="chip"/>
			</div>
			<div class="row"
				v-show="minersListReady">
				<div class="txt">
					{{ $t('message.exporter.get-total-energy') }}
				</div>
				<div class="btn">
					<Button :label="$t('message.exporter.download')" class="p-button-sm p-button p-component p-button-raised" icon="pi pi-cloud-download"
						@click="minersDataFromModel('TotalEnergyModelv_1_0_1', $t('message.exporter.get-total-energy'))" />
				</div>
			</div>
			<div class="row"
				v-show="minersListReady">
				<div class="txt">
					{{ $t('message.exporter.get-sealing-energy') }}
				</div>
				<div class="btn">
					<Button :label="$t('message.exporter.download')" class="p-button-sm p-button p-component p-button-raised" icon="pi pi-cloud-download"
						@click="minersDataFromModel('SealingEnergyModelv_1_0_1',  $t('message.exporter.get-sealing-energy'))" />
				</div>
			</div>
			<div class="row"
				v-show="minersListReady">
				<div class="txt">
					{{ $t('message.exporter.get-storing-energy') }}
				</div>
				<div class="btn">
					<Button :label="$t('message.exporter.download')" class="p-button-sm p-button p-component p-button-raised" icon="pi pi-cloud-download"
						@click="minersDataFromModel('StorageEnergyModelv_1_0_1', $t('message.exporter.get-storing-energy'))" />
				</div>
			</div>
		</div>
	</section>
</template>

<script src="@/src/js/exporter/exporter.js" scoped />
<style src="@/src/scss/exporter/exporter.scss" lang="scss" scoped />
