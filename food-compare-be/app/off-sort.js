var mongoose = require('mongoose')
var Schema = mongoose.Schema;

// Define collection and schema for products
module.exports = mongoose.model('Products', new Schema({ url: String, text: String, id: Number}), 'products')