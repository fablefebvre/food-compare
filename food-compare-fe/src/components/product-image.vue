<template>
  <div><b-img thumbnail fluid :src="img" :alt="product.product_name" /></div>
</template>
<script>
import axios from "axios";

export default {
  name: "product-image",
  props: ["product"],
  data() {
    return {
      img: ''
    };
  },
  mounted() {
    axios
      .get("https://fr.openfoodfacts.org/api/v0/produit/" + this.product.code)
      .then(response => {
        var data = response.data;
        var imageURL = data.product.image_thumb_url;
        // if image_thumb_url not defined, trying to fetch the first image in selected_images
        if (typeof imageURL == "undefined") {
          //console.debug("trying to fix code: " + data.product.code)

          var firstKeyInSelectedImages;
          for (firstKeyInSelectedImages in data.product.selected_images);
          //console.debug("firstKeyInSelectedImages: " + firstKeyInSelectedImages);
          //console.debug("selected_images[firstKeyInSelectedImages]" + data.product.selected_images[firstKeyInSelectedImages]);

          if (typeof firstKeyInSelectedImages !== "undefined") {
            var firstLang;
            for (firstLang in data.product.selected_images[
              firstKeyInSelectedImages
            ].thumb);
            //console.debug("firstLang: " + firstLang);
            imageURL =
              data.product.selected_images[firstKeyInSelectedImages].thumb[
                firstLang
              ];

            //console.debug("imageURL: " + imageURL)*/
          }
        }
        this.img = imageURL;
        //console.debug("imageURL: " + imageURL + " for code: " + data.product.code);
      });
  }
};
</script>
