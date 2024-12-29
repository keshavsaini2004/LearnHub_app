const mongoose =require('mongoose');

const mongoURL = 'mongodb://localhost:27017/learn_hub'

mongoose.connect(mongoURL, {
     useNewUrlParser: true,
     useUnifiedTopology: true
     });


const db =  mongoose.connection;  

db.on('error', (err) =>{    
    console.log('MongoDB connection error:',err);
});
db.on('connected', () =>{ 
    console.log('Connected to MongoDB Server');
});
db.on('disconnected', () =>{ 
    console.log('MongoDB disconnected');
});



module.exports = db;



