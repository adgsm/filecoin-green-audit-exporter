<template>
	<section :class="exporterClass">
		<div class="header">
			<div class="calendar">
				<Datepicker v-model="dates" range
					@update:modelValue="datesChanged" />
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
		</div>
	</section>
</template>

<script src="@/src/js/exporter/exporter.js" scoped />
<style src="@/src/scss/exporter/exporter.scss" lang="scss" scoped />
