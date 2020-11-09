const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sourceSchema = new Schema({
    password: {
        type: String,
        default: ''
    },
    info: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

var Sources = mongoose.model('Source', sourceSchema);

module.exports = Sources;