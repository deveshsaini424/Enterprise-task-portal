const UserModel = require("../models/userModel");
const { oauth2client } = require("../utils/googleConfig");
const axios = require('axios');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

const googleLogin = async (req, res) => {
    try {
        // ✅ CHANGE FROM req.query TO req.body
        const { code } = req.body;
        
        // ✅ SET REDIRECT URI TO 'postmessage' for @react-oauth/google
        const googleRes = await oauth2client.getToken({
            code,
            redirect_uri: 'postmessage'
        });
        
        oauth2client.setCredentials(googleRes.tokens);

        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
        );

        const { email, name, picture } = userRes.data;
        let user = await UserModel.findOne({ email });
        
        if (!user) {
            user = await UserModel.create({
                name, 
                email, 
                image: picture
            });
        }
        
        const { _id, role } = user;
        const token = jwt.sign(
            { _id, email, role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_TIMEOUT }
        );
        
        return res.status(200).json({
            message: "Success",
            token,
            user
        });
    } catch (err) {
        console.error('Google Login Error:', err);
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
};

const registerLocal = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }

    try {
        let user = await UserModel.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = await UserModel.create({
            name,
            email,
            password: hashedPassword,
        });

        const { _id, role } = user;
        const token = jwt.sign(
            { _id, email, role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_TIMEOUT }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { _id, name, email, role, image: user.image }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

const loginLocal = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }

    try {
        let user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!user.password) {
             return res.status(400).json({ message: 'This account was created with Google. Please use "Sign in with Google".' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const { _id, name, role, image } = user;
        const token = jwt.sign(
            { _id, email, role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_TIMEOUT }
        );

        res.status(200).json({
            message: 'Logged in successfully',
            token,
            user: { _id, name, email, role, image }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { googleLogin, registerLocal, loginLocal };