const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ReferenceSchema = new Schema({
    name: {
        type: String
        required: true
    },
    url: {
        type: String
        required: true
    },
    date_created: {
        default: Date.now
    },
    description: {
        type: String
    }
});

module.exports = mongoose.model('Reference', ReferenceSchema);
