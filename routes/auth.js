const router = require("express").Router();
const User = require("../models/User")
const CryptoJS = require("crypto-js")

//REGISTER
router.post("/register", async (req, res) => {
    const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET)
    })
    try {
        const savedUser = await newUser.save();
        res.status(200).json(savedUser)
    }
    catch (error) {
        res.status(500).json(error)
    }
})

//LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.body.username
        })
        if (!user) {
            res.status(401).json("invalid credentials")
            return;
        }
        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET);
        const password = hashedPassword.toString(CryptoJS.enc.Utf8)
        if (password !== req.body.password) {
            res.status(401).json("invalid credentials")
            return;
        }

        res.status(200).json(user)
    }
    catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router