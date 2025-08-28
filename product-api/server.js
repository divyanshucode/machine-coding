const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/Product');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/product-api', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');

}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

app.post('/api/products', async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);

    } catch (error) {
        console.error('Error creating product:', error);
        res.status(400).json({ error: 'Bad Request' });
    }
})

app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(400).json({ error: 'Internal Server Error' });
    }
})

app.put('/api/products/:id', async (req, res) => {
    try {
        const updateProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true });

        if (!updateProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(updateProduct);

    } catch (error) {
        console.error('Error updating product:', error);
        res.status(400).json({ error: 'Bad Request' });
    }
})

app.delete('/api/products/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            res.status(404).json({ error: 'Product not found' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// GET /api/products?name=book&category=fiction&sort=price_desc&page=1&limit=10

app.get('/api/products', async (req, res) => {
    try {

        const filters = {};
        const sort = {};

        if (req.query.name) {
            filters.name = { $regex: req.query.name, $options: 'i' };
        }
        //  { $regex: req.query.name }: This tells MongoDB to find documents
        //  where the name field contains the string from req.query.name, rather 
        // than looking for an exact match.
        // Example: If req.query.name is "book", the regex will find "book", "storybook", and "textbook".

        // { $options: 'i' }: The 'i' stands for case-insensitive. It tells the regex to ignore case when matching.


        if (req.query.category) {
            filters.category = req.query.category;
        }


        if(req.query.sort === 'price_asc') {
            sort.price = 1;
        } else if(req.query.sort === 'price_desc') {
            sort.price = -1;
        }
         

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page-1)*limit;

        //e.g. page 3 : skip = 2*10  = 20
        //so starts from 21

        const products = await Product.find(filters).sort(sort).skip(skip).limit(limit);
        const totalCount = await Product.countDocuments(filters);

        res.status(200).json({
            products: products,
      page: page,
      limit: limit,
      total_products: totalCount,
      total_pages: Math.ceil(totalCount / limit) //total count is 37 then total pages is 4
        });
    } catch (error) {
        console.log('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})