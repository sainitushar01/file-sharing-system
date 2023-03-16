const express         =require('express');
const path            =require('path');
const fileRouter      =require('../router/fileRouter.js');
require('../mongodb/mongoose.js');
const PORT=8000;
const app=express();

//setting up path for public and view folder
const publicDirectoryPath=path.join(__dirname,'../public');
const viewDirectoryPath  =path.join(__dirname,'../views');

//making public folder accessible to server
app.use(express.static(publicDirectoryPath));


//setting configurations for template engine and view folder dir path
app.set('views',viewDirectoryPath);
app.set('view engine','hbs');


//setting up uploading and downloading file routesl
app.use(fileRouter);

app.listen(PORT,()=>{
    console.log('Server started!');
});

//should get token valid for 300 seconds
