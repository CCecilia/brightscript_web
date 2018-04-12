const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

let ReferenceSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    date_created: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String
    }
});

ReferenceSchema.virtual('date_pretty').get(function (){
     return moment(this.date_created).format('MMMM DD, YYYY');
 });

module.exports = mongoose.model('Reference', ReferenceSchema);
