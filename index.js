const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path"); // Import 'path' module to handle file paths

const app = express();
dotenv.config();
const port = process.env.PORT || 3001;
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

mongoose.connect(process.env.MONGO_URI);

const registrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/pages/index.html")); // Using path.join to handle file paths
});

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const registrationData = new Registration({
            name,
            email,
            password
        });
        await registrationData.save();
        res.redirect("/success");
    } catch (error) {
        console.log(error);
        res.redirect("/error"); // Corrected the redirect URL
    }
});

app.get("/success", (req, res) => {
    res.sendFile(path.join(__dirname + "/pages/success.html"));
});

app.get("/error", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "error.html"));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
