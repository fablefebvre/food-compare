<template>
	<div id="app">
		<!-- the router outlet, where all matched components would ber viewed -->
		<router-link v-bind:to="'/'">Home</router-link>
		<router-link v-bind:to="'/categories'">Categories Search</router-link>
		<router-link v-bind:to="'/barCode'">Bar Code Search</router-link>
		<router-view></router-view>
	</div>
</template>
<script>
export default {
  name: 'app'
}
</script>