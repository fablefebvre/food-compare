<template>
  <div v-if="product && barCode != 0">
    {{product.product_name}}
    <product-bar-code :code="barCode" />
  </div>
</template>
<script>
import productBarCode from './product-bar-code.vue';
export default {
  name: 'selectedProduct',
  data() {
    return {
      barCode: 0
    }
  },
  props: ["product"],
  watch: {
      product(newValue, oldValue) {
        this.barCode = newValue.code;
		  }
  },
  components: {
    productBarCode
  }
}
</script>
