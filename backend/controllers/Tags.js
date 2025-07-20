const Tag = require('../models/tag');


//create tag handeler

exports.createTag = async(req,res)=>{
    try{

        //fetch data
        const {name,description}= req.body;

        //validation

        if(!name||!description){
            return res.status(400).json({
                success:false,
                message:'all fields are require',
            });
        }
        //create entry in databse

        const tagDetails = await Tag.create({
            name:name,
            description:description,
        });

        console.log(tagDetails);

        return res.status(200).json({
            success:true,
            message:'tag created ',
        })

    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:err.message,
        });
    }
};

//get all tags

exports.showAlltags =  async(req,res) =>{

    try{

        const allTags = await Tag.find({},{name:true},{description:true});
        return res.status(200).json({
            success:true,
            message:'all tags return successfully',
            allTags,
        })
 
    }
    catch(err){

        return res.status(500).json({
            success:false,
            message:err.message,
        });

    }

}



