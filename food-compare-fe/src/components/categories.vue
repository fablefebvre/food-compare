<template>
<div id="categories">
	<div id="search">
	  <findBar :categories="categories" @select="onCategorySelect" />
	</div>
	<div id="result">
		<bestproducts :category="category" />
	</div>
</div>
</template>
<script>
import axios from 'axios'
import bestproducts from './bestproducts.vue'
import findBar from './findBar.vue'

export default {
	name:'categories',
	data() {
		return {
			search: '',
			categories: [],
			category: '',
			locale: 'fr',
			categoriesTax: []
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
      	}
	},
	components: {
		bestproducts,
		findBar
	}
}
</script>