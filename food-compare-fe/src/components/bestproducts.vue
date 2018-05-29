<template>
	<ul>
		<li v-for="product of products" v-if="product.nutriments">
			{{product.product_name}} / <productNote :nutritionScoreFr="product.nutriments['nutrition-score-fr_100g']" />
		</li>
	</ul>
</template>
<script>
import axios from 'axios'
import productNote from './productNote.vue'

// check https://jsfiddle.net/taha_sh/krn9v4vr/

export default {
  name: 'bestproducts',
  data () {
  	return {
  		products: ''
  	}
  },
  props: ['category'],
  mounted () {
  	this.$parent.$on('event_div_' + this.category, () => {
  		console.log('receiving: event_div_' + this.category)
  		axios
	      .get('http://localhost:4000/api/findBestProducts/' + this.category)
	      .then(response => (this.products = response.data))
  	})
  },
  components: {
    productNote
  }
}
</script>
