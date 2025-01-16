import mongoose from "mongoose";

const flowStepSchema = new mongoose.Schema({
    flowName: {
        type: String,
        required: true
    },
    flowOrder: {
        type: Number,
        required: true
    },
    flowDescription: {
        type: String,
        required: true
    },
    flowTag: {
        type: String,
        required: true
    },
    flowStatus: {
        type: String,
        enum: ["Not Started","In Progress","Completed"],
        default: "Not Started"
    },
    lastUpdatedBy: {
        type: String,
        required: true
    },
    lastUpdateTiming: {
        type: Date,
        default: Date.now
    }
});

const eventFlowSchema = new mongoose.Schema({
    expectedUserNumber: {
        type: String,
        unique: true,
        required: true
    },
    isLinkedWithUser: {
        type: Boolean,
        default: false
    },
    flowSteps: {
        type: [flowStepSchema],
        default: []
    },
    lastUpdateBy:{
        type: String,
        required: true
    }
});

const EventFlow = mongoose.model('EventFlow',eventFlowSchema);


export default EventFlow;