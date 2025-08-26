const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.json());
//middleware to parse json payloads

app.get('/users', async  (req, res)=>{
    try{

        const res = await  axios.get('https://jsonplaceholder.typicode.com/users');
        const data = res.data;
        res.json(data);

    }catch(error){
        console.log(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});


app.post('/users', async (req, res)=>{
    //as there is no frontend, but in newUser data from frontend will come
    //how it will look
    // {
    //   "name": "John Doe",
    //   "email": "john.doe@example.com"
    // }
    //how we are going to handle it here in code
    const newUser = req.body;

    console.log('Received new user:', newUser);
  res.status(201).json({ message: 'User created successfully', user: newUser });
})


app.put('/user/:id', async (req,res)=> {
    const userId = req.params.id;
    const updatedData = req.body;

    console.log(`Updating user ${userId} with data:`, updatedData);
    res.status(200).json({ message: 'User updated successfully', userId, updatedData });
})


app.delete('/user/:id', async (req,res)=>{
    const userId = req.params.id;

    console.log(`Deleting user ${userId}`);
    res.status(200).json({ message: 'User deleted successfully', userId });
});

// Start the server and make it listen for connections on the specified port
app.listen(port, () => {
  // This message will be logged to the console when the server starts successfully
  console.log(`Server running at http://localhost:${port}`);
});