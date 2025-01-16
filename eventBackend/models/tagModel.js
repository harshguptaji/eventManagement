import mongoose from "mongoose";



const tagschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    }
});

const Tag = mongoose.model('Tag',tagschema);

export default Tag;