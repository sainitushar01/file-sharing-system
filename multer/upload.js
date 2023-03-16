const multer=require('multer');

//multer storage
var Storage=multer.memoryStorage();
var upload=multer({
    storage:Storage,
});
module.exports=upload;