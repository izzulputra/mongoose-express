const mongoose = require ('mongoose');
const { Schema } = mongoose;
const Product = require('./product')

const farmSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Farm must have a name!']
    },
    city: {
        type: String
    },
    email: {
        type: String,
        required: [true, 'Email required']
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
})

//this is a mongoose middleware NOT EXPRESS MIDDLEWARE!!
farmSchema.post('findOneAndDelete', async function(farm){
    if(farm.products.length){
        const res = await Product.deleteMany({_id: {$in: farm.products}}); //farm.products adalah didalam model schema masing2. yaitu products yg ada didalam farm
        console.log(res);
    }
})

const Farm = mongoose.model('Farm', farmSchema);

module.exports = Farm;