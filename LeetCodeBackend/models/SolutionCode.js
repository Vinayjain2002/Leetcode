const mongoose = require("mongoose");

const SolutionCodeSchema = new mongoose.Schema({

    submissionId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    language: {
        type: String,
        required: true
    },

    sourceCode: {
        type: String,
        required: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model(
    "SolutionCode",
    SolutionCodeSchema
);