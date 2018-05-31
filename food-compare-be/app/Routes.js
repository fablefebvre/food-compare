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

var categories = [];
var categories_map = {};
var category = {
  parent: [],
  label_fr: '',
  label_en: '',
  pushed: false
};

var key = function(category) {
  return category.label_fr;
}

lineReader.on('line', function (line) {
  if(!line.startsWith('synonyms') && !line.startsWith('stopwords')) { 
    if(line != '') {
      if(category.pushed) {
        category = new Object();
        category = {
          parent: [],
          label_fr: '',
          label_en: '',
          pushed: false
        };
      }
      if(line.startsWith('<')) { 
        category.parent.push(line.substring(line.indexOf('<')+1, line.length));
      } else {
        if(line.startsWith('fr:')) { 
          category.label_fr = line.substring(line.indexOf(':')+1, line.length);
        }
        if(line.startsWith('en:')) { 
          category.label_en = line.substring(line.indexOf(':')+1, line.length);
        }
      }
    } else {
      category.pushed = true;
      if(category.label_fr != '' || category.label_en != '') {
        categories.push(category);
        categories_map[key(category)] = category;
      }
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
  Products.findOne().where('code').equals(barCode).select("product_name categories").exec(function (err, product) {
    if (err) {
      return next(new Error(err))
    }
    res.json(product) // return the product
  })
})

// get best products of category
offSortRoutes.route('/findBestProducts/:category').get(function (req, res, next) {
  var category = categories_map[req.params.category];

  var regexCategories = [];

  if(typeof category !== 'undefined') {
    // coming from categories page
    var frCategories = category.label_fr.split(",").map(category => category.trim());
    var frCanonicalValues = getCanonicalValues(frCategories);

    regexCategories = frCategories.concat(frCanonicalValues);

    if(category.label_en) {
      var enCategories = category.label_en.split(",").map(category => category.trim());
      var enCanonicalValues = getCanonicalValues(enCategories);
      regexCategories = regexCategories.concat(enCategories).concat(enCanonicalValues);
    }
  } else {
    // coming from barCode page
    category = req.params.category;
    regexCategories = [category, category.toLowerCase().replace(/ /g, "-")];
  }

  console.log("regex: " + regexCategories);

  var regex = regexCategories.map(category => new RegExp(category, "i"));;

  console.log('searching for: ' + regex);

  Products.find({categories: {$in: regex}}).select("code product_name nutriments").exec(function (err, products) {
    if (err) {
      return next(new Error(err))
    }
    res.json(products) // return the products
  })

})

var getCanonicalValues = function(categories) {
  return categories.map(category => category.toLowerCase().replace(/ /g, "-"));
}

module.exports = offSortRoutes