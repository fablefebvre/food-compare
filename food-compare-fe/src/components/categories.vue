<template>
<div>
  Filter: <input type="text" v-model="search"/>
    <ul v-if="filteredCategories && filteredCategories.length">
      <li v-for="category of filteredCategories">
        <a href="#" v-on:click="showBestProducts('div_' + category.label)">
        	{{category.label}}
        </a>
        <div :id="'div_' + category.label" style="display: none"><bestproducts :id="'bp_' + category.label" :category="category.label"/></div>
      </li>
    </ul>
</div>
</template>
<script>
import axios from 'axios'
import bestproducts from './bestproducts.vue'

export default {
	name:'categories',
	data() {
		return {
			search: '',
			categories: []
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
			return this.categories.filter(function(category){return category.label.toLowerCase().indexOf(self.search.toLowerCase())>=0;});
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
		}
	},
	components: {
		bestproducts
	}
}
</script>