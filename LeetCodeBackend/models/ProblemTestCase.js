const mongoose = require("mongoose");

const ProblemTestCaseSchema = new mongoose.Schema({

    problemId: {
        type: String,
        required: true,
        index: true
    },

    type: {
        type: String,
        enum: ["sample", "hidden"],
        default: "hidden"
    },

    input: {
        type: String,
        required: true
    },

    expectedOutput: {
        type: String,
        required: true
    },

    weight: {
        type: Number,
        default: 1
    }

}, {
    timestamps: true
});

ProblemTestCaseSchema.index({
    problemId: 1
});

module.exports = mongoose.model(
    "ProblemTestCase",
    ProblemTestCaseSchema
);