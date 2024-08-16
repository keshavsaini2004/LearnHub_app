const mongoose =require('mongoose');

//define the mongodb url
const mongoURL = 'mongodb://localhost:27017/courses'

// setup mongodb connection
mongoose.connect(mongoURL, {
     useNewUrlParser: true,
     useUnifiedTopology: true
     });


// Get the default connection
//Mongoose maintian a default connection object  representing the Mongodb Connection
const db =  mongoose.connection;  

//define event listeners for database connection
db.on('error', (err) =>{ 
    console.log('MongoDB connection error:',err);
});
db.on('connected', () =>{ 
    console.log('Connected to MongoDB Server');
});
db.on('disconnected', () =>{ 
    console.log('MongoDB disconnected');
});

// export the database connection

module.exports = db;



