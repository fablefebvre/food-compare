<template>
  <div>
    <div v-if="products.length > productsPerPage">
      <b-pagination size="md" :total-rows="orderedProducts.length" v-model="currentPage" 
      :per-page="productsPerPage" @input="getProductsData(currentPage)">
      </b-pagination>
    </div>

    <b-list-group id="my-table" v-for="product of currentProducts" v-bind:data="product" v-bind:key="product.code">
      <b-list-group-item href="#" class="d-flex justify-content-between align-items-center" v-on:click="changeProduct(product)">
        <product-label :label=product.product_name :barCode=product.code />
        <product-brand :brand=product.brands />
        <div class="align-self-center"><product-note :product=product /></div>
        <product-image :product=product />
      </b-list-group-item>
    </b-list-group>
  </div>
</template>
<script>
import axios from "axios";
import productLabel from "./product-label.vue";
import productBrand from "./product-brand.vue";
import productNote from "./product-note.vue";
import productImage from "./product-image.vue";
import noteImport from "@/scripts/note.js"

export default {
  name: "bestproducts",
  data() {
    return {
      products: [],
      currentProducts: [],
      productsPerPage: 20
    };
  },
  props: ["category", "product"],
  watch: {
    category: function(newVal, oldVal) {
      axios
        .get("http://localhost:4000/api/findBestProducts/" + newVal)
        .then(response => {
          var data = response.data;
          this.products = [];
          for (var i = 0; i < data.length; i++) {
            this.products.push(data[i]);
          }
          this.getProductsData(1);
        });
    },
  },
  computed: {
    orderedProducts: function() {
      return this.products.sort(function(a,b) {
        return  noteImport.getNote(b) - noteImport.getNote(a);
      });
    }
  },
  components: {
    productLabel,
    productBrand,
    productNote,
    productImage
  },
  methods: {
    changeProduct: function(product){
      this.$emit("productChanged", product);
    },
    getProductsData(currentPage) {
      if(this.products.length > 0) {
        this.currentProducts = [];
        let max = (currentPage-1) * this.productsPerPage + this.productsPerPage;
        if(this.products.length < max) {
          max = this.products.length;
        }
        for(let i=(currentPage-1) * this.productsPerPage; i < max; i++) {
          this.currentProducts.push(this.orderedProducts[i]);
        }
      }
    }
  }
};
</script>
