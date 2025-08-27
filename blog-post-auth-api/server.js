require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User'); // The user model we defined

const authMiddleware = require('./middleware/auth');
const Post = require('./models/Post'); // Assume you have these models
const Comment = require('./models/Comment');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());

mongoose.connect(MONGO_URI, {
    newUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

app.post('/api/users/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Username already exists or invalid data.' });
    }
})

app.post('/api/users/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await findOne({ username });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const payload = {
            id: user._id,
            username: user.username
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }

});



app.get('api/posts', async (req, res) => {
    const posts = await Post.find({});
    res.status(200).json(posts);
});

app.post('api/posts', authMiddleware, async (req, res) => {
    try {
        const { title, content } = req.body;
        const post = new Post({
            title,
            content,
            author: req.userData.userId // Get author ID from the JWT payload
        });

        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create post.' });
    }
});

app.put('/api/posts/:id', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            res.status(404).json({ error: 'Post not found.' });
        }

        if (post.author.toString() !== req.userData.userId) {
            return res.status(403).json({ error: 'You are not authorized to edit this post.' });
        }
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(400).json({ error: 'Invalid data or ID format.' });
    }
})

app.delete('/api/posts/id', authMiddleware , async(req, res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({ error: 'Post not found.' });
        }
        if(post.author.toString() !== req.userData.userId){
            return res.status(403).json({ error: 'You are not authorized to delete this post.' });
        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(204).send();

    }catch(err){

    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});