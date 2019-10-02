<template>
	<span>{{note}}</span>
</template>
<script>


export default {
	name: 'productNote',
	data() {
		return {
			note: 0,
		}
	},
	props: ['product'],
	mounted() {
		// note calculated from Serge Hercberg professor see http://solidarites-sante.gouv.fr/IMG/pdf/rapport_Hercberg_15_11_2013.pdf
		var noteSH = 0;
		if(typeof this.product.nutriments!== 'undefined') {
			if('nutrition-score-fr_100g' in this.product.nutriments) {
				// note already calculated for this product
				noteSH = Number(this.product.nutriments['nutrition-score-fr_100g']);
			} else {
				// if data are available
				if(typeof this.product.nutriments['energy_100g'] !== 'undefined' &&
					typeof this.product.nutriments['saturated-fat_100g'] !== 'undefined' &&
					typeof this.product.nutriments['sugars_100g'] !== 'undefined' &&
					typeof this.product.nutriments['sodium_100g'] !== 'undefined') {
					// calculating note SH...
					console.log("calculating noteSH...")
					var energyNote = getEnergyNote(this.product.nutriments['energy_100g']);
					var saturatedFatNote = getSaturatedFatNote(this.product.nutriments['saturated-fat_100g']);
					var sugarsNote = getSugarsNote(this.product.nutriments['sugars_100g']);
					var sodiumNote = getSodiumNote(this.product.nutriments['sodium_100g']);
					var fruitsNote = getFruitsNote(this.product.nutriments['fruits-vegetables-nuts_100g_estimate']);
					var fiberNote = getFiberNote(this.product.nutriments['fiber_100g']);
					var proteinsNote = getProteinsNote(this.product.nutriments['proteins_100g']);

					console.log("\nenergyNote=" + energyNote +
								"\nsaturatedFatNote=" + saturatedFatNote +
								"\nsugarsNote=" + sugarsNote +
								"\nsodiumNote=" + sodiumNote +
								"\nfruitsNote=" + fruitsNote + 
								"\nfiberNote=" + fiberNote +
								"\nproteinsNote" + proteinsNote);

					noteSH = energyNote + saturatedFatNote + sugarsNote + sodiumNote - fruitsNote - fiberNote - proteinsNote;
					console.log('noteSH: ' + noteSH);
				} else {
					//setting note to max
					noteSH = 40;
				}
			}
			// calculating a note between 0 and 100
			this.note = Math.round(((noteSH * -1) + 40) * 100 / 55);
		} 
	}
}
</script>