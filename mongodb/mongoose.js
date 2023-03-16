const mongoose  =require('mongoose');

//connecting to mongodb
mongoose.connect('mongodb://127.0.0.1:27017/fileSharingApp').then(()=>console.log('Connection established!'));
