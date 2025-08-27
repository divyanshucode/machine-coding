const express = require('express');
const mongoose = require('mongoose');
const Todo = require('./models/todo');

const app = express();
const PORT = 3000;

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/todolist', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Database connection error:', err);
});

app.post('/api/todos' , async (req , res)=>{
    try{

         const todos = await Todo.create(req.body);
    res.status(201).json(todos);
    }catch(err){
        res.status(400).json({ error: 'Invalid data provided.' });
    }
   
});

app.get('/api/todos', async(req,res)=>{
    try{
        const todos = await Todo.find({});
        res.status(200).json(todos);
    }catch(err){
        res.status(500).json({ error: 'Internal server error.' });
    }

});

app.get('/api/todos/:id', async (req,res)=>{
    try{
        const todo = await Todo.findById(req.params.id);
        if(!todo){
            res.status(404).json({error: 'Todo not found.'})
        }
            res.status(200).json(todo);
    }catch(err){
        res.status(400).json({ error: 'Invalid ID format.' });
    }
})

app.put('/api/todos/:id', async(req,res)=>{
    try{
     const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true });
     if(!updatedTodo){
        res.status(404).json({error: 'Todo not found.'});
     }

     res.status(200).json(updatedTodo);
    }catch(err){
        res.status(400).json({ error: 'Invalid ID format.' });
    }
})

app.delete('/api/todos/:id', async(req,res)=>{
    try{
     const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
     if(!deletedTodo){
        res.status(404).json({error: 'Todo not found.'});
     }

     res.status(204).send();
    }catch(err){
        res.status(400).json({ error: 'Invalid ID format.' });
    }
})

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})