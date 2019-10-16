'use strict'

const express = require('express')

const offSortRoutes = express.Router()

const categories = [];
let parents = [];
let currentCategory = {
  parents: [],
  locales: []
};

const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('app/categories.tax')
  });

lineReader.on('line', (line) => {
    if(!line.startsWith('synonyms') && !line.startsWith('stopwords') && !line.startsWith('wikidata')) { 
      if(line != '') {
        if(line.startsWith('<')) {
          parents.push(line.substring(line.indexOf('<')+1, line.length));
        }
        else {
          let language = line.substring(0, line.indexOf(":"));
          let labels = line.substring(line.indexOf(":")+1, line.length).split(",").map(label => label.trim());
          let localeCategory = {
            language: language,
            labels: labels,
            canonicals: labels.map(label => getCanonicalValue(language + ":" + label))
          }
          currentCategory.locales.push(localeCategory);
        }
      }
      else {
        if(currentCategory.locales.length > 0) {
          currentCategory.parents = parents;
          categories.push(currentCategory);
        }
        currentCategory = new Object();
        currentCategory = {
          parents: [],
          locales: []
        };
        parents = new Array();
      }
    }
  });

var getCanonicalValue = function(category) {
// lower case + replacing spaces by dashes + removing accents
return category.toLowerCase().replace(/ /g, "-").normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

// get all unique categories in Taxonomy file
offSortRoutes.route('/categoriesTax').get(function (req, res, next) {
  res.json(categories);
})

// get categories for a product
offSortRoutes.route('/findCategories/:barCode').get(function (req, res, next) {
  
  res.json(categories);
})

// get categories from barCode
offSortRoutes.route('/findByBarCode/:barCode').get(function (req, res, next) {
  // left padding with zeros to have a EAN-13 barcode
  let pad = "0000000000000"
  let barCode = (pad + req.params.barCode).slice(-pad.length)
  const products = req.app.locals.products;
  products.find({code: barCode}).toArray(function (err, product) {
    if (err) {
      return next(new Error(err))
    }
    res.json(product) // return the product
  })
})

// get best products of category
offSortRoutes.route('/findBestProducts/:category').get(function (req, res, next) {
  let canonicalCategory = req.params.category;

  let category = findCategory(canonicalCategory);

  // 2 strategy can be applied

  // 1) searching only with the english locale should be faster but it's not so keeping option 2) for the time being
  /*var enCanonical = category.locales.filter(locale => locale.language == 'en').map(locale => locale.canonicals);
  Products.find({categories_tags: {$eq: enCanonical[0][0]}}, {code: 1, product_name: 1, brands: 1, nutriments:1}, function (err, products) {
    if (err) {
      return next(new Error(err))
    }

    //console.debug('Products: ' + products);
    res.json(products) // return the products
  })*/

  // 2) searching on all locales
  let canonicals = [].concat.apply([], category.locales.map(locale => locale.canonicals));
  const products = req.app.locals.products;

  products.find({categories_tags: {$in: canonicals}}, {projection: {code: 1, product_name: 1, brands: 1, nutriments:1}}).toArray(function (err, products) {
    if (err) {
      return next(new Error(err))
    }
    //console.debug('Products: ' + products);
    res.json(products) // return the products
  })

})

var findCategory = function (canonicalCategory) {
  //console.time("findCategory");
  for(let i=0; i<categories.length; i++) {
    let category = categories[i];
    for(let j=0; j<category.locales.length; j++) {
      let localeCategory = category.locales[j];
      if(localeCategory.canonicals.indexOf(canonicalCategory) > -1) {
        //console.timeEnd("findCategory")
        return category;
      }
    }
  }
}

module.exports = offSortRoutes