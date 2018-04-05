const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TutorialSchema = new Schema({
    cover_title: {
        type: String,
        required: true
    },
    cover_image: {
        type: String
    },
    cover_description: {
        type: String
    },
    date_created: {
        type: Date,
        default: Date.now
    },
    steps: {
        type: Array
    },
    published: {
        type: Boolean,
        default: false
    },
    category: {
        type: Schema.ObjectId,
        ref: 'Category'
    },
});

module.exports = mongoose.model('Tutorial', TutorialSchema);
