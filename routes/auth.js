const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

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
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8)
        if (originalPassword !== req.body.password) {
            res.status(401).json("invalid credentials")
            return;
        }

        const accessToken = jwt.sign({
            id: user._id,
        }, process.env.JWT_SECRET,
            { expiresIn: "1hr" })

        const { password, ...others } = user._doc

        res.status(200).json({ ...others, accessToken })
    }
    catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router