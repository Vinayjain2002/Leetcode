const mongoose = require("mongoose");

const ExecutionLogSchema = new mongoose.Schema({

    submissionId: {
        type: String,
        required: true,
        index: true
    },

    status: {
        type: String,
        required: true
    },

    testCasesPassed: {
        type: Number,
        default: 0
    },

    testCasesFailed: {
        type: Number,
        default: 0
    },

    runtime: {
        type: Number
    },

    memory: {
        type: Number
    }

}, {
    timestamps: true
});

module.exports = mongoose.model(
    "ExecutionLog",
    ExecutionLogSchema
);