const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')

const Product = require('./models/product');
const Farm = require('./models/farms');
//const { EWOULDBLOCK } = require ('constants')

mongoose.connect('mongodb://localhost:27017/farmStandTake2', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

//FARM ROUTES
app.get('/farms', async (req, res) => {
    const farms = await Farm.find({});
    res.render('farms/index', { farms })
})

app.get('/farms/new', (req, res)=> {
    res.render('farms/new')
})

app.post('/farms', async (req,res)=> {
    const farm = new Farm(req.body);
    await farm.save()
    res.redirect('/farms')
        // res.send(req.body)
})

app.get('/farms/:id', async (req, res) => {
    const farm = await Farm.findById(req.params.id).populate('products');
    res.render('farms/show', { farm });
})

app.delete('/farms/:id', async (req, res) => {
    const farm = await Farm.findByIdAndDelete(req.params.id);
    res.redirect('/farms')
})

app.get('/farms/:id/products/new', async (req, res) => {
    const {id} = req.params;
    const farm = await Farm.findById(id);
    res.render('products/new', {categories, farm})
})

app.post('/farms/:id/products', async (req,res) => {
    const {id} = req.params;
    const farm = await Farm.findById(id);
    const {name, price, category} = req.body; //use destructuring which easiest way to us
    const product = new Product({name, price, category});
    farm.products.push(product);
    product.farm = farm;
    await farm.save();
    await product.save();
    res.redirect(`/farms/${id}`)
})




//PRODUCT ROUTE

//membuat category untuk bisa diakses dihalaman render ejs
const categories = ['fruit', 'vegetable', 'dairy'];

app.get('/products', async (req, res) => {
    const { category } = req.query; //membuat query
    //jika menggunakan kategori dan ada maka temnukan semua produk sesuai dengan kategori
    if (category) {
        const products = await Product.find({ category })
        res.render('products/index', { products, category })
    } else {
        const products = await Product.find({})
        res.render('products/index', { products, category: 'All' })
        //All digunakan untuk mengganti kategori didalam all produk di indeks.ejs sebuah trik untuk mengakali jika tidak all maka yang keluar adalah produk kategori
    }
})

app.get('/products/new', (req, res) => {
    res.render('products/new', { categories })
})

app.post('/products', async (req, res) => {
    const newProduct = new Product(req.body);
    //new digunakan untuk menyimpan argument req body kedalam collection
    await newProduct.save();
    //save digunakan untuk memasukkan data benar2 kedalam database kita
    res.redirect(`/products/${newProduct._id}`)
    //redirect ke halaman yang baru saja ditambahkan
})

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    //karena hasil dari req params adalah object maka harus di destructuring agar bisa diakses dibawah ini.
    const product = await Product.findById(id).populate('farm', 'name'); // populate didalam model schema product dilihat di paling bawah untuk ref
     // ID sudah dalam bentuk angka karena sudah di destructuring di req.params
    res.render('products/show', { product }) // product juga dalam bentuk object maka perlu di destructuring untuk diambil
})

app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', { product, categories })
    //merender menuju halaman edit dengan cara menemukan id dari req.params kemudian digunakan. untuk memanggil ejs edit
})

app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/products/${product._id}`);
    //product._id dapat digunakan karena file product sudah dalam ranah mongo db. harusnya tetap menggunakan id dari req.params. selain menggunakan mongoose dan monggodb maka tidak bisa 
})

app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect('/products');
})



app.listen(3000, () => {
    console.log("APP IS LISTENING ON PORT 3000!")
})


