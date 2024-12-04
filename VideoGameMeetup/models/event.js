const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const eventSchema = new Schema({
    type: {
        type: String, 
        required: [true, 'type is required'],
        enum: ['tournament', 'free-play']
    },
    name: {type: String, required: [true, 'name is required']},
    game: {type: String, required: [true, 'game is required']},
    platform: {
        type: String,
        required: [true, 'platform is required'],
        enum: ['nintendo-switch', 'xbox', 'playstation', 'mobile', 'pc', 'other']
    },
    host: {type: Schema.Types.ObjectId, ref: 'User'},
    details: {type: String, required: [true, 'details is required']},
    location: {type: String, required: [true, 'location is required']},
    date: {type: String, required: [true, 'date is required']},
    startTime: {type: String, required: [true, 'startTime is required']},
    endTime: {type: String, required: [true, 'endTime is required']},
    imageFlyer: {type: String, required: [true, 'imageFlyer is required']},
    rsvps: [{
        type: Schema.Types.ObjectId,
        ref: 'Rsvp'
    }]
},
{timestamps: true}
);

module.exports = mongoose.model('Event', eventSchema);
