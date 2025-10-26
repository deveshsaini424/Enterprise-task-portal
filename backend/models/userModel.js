const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true, 
        unique: true    
    },
    image: {
        type: String
    },
    
 
    password: {
        type: String,
   
    },
  
    role: {
        type: String,
        enum: ['admin', 'employee'],
        default: 'employee'
    },

    phoneNumber: {
        type: String,
    },
    age: {
        type: Number,
    },
    fatherNumber: {
        type: String,
    },
});

const UserModel = mongoose.model('social-logins', UserSchema);
module.exports = UserModel;

