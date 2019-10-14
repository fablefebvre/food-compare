<template>
    <div>
        <barcode format="EAN13" height=60 v-bind:value="barCode" />
    </div>
</template>
<script>
import VueBarcode from "vue-barcode";

export default {
  name: 'product-bar-code',
  props: ['code'],
  computed: {
    barCode: function () {
      // left padding with zeros to have a EAN-13 barcode
      var pad = "0000000000000"
      console.log("barCode: ");
      return (pad + this.code).slice(-pad.length)
    }
  },
  components: {
    barcode: VueBarcode
  }
}
</script>
