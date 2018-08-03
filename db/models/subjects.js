let mongoose = require('mongoose')

let Schema = mongoose.Schema;

let subject = new Schema({
        time: String,
        user_agent: String,
        user_info: String,
        time_total: String
});

module.exports = mongoose.model('Subject', subject);