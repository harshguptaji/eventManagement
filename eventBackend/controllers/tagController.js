import Admin from "../models/adminModel.js";
import Tag from "../models/tagModel.js";

// Create new Tag
export const addNewTag = async(req,res) => {
    try {
        const {name,description} = req.body;

        if(!name || !description){
            return res.status(400).json({
                message: "Please fill all required fields",
                success: false
            });
        }

        const checkName = await Tag.findOne({name});
        if(checkName){
            return res.status(400).json({
                message: "This tag name is already register, try with different name.",
                success: false
            });
        }
        await Tag.create({
            name,
            description
        });
        return res.status(200).json({
            message: "Tag is created successfully",
            success: true
        });

    } catch (error) {
        console.log(`Error : not processed, ${error}`);
    }
};

// Show All Tags

export const allTags = async(_,res) => {
    try {
        const tags = await Tag.find();
        return res.status(200).json({
            message: "All tags",
            tags,
            success: true
        })
    } catch (error) {
        console.log(`Error: not processed, ${error}`);
    }
};

// Delete Tag By-ID
export const deleteTagById = async(req,res) => {
    try {
        
        const tagId = req.params.id;
        const tag = await Tag.findByIdAndDelete(tagId);

        if(!tag){
            return res.status(404).json({
                message: "This Tag is not exist any more",
                success: false
            });
        }

         // Find all admins that have this tag and remove it
         const admins = await Admin.find({ tags: tag.name });
         if(!admins){
            console.log("No Admin for this tag");
         }

         // If admins are found with the tag, remove it from their tags array
         const updatePromises = admins.map(async (admin) => {
             if (admin.tags.includes(tag.name)) { // Check if tag is included
                 admin.tags.pull(tag.name); // Remove the tag from the array
                 return admin.save(); // Save the updated admin document
             }
         });
 
         // Wait for all updates to complete
         await Promise.all(updatePromises);
        
        return res.status(200).json({
            messsage: "This tag is deleted successfully",
            success: true
        });

    } catch (error) {
        console.log(`Error: not processed, ${error}`);
    }
};