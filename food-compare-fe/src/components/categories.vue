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
			category: ''
		}
	},
	  mounted () {
	    axios
	      .get('http://localhost:4000/api/categoriesTax')
	      .then(response => (this.categories = response.data))
	},
	computed: {
		filteredCategories:function() {
			var self=this;
			return this.categories.filter(function(category){return category.label_fr.toLowerCase().indexOf(self.search.toLowerCase())>=0;});
		}
	},
	methods: {
		showBestProducts(category) {
			var styleCategory = document.getElementById(category).style;
			 if(styleCategory.display == 'none') {
			 	styleCategory.display = 'block';
			 	console.log('Emitting event_'+category);
			 	this.$emit('event_'+category);
			 } else {
			 	styleCategory.display = 'none';
			 }
		},
		onCategorySelect(category) {
        	console.log('Selected category:', category.label_fr);
        	this.category = category.label_fr;
      	}
	},
	components: {
		bestproducts,
		findBar
	}
}
</script>