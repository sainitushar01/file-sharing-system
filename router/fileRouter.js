const express         =require('express');
const base64ToFile    = require('node-base64-to-file');
const File            =require('../model/file.js');
const upload          =require('../multer/upload.js');
const router          =new express.Router();
const getUniqueHash   =require('../hasher/hasher.js')
//Landing page of file sharing system
router.get('/',(req,res)=>{
    res.render('index');
});

//form gets submitted to this endpoint, info is collected and saved to mongodb
router.post('/uploadfile', upload.single('myFile'), async(req, res,next) => {
    const body = req.file;
  //   console.log(body);
   console.log(body.originalname);
    if (!body)
         return res.status(400).render('upload',{
             text:'Please upload a file!'
         });
    
        //checking if file already existed or not
        // console.log("name: "+body.originalname);
        try{
          const name=body.originalname;
          
          const hash=getUniqueHash(name);
          const data=body.buffer.toString('base64');
        const isExisting=await File.find({data:data});
        // console.log("isPresent: "+isExisting);
        if(isExisting.length!=0)
           return res.render('upload',{
            text:`Already Present!`,
           });
        const file=new File({
            name:name,
            data:data,
            unique_hash:`${hash}`,
        });
          await file.save();
          res.status(200).render('upload',{
            text:'File uploaded Successfully!',
          });
      }catch(e){
        console.log("Error: ",e);
      }

});
    
router.get('/download',(req,res)=>{
  res.render('download');
});
//enpoint created to download file, by passing the name of file as query parameters
router.get('/downloads', async(req, res) => {
    const filename=req.query.name;
    const hash=getUniqueHash(filename);
    // console.log(hash);
    // console.log(filename);
    if(filename=='')
      return res.status(403).send({error:'Enter a valid file name!'})
    
     try{
       const files=await File.find({name:filename});

        //  console.log(files);
       if(!files[0])
          return res.status(403).send({error:"File is not present!"});
          
        //    console.log(file[0].data);
       let nameString=files[0].name;
       var name="";
       var i=0;
       while(i<nameString.length && nameString[i]!='.'){
        name=name+nameString[i];
        i++;
       }
       i++;
    
      var extension='';
       while(i<nameString.length){
          extension=extension+nameString[i];
          i++;
       }
       if(extension.length==0){
        extension='txt';
       }
       const base64String =`data:${name}/${extension};base64,${files[0].data}`;
        //    console.log(base64String);
       const filePath = await base64ToFile(base64String, { 
          filePath: '../public/downloads',
          fileName: `${name}`, 
          types: [`${extension}`]
       });
            // console.log(filePath)
        res.status(200).send({
          success:"File is downloaded successfully",
          name:nameString,
        });
       }catch(e){  
           console.log("Error: ",e);
       }
});
    
module.exports=router;