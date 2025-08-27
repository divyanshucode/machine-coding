const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true,
        unique: true,
    },
    password: {
    type: String,
    required: true,
    }
})

userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        const salt = bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password,salt);
    }
    next();

})
const User = mongoose.model('User', userSchema);
module.exports = User;