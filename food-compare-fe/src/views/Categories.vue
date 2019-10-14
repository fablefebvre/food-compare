<template>
<div id="categories">
	<div id="search">
	  <findBar :categories="categories" @select="onCategorySelect" />
	</div>
	<div id="result">
		<b-row>
			<b-col cols="4" class="h-scroll">
				<bestproducts @productChanged="onChangeProduct" :category="category" />
			</b-col>
			<b-col cols="8">
				<selectedProduct :product="product" />
			</b-col>
		</b-row>
	</div>
</div>
</template>
<script>
import axios from 'axios'
import bestproducts from "@/components/bestproducts.vue";
import selectedProduct from "@/components/selectedProduct.vue"
import findBar from '@/components/findBar.vue'

export default {
	name:'categories',
	data() {
		return {
			search: '',
			categories: [],
			category: '',
			locale: 'fr',
			categoriesTax: [],
			product: {}
		}
	},
	mounted() {
	    axios
	      .get('http://localhost:4000/api/categoriesTax')
	      .then(response => {
	      	// saving all categories in all languages locally
	      	this.categoriesTax = response.data;
	      	// filtering only on the current locale
	      	this.categories = 
	      		// filtering category with the current this.locale
	      		this.categoriesTax.map(category => category.locales.filter(locale => locale.language == this.locale))
	      		// removing empty categories (with no traduction for current this.locale)
	      		.filter(localeCategory => localeCategory.length > 0)
	      		// we have array of 1 element so taking the first element of each array
	      		.map(c => c[0]);
	      });
	},
	computed: {
		filteredCategories:function() {
			var self=this;
			return this.categories.filter(category => category.labels.join(", ").toLowerCase().indexOf(self.search.toLowerCase())>=0);
		}
	},
	methods: {
		onCategorySelect(category) {
        	this.category = category;
		  },
		  onChangeProduct(paramProduct) {
			console.log("product: " + paramProduct);
			this.product = paramProduct;
		  }
	},
	components: {
		bestproducts,
		selectedProduct,
		findBar
	}
}
</script>