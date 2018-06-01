'use strict'

var express = require('express')

var mongoose = require('mongoose')
var ObjectId = mongoose.Types.ObjectId;

var offSortRoutes = express.Router()

var Products = require('./off-sort')

var MongoClient = require("mongodb").MongoClient;

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('app/categories.tax')
});

var getKey = function(category) {
  var key = '';
  if(category.label_en != '') {
    key = 'en:' + category.label_en.substring(0, category.label_en.indexOf(','));
  } else {
    key = 'fr:' + category.label_fr.substring(0, category.label_fr.indexOf(','));;
  }
  return getCanonicalValue(key);
}

var categories = [];
var parents = [];
var currentCategory = {
  parents: [],
  locales: []
};

lineReader.on('line', function (line) {
  if(!line.startsWith('synonyms') && !line.startsWith('stopwords') && !line.startsWith('wikidata')) { 
    if(line != '') {
      if(line.startsWith('<')) {
        parents.push(line.substring(line.indexOf('<')+1, line.length));
      }
      else {
        var language = line.substring(0, line.indexOf(":"));
        var labels = line.substring(line.indexOf(":")+1, line.length).split(",").map(label => label.trim());
        var localeCategory = {
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

// get all unique categories in the db
offSortRoutes.route('/categories').get(function (req, res, next) {
  Products.find().distinct('categories', function (err, categories) {
    if (err) {
      return next(new Error(err))
    }
    var uniqueCategories = new Array()
    for (var i = 0; i < categories.length; i++) {
      if(categories[i]) {
        var categoriesTab = categories[i].split(',')
        for (var j = 0; j < categoriesTab.length; j++) {
          if(uniqueCategories.indexOf(categoriesTab[j]) > -1) {
              // nothing to do as the category is already in the array
          } else {
            uniqueCategories.push(categoriesTab[j]);
          }
        }
      }
    }
    res.json(uniqueCategories.sort()) // return all unique categories
  })
})

// get all unique categories in Taxonomy file
offSortRoutes.route('/categoriesTax').get(function (req, res, next) {
  res.json(categories);
})

// get categories from barCode
offSortRoutes.route('/findByBarCode/:barCode').get(function (req, res, next) {
  // left padding with zeros to have a EAN-13 barcode
  var pad = "0000000000000"
  var barCode = (pad + req.params.barCode).slice(-pad.length)
  Products.findOne().where('code').equals(barCode).select("product_name categories_tags").exec(function (err, product) {
    if (err) {
      return next(new Error(err))
    }
    res.json(product) // return the product
  })
})

// get best products of category
offSortRoutes.route('/findBestProducts/:category').get(function (req, res, next) {
  var canonicalCategory = req.params.category;

  var category = findCategory(canonicalCategory);

  var canonicalsTab = {}
  var canonicals = [].concat.apply([], category.locales.map(locale => locale.canonicals));

  console.log(canonicals);

  //var regex = category.canonicals.map(canonical => new RegExp(canonical, "i"));

  Products.find({categories_tags: {$in: canonicals}}).select("code product_name nutriments").exec(function (err, products) {
    if (err) {
      return next(new Error(err))
    }
    res.json(products) // return the products
  })

})

var getCanonicalValue = function(category) {
  // lower case + replacing spaces by dashes + removing accents
  return category.toLowerCase().replace(/ /g, "-").normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}


var getCanonicalValues = function(categories) {
  return categories.map(category => getCanonicalValue(category));
}

var findCategory = function (canonicalCategory) {
  console.time("findCategory");
  for(var i=0; i<categories.length; i++) {
    var category = categories[i];
    for(var j=0; j<category.locales.length; j++) {
      var localeCategory = category.locales[j];
      if(localeCategory.canonicals.indexOf(canonicalCategory) > -1) {
        console.timeEnd("findCategory")
        return category;
      }
    }
  }
}

module.exports = offSortRoutes