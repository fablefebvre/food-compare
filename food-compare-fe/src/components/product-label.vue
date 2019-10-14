<template>
    <div>
        <a :href="'https://fr.openfoodfacts.org/produit/' + barCode">{{label}}</a>
    </div>
</template>
<script>
export default {
  name: 'product-label',
  props: ['label', 'barCode']
}
</script>
