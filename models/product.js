const mongoose = require('mongoose');//Using Module mongoose for Database
const Schema = mongoose.Schema;//schema will map to mongoose collection and define the shape of documents within that collection


//create the new schema of userModel for user
const products = new Schema({
    name: String,
    price: String,
    category: String,
    image: String,
    inStock: String,
    stockItem: String
})

module.exports = mongoose.model('Products', products);//exporting the userModel as a key User
