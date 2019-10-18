<template>
	<b-badge :variant="computedVariant" pill>{{note}}</b-badge>
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
	computed: {
		computedVariant: function() {
			let variant = "primary";
			if(this.note > 80)  {
				variant = "success";
			}
			else if(this.note > 60)  {
				variant = "info";
			}
			else if(this.note > 40)  {
				variant = "warning";
			}
			else if(this.note > 20)  {
				variant = "warning";
			}
			else {
				variant = "danger";
			}
			return variant;
		}
	},
	mounted() {
    this.note = note.getNote(this.product);
	}
}
</script>