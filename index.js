const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRouter = require("./routes/auth");
const app = express();


mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Database connection is successful")
}).catch((err) => {
    console.log(err)
})
app.use(express.json())

app.use("/api", authRouter)


app.listen("3000", () => {
    console.log("server is running on port 3000");
})