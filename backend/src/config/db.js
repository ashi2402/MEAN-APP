const mongoose = require("mongoose");


function connectDB () {
     console.log(
        "URI prefix:",
        process.env.MONGO_URI?.substring(0, 20)
    );
  return mongoose.connect(process.env.MONGO_URI)
  .then(() =>{console.log('Connection established');

  })
    .catch((error) => {
         console.error("MongoDB connection failed:", error);
         throw error;
    });
    
    
}

module.exports = connectDB;