<template>
<div>
<input v-model="barCode" @keydown.enter="select" />
<barcode v-bind:value="barCode" format="EAN13">
  Please enter a valid EAN-13 bar code.
</barcode>
{{product.product_name}}
Categories:
<ul>
	<li v-for="category in product.categories">
		{{category}}
	</li>
</ul>
<bestproducts :category="category" />
</div>
</template>
<script>
import bestproducts from './bestproducts.vue';
import axios from 'axios';
import VueBarcode from 'vue-barcode';

export default {
	data() {
		return{
			barCode: '',
			category: '',
			product: {}
		}
	},
	methods: {
		select() {
          console.log(this.barCode);
          axios.get('http://localhost:4000/api/findByBarCode/'+this.barCode)
	      .then(response => {
	      	var productData = response.data;
	      	this.product = {
	      		product_name: productData.product_name,
	      		categories: productData.categories_tags
	      	}
	      	this.category = this.product.categories[this.product.categories.length-1];
	      })
        }
	},
	components: {
		bestproducts,
		'barcode': VueBarcode
	}

}
</script>
