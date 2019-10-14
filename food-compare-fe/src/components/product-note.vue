<template>
	<span>{{note}}</span>
</template>
<script>
import note from "@/scripts/note"

export default {
	name: 'product-note',
	data() {
		return {
			note: 0,
		}
	},
	props: ['product'],
	mounted() {
    this.note = note.getNote(this.product);
	}
}
</script>