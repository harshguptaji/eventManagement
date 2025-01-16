import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    registrationId:{
        type: String,
        unique: true,  // Ensure uniqueness
        required: true,
    },
    brandName: {
        type: String,
        required: true
    },
    batchName: {
        type: String,
        required: true
    },
    workflow: {
        type: String,
        required: true
    },
    createdBy: {
        type: String,
        required: true
    },
    updatedBy: {
        type: String,
        required: true
    },
    createdTimestamp: {
        type: Date,
        default: Date.now // Automatically set to current date when created
    },
    updatedTimestamp: {
        type: Date
    }
});

// Middleware for automatically update
userSchema.pre('save', function (next) {
    this.updatedTimestamp = Date.now(); // Update timestamp before saving
    next();
});

const User = mongoose.model('User',userSchema);

export default User;