let mongoose = require('mongoose')

let Schema = mongoose.Schema;

let sessions = new Schema({
        game: String,
        user_info: String,
        data: String,
        start: String,
        stop: String
});

module.exports = mongoose.model('Sessions',sessions);


