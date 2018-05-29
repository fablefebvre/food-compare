<template>
	<span>{{note}}</span>
</template>
<script>
export default {
	name: 'productNote',
	data() {
		return {
			note: 0
		}
	},
	props: ['nutritionScoreFr'],
	mounted() {
		// calculating a note between 0 and 100
		this.note = Math.round(((this.nutritionScoreFr * -1) + 40) * 100 / 55);
	}
}
</script>