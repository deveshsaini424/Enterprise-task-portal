const UserModel = require("../models/userModel");
const { oauth2client } = require("../utils/googleConfig");
const axios = require('axios');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs'); // Import bcrypt

// =========== YOUR EXISTING FUNCTION (NOW WITH 'ROLE' ADDED) ===========
const googleLogin = async (req, res) => {
    try {
        const { code } = req.query;
        const googleRes = await oauth2client.getToken(code);
        oauth2client.setCredentials(googleRes.tokens);


        // This api will give user data
        const userRes = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`)

        const { email, name, picture } = userRes.data;
        let user = await UserModel.findOne({ email });
        // if user not exist then create
        if (!user) {
            user = await UserModel.create({
                name, email, image: picture
                // role will be 'employee' by default (from your model)
            })
        }
        
        // ** MODIFIED THIS LINE to include role **
        const { _id, role } = user; Original: user.role
        const token = jwt.sign({ _id, email, role }, // Add role to token
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_TIMEOUT
            }
        );
        return res.status(200).json({
            message: "Success",
            token,
            user
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

// =========== NEW FUNCTION 1: LOCAL REGISTRATION ===========
const registerLocal = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }

    try {
        // 1. Check if user already exists
        let user = await UserModel.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 2. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create new user
        user = await UserModel.create({
            name,
            email,
            password: hashedPassword,
            // role will be 'employee' by default
        });

        // 4. Create JWT token
        const { _id, role } = user;
        const token = jwt.sign({ _id, email, role },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_TIMEOUT
            }
        );

        // 5. Send back token and user
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { _id, name, email, role, image: user.image } // Don't send password back
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// =========== NEW FUNCTION 2: LOCAL LOGIN ===========
const loginLocal = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }

    try {
        // 1. Check if user exists
        let user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 2. Check if user used Google to sign up
        if (!user.password) {
             return res.status(400).json({ message: 'This account was created with Google. Please use "Sign in with Google".' });
        }

        // 3. Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 4. Create JWT token
        const { _id, name, role, image } = user;
        const token = jwt.sign({ _id, email, role },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_TIMEOUT
            }
        );

        // 5. Send back token and user
        res.status(200).json({
            message: 'Logged in successfully',
            token,
            user: { _id, name, email, role, image } // Don't send password back
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};


module.exports = { googleLogin, registerLocal, loginLocal }

