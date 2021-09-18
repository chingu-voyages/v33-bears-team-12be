const router = require('express').Router();
const User = require('../models/User');
const {registrationValidation, loginValidation} = require('../validation/validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// register new user
router.post('/register', async (req, res) => {
    //validate data
    const {error} = registrationValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //check if email is already in database
    const emailExists = await User.findOne({email: req.body.email});
    if(emailExists) return res.status(400).send('Email already registered')

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try{
        const savedUser = await user.save();
        res.send({user: user._id, name: user.name, email: user.email})
    }catch(err){
        res.status(400).send(err);
    }
});

//LOGIN
router.post('/login', async (req, res) => {
    //validate data
    const {error} = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //check if email is in database
    const user = await User.findOne({email: req.body.email}).select("+password");
    if (!user) return res.status(400).send('Invalid Email');

    //pasword is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send("Invalid Password");

    //create and assign token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
});

module.exports = router;