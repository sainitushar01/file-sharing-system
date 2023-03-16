const mongoose=require('mongoose');

const File=mongoose.model('File',{
    name:{
        type:String,
        required:true,
    },
    data:{
    type:String,
    required:true,
   },
   unique_hash:{
    type:String,
    required:true,
   }
});

module.exports=File;