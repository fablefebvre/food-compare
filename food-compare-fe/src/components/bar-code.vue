<template>
<div>
<input v-model="barCode" @keydown.enter="select" />
<bestproducts :category="category" />

{{product.product_name}}
Categories:
<ul>
	<li v-for="category in product.categories">
		{{category}}
	</li>
</ul>
</div>
</template>
<script>
import bestproducts from './bestproducts.vue';
import axios from 'axios';

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
	      		categories: productData.categories.split(",").map(category => category.trim())
	      	}
	      	this.category = this.product.categories[0];
	      })
        }
	},
	components: {
		bestproducts
	}

}
</script>
