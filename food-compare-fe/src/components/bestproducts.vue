<template>
  <div>
    <b-list-group v-for="product of orderedProducts" v-bind:data="product" v-bind:key="product.code">
      <b-list-group-item href="#" class="flex-column align-items-start" v-on:click="changeProduct(product)">
        <div class="d-flex justify-content-between">
          <product-label :label=product.product_name :barCode=product.code />
          <product-brand :brand=product.brands />
          <product-note :product=product />
          <product-image :product=product />
        </div>
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
      products: []
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
      console.log("Barcode selected:" + product);
      this.$emit("productChanged", product)
    }
  }
};
</script>
