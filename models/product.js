//File yang digunakan untuk membentuk schema dan prasyarat untuk bisa diakses. kemudian di export agar bisa diambil oleh seeds.js

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        lowercase: true,
        enum: ['fruit', 'vegetable', 'dairy']
    }
})

//mengakses dan membuat collection
const Product = mongoose.model('Product', productSchema);
//agar collections dapat di akses maka di export terlebih dahulu. kemudian di import pada file index. untuk diproses
module.exports = Product;
