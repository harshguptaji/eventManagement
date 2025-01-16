import mongoose from "mongoose"


const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    venue: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    users: {
        type: [String],
        default: []
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
eventSchema.pre('save', function (next) {
    if(this.isModified()){
        this.updatedTimestamp = Date.now(); // Update timestamp before saving
    }
    next();
});

const Event = mongoose.model('Event',eventSchema);

export default Event;