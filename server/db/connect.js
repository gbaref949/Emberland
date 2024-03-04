const mongoose = require("mongoose");

const connectDB = (url) => {
    return mongoose.connect(url).
    then(() => {
        console.log("database connected successfully")
    }).
    catch((err) => console.log(err));
}

module.exports = connectDB;

// const { MongoClient } = require("mongodb");
// const dbName = 'Social-Media'
// const client = new MongoClient(url);
// client.connect(function(err) {
//     if (err) {
//         console.error("Failed to connect to the database:", err);
//         return;
//     }
//     console.log("Connected successfully to the MongoDB server");

//     // Access the database
//     const database = client.db(dbName);

//     // Access the collection
//     const Posts = database.collection("posts");

//     // Now you can perform operations on the Posts collection
// });