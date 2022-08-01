<template>
	<section :class="exporterClass">
		<div class="header">
			<div class="calendar">
				<Datepicker v-model="dates" range
					@update:modelValue="datesChanged" />
			</div>
		</div>
	</section>
</template>

<script src="@/src/js/exporter/exporter.js" scoped />
<style src="@/src/scss/exporter/exporter.scss" lang="scss" scoped />
