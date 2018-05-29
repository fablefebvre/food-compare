'use strict'

var express = require('express')

var mongoose = require('mongoose')
var ObjectId = mongoose.Types.ObjectId;

var offSortRoutes = express.Router()

var Products = require('./off-sort')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('app/categories.tax')
});

var categories = [];
var category = {
  parent: [],
  label: '',
  pushed: false
};

lineReader.on('line', function (line) {
  if(!line.startsWith('synonyms') && !line.startsWith('stopwords')) { 
    if(line != '') {
      if(category.pushed) {
        category = new Object();
        category = {
          parent: [],
          label: '',
          pushed: false
        };
      }
      if(line.startsWith('<')) { 
        category.parent.push(line.substring(line.indexOf('<')+1, line.length));
      } else {
        if(line.startsWith('fr:')) { 
          category.label = line.substring(line.indexOf(':')+1, line.length);
        }
      }
    } else {
      category.pushed = true;
      if(category.label != '') {
        categories.push(category);
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
      var categoriesTab = categories[i].split(',')
      for (var j = 0; j < categoriesTab.length; j++) {
        if(uniqueCategories.indexOf(categoriesTab[j]) > -1) {
            // nothing to do as the category is already in the array
          } else {
            uniqueCategories.push(categoriesTab[j]);
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
  Products.find().where('code').equals(barCode)/*.select("categories")*/.exec(function (err, categories) {
    if (err) {
      return next(new Error(err))
    }
    res.json(categories) // return the product
  })
})

// get best products of category
offSortRoutes.route('/findBestProducts/:category').get(function (req, res, next) {
  var category = req.params.category
  var regex = new RegExp(category, "i");
  Products.find().where('categories').regex(regex).select("code product_name nutriments.nutrition-score-fr_100g").sort("nutriments.nutrition-score-fr_100g").exec(function (err, categories) {
    if (err) {
      return next(new Error(err))
    }
    res.json(categories) // return the product
  })
})

module.exports = offSortRoutes