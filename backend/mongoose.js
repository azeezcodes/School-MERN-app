const mongoose = require("mongoose");
require('dotenv').config();

// Setting up MONGODB ATLAS Connection
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})
