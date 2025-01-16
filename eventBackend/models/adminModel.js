import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    number: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'subAdmin',
        enum: ['admin','subAdmin'],
        required: true
    },
    tags: {
        type: [String], // Array of strings to store tag names
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
    }
});

adminSchema.pre('save',function(next){
    this.updatedAt = Date.now();
    next();
})

const Admin = mongoose.model('Admin',adminSchema);

export default Admin;