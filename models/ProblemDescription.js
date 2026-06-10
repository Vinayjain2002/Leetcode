const mongoose= require('mongoose')

const ExampleSchema = new mongoose.Schema({
    input: {
        type: String,
        required: true
    },

    output: {
        type: String,
        required: true
    },

    explanation: {
        type: String
    }
});

const ProblemDescriptionSchema = new mongoose.Schema({

    problemId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    statement: {
        type: String,
        required: true
    },

    constraints: [{
        type: String
    }],

    examples: [ExampleSchema],

    hints: [{
        type: String
    }],

    editorial: {
        type: String
    }

}, {
    timestamps: true
});

module.exports = mongoose.model(
    "ProblemDescription",
    ProblemDescriptionSchema
);