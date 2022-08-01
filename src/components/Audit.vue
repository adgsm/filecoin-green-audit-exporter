<template>
	<section :class="auditClass">
		<div class="main-container">
			<div class="storage-providers-container">
				<StorageProviders :storage-provider="storageProvider"
					@storage-provider-changed="(sp) => {storageProvider = sp}" />
			</div>
			<div class="content-container">
				<Exporter :storage-provider="storageProvider"
					@loading="(l) => {loading = l}" />
			</div>
		</div>
		<div class="footer-container">
			<Footer />
		</div>
		<div class="loader"
			v-show="loading">
			<ProgressSpinner />
		</div>
	</section>
</template>

<script src="@/src/js/audit.js" scoped />
<style src="@/src/scss/audit.scss" lang="scss" scoped />
